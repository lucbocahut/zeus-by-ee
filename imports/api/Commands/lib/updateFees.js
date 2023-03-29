import Commands from '/imports/collections/Commands'
import Nodes from '/imports/collections/Nodes'
import lnd from '/imports/connectors/lnd'

const updateFees = async function (commandInfo) {

  const commandId = commandInfo._id
  const nodeId = commandInfo.nodeId
  const channelId = commandInfo.payload && commandInfo.payload.channel_id
  const baseFee = commandInfo.payload && commandInfo.payload.base_fee_msat
  const ppmFee = commandInfo.payload && commandInfo.payload.fee_rate_per_mil
  let channelInfo = commandInfo.run && commandInfo.run.channelInfo

  console.log({ commandId, nodeId, channelId, baseFee, ppmFee })

  try {
    // check settings
    const nodeInfo = Nodes.findOne({ _id: nodeId })
    const maxFeesPercent = nodeInfo.settings && nodeInfo.settings.maxFeesPercent || 1

    const LND = lnd(nodeId)

    // get Channel Info
    if (!channelInfo) {
      const channels = await LND.getFees()
      channelInfo = channels.channel_fees.find(c => c.chan_id === channelId)
      Commands.update({ _id: commandId }, { $set: { 'run.channelInfo': channelInfo } })
    }
    //channelPoint, baseFee, ppmFee
    const channelPoint = channelInfo.channel_point
    const feeUpdateResult = await LND.updateChannelPolicy({ channelPoint, baseFee, ppmFee })

    console.log({ feeUpdateResult })
    if (!feeUpdateResult) {
      throw new Meteor.Error('Something went wrong')
    }
    if (feeUpdateResult && feeUpdateResult.code) {
      const errorMsg = `code ${feeUpdateResult.code}: ${feeUpdateResult.message}`
      throw new Meteor.Error(errorMsg)
    }

    Commands.update({ _id: commandId }, {
      $set: {
        status: 'confirmed',
        result: feeUpdateResult
      }
    })
    return true

  } catch (e) {
    console.error(e)
    Commands.update({ _id: commandId }, {
      $set: {
        status: 'errored',
        errorReason: e.toString()
      }
    })
    return false
  }
}

export default updateFees

