import Commands from '/imports/collections/Commands'
import Nodes from '/imports/collections/Nodes'
import lnd from '/imports/connectors/lnd'

const rebalance = async function (commandInfo) {

  const commandId = commandInfo._id
  const nodeId = commandInfo.nodeId
  let amount = commandInfo.payload && commandInfo.payload.amount
  const channelId = commandInfo.payload && commandInfo.payload.outgoing_chan_id
  const lastHop = commandInfo.payload && commandInfo.payload.last_hop_node_public_key
  let invoice = commandInfo.run && commandInfo.run.invoice
  let route = commandInfo.run && commandInfo.run.route

  Commands.update({ _id: commandId }, { $set: { 'status': 'running' } })

  try {
    // check settings
    const nodeInfo = Nodes.findOne({ _id: nodeId })
    const maxFeesPercent = nodeInfo.settings && nodeInfo.settings.maxFeesPercent || 1
    const maxTime = nodeInfo.settings && nodeInfo.settings.maxTime || 1
    const minAmount = nodeInfo.settings && nodeInfo.settings.minAmount || 10000
    const maxAmount = nodeInfo.settings && nodeInfo.settings.maxAmount || 200000

    if (maxAmount < amount) {
      amount = maxAmount
    }

    // check amount
    if (Number(amount) <= Number(minAmount)) {
      throw new Meteor.Error('Amount too low')
    }

    const LND = lnd(nodeId)
    // create invoice
    if (!invoice) {
      invoice = await LND.createInvoice({ amount, channelId, lastHop })
      Commands.update({ _id: commandId }, { $set: { 'run.invoice': invoice } })
    }

    // check route (always refresh this)
    route = await LND.queryRoutes({ amount, lastHop, channelId })
    Commands.update({ _id: commandId }, { $set: { 'run.route': route } })

    // try multiple payments with rising fees
    const minFee = route.routes ? Math.min(route.routes.map(i => Number(i.total_fees))) : 1

    const feeLimitMsat = Math.round(amount * (maxFeesPercent / 100) * 1000)
    Commands.update({ _id: commandId }, { $set: { 'run.fees': { minFee, feeLimitMsat } } })

    // try payment
    const paymentRequest = invoice.payment_request
    const payment = await LND.payInvoice({ paymentRequest, feeLimitMsat, timeLimit: maxTime })
    const paymentInfo = await LND.getPaymentInfo({ paymentHash: payment.result.payment_hash })
    console.log({ paymentInfo })

    Commands.update({ _id: commandId }, { $set: { 'run.payment': payment } })

    if (payment && payment.result && payment.result.status && payment.result.status === 'FAILED') {
      throw new Meteor.Error(payment.result.failure_reason || 'Something went wrong')
    }
    if (payment && payment.code) {
      const errorMsg = `code ${payment.code}: ${payment.message}`
      throw new Meteor.Error(errorMsg)
    }

    Commands.update({ _id: commandId }, {
      $set: {
        status: 'confirmed',
        result: payment
      }
    })
    return true

  } catch (e) {
    console.error('REBALANCE ERROR', e)
    Commands.update({ _id: commandId }, {
      $set: {
        status: 'errored',
        errorReason: e.toString()
      }
    })
    return false
  }
}

export default rebalance

