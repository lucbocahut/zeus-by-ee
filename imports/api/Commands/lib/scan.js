import Events from '/imports/collections/Events'
import Nodes from '/imports/collections/Nodes'
import addCommand from '/imports/api/Commands/lib/create'
import dayjs from 'dayjs'

const scan = async function () {
  // scan only most recent events
  Events.update({ createdAt: { $lt: dayjs().subtract(10, 'seconds').toDate() } }, { $set: { scanned: true } })
  const events = Events.find({ scanned: false }).fetch()
  if (events.length > 0) {
    console.log('scanning', events.length, 'event.s ...')
  }

  // add Command -> todo move this to own cron loop
  for (let i = 0; i < events.length; i++) {
    const eventInfo = events[i]
    const eventId = eventInfo._id
    const eventName = eventInfo.eventName
    const nodeId = eventInfo.nodeId
    const payload = eventInfo.payload

    const nodeInfo = Nodes.findOne({ _id: nodeId })
    if (!nodeInfo) {
      Events.update({ _id: eventInfo._id }, { $set: { scanned: true } })
      continue
    }

    Events.update({ _id: eventInfo._id }, { $set: { scanned: true } })
    switch (eventName) {
      case 'encryptedenergy.command.channels.attempt_rebalance':
        if (!(nodeInfo && nodeInfo.settings && nodeInfo.settings.enableRebalance)) {
          console.log('ignoring rebalance command')
          break
        }
      case 'local.command.channels.attempt_rebalance':
        addCommand({
          eventId,
          nodeId,
          name: 'rebalance',
          payload,
          channelId: payload.outgoing_chan_id
        })

        break

      case 'encryptedenergy.command.channels.attempt_fee_policy_change':
        if (!(nodeInfo && nodeInfo.settings && nodeInfo.settings.enablePolicyUpdate)) {
          console.log('ignoring updateFee command')
          break
        }
      case 'local.command.channels.attempt_fee_policy_change':
        addCommand({
          eventId,
          nodeId,
          name: 'updateFees',
          payload,
          channelId: payload.channel_id
        })
        break
    }
  }
}

export default scan

// name: String,
// nodeId: String,
// createdAt: Date,
// attempts: Number,
// status: { type: String, allowedValues: ['created', 'running', 'errored', 'confirmed', 'discarded'] },
// payload: { type: Object, blackbox: true, optional: true },