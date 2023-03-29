import { Meteor } from 'meteor/meteor'
import Channels from '/imports/collections/Channels'
import addEvent from '/imports/api/Events/lib/create'
import dayjs from 'dayjs'

const newId = () => {
  return dayjs().valueOf() + '.' + Array.from(Array(20), () => Math.floor(Math.random() * 36).toString(36)).join('');
}
async function startRebalance({ nodeId, amount, outgoingChannelId, incomingChannelId }) {

  const outgoingChannelInfo = Channels.findOne({ nodeId, chan_id: outgoingChannelId })
  if (!outgoingChannelInfo) {
    throw new Meteor.Error("Channel not found")
  }
  const outgoing_chan_id = outgoingChannelId

  const incomingChannelInfo = Channels.findOne({ nodeId, chan_id: incomingChannelId })
  if (!incomingChannelInfo) {
    throw new Meteor.Error("Channel not found")
  }
  const last_hop_node_public_key = incomingChannelInfo.remote_pubkey

  return addEvent({
    remoteUniqueId: newId(),
    nodeId,
    eventName: 'local.command.channels.attempt_rebalance',
    payload: {
      amount,
      outgoing_chan_id,
      last_hop_node_public_key
    }
  })
}

export default startRebalance