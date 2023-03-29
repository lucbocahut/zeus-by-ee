import { Meteor } from 'meteor/meteor'
import Commands from '/imports/collections/Commands'
import Nodes from '/imports/collections/Nodes'
import SimpleSchema from 'simpl-schema'

const addCommand = async function ({ eventId, nodeId, name, payload, channelId }) {
  // some tests here probably...
  // (new SimpleSchema({
  //   eventId: String,
  //   nodeId: String,
  //   name: String
  // })).validate({ eventId, nodeId, name })

  // retrieve node Info
  const nodeInfo = Nodes.findOne({ _id: nodeId })
  if (!nodeInfo) throw new Meteor.Error('Node not found')

  const insert = {
    eventId,
    nodeId,
    nodeName: nodeInfo && nodeInfo.info && nodeInfo.info.alias,
    name,
    payload,
    createdAt: new Date(),
    status: 'created',
    attempts: 0
  }

  if (channelId) insert.channelId = channelId

  return Commands.insert(insert)
}

export default addCommand

// name: String,
// nodeId: String,
// createdAt: Date,
// attempts: Number,
// status: { type: String, allowedValues: ['created', 'running', 'errored', 'confirmed', 'discarded'] },
// payload: { type: Object, blackbox: true, optional: true },