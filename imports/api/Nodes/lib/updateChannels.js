import { Meteor } from 'meteor/meteor'
import lnd from '/imports/connectors/lnd'
import Nodes from '/imports/collections/Nodes'
import Channels from '/imports/collections/Channels'

async function updateChannels({ nodeId }) {
  const nodeInfo = Nodes.findOne({ _id: nodeId })
  if (!nodeInfo) {
    throw new Meteor.Error('node not found')
  }

  try {
    const LND = lnd(nodeId)
    // existing channels
    const existingChannels = Channels.find({ nodeId }).fetch()

    // get channels
    const channelResponse = await LND.getChannels()
    const channelBalances = await LND.getChannelBalances()
    console.log('channelBalances', channelBalances)
    const feesResponse = await LND.getFees()
    if (channelResponse && channelResponse.channels) {
      const channels = []
      for (let i = 0; i < channelResponse.channels.length; i++) {
        const channel = channelResponse.channels[i]
        const remoteNodeInfo = await LND.getRemoteInfo({ remotePubKey: channel.remote_pubkey })
        const channelFees = feesResponse.channel_fees.find(c => c.chan_id === channel.chan_id)
        const insert = {
          ...channel,
          nodeId,
          remoteNodeAlias: remoteNodeInfo && remoteNodeInfo.node && remoteNodeInfo.node.alias,
          remoteNodeInfo,
          channelFees,
          createdAt: new Date()
        }
        const channelInfo = Channels.findOne({ chan_id: channel.chan_id })
        if (!channelInfo) {
          Channels.insert(insert)
        } else {
          Channels.update({ chan_id: channel.chan_id }, {
            $set: {
              ...channel,
              remoteNodeInfo,
              channelFees
            }
          })
        }
      }

      // remove channels that are no longer there
      const existingChannelIds = existingChannels.map(c => c.chan_id)
      const newChannelIds = channelResponse.channels.map(c => c.chan_id)
      const removedChannelIds = existingChannelIds.filter(c => !newChannelIds.includes(c))
      if (removedChannelIds.length) {
        Channels.remove({ chan_id: { $in: removedChannelIds } })
      }

      return true
    }
    return false

  } catch (err) {
    console.error(err)
    throw new Meteor.Error(err.toString())
  }
}

export default updateChannels
