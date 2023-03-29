import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Commands = new Mongo.Collection('Commands')

const HistoryItem = new SimpleSchema({
  createdAt: Date,
  info: { type: Object, blackbox: true }
})

Commands.schema = new SimpleSchema({
  name: String,
  nodeId: String,
  eventId: String,
  nodeName: { type: String, optional: true },
  channelId: { type: String, optional: true },
  createdAt: Date,
  attempts: Number,
  status: { type: String, allowedValues: ['created', 'scheduled', 'running', 'errored', 'confirmed', 'expired', 'discarded'] },
  payload: { type: Object, blackbox: true, optional: true },
  run: { type: Object, blackbox: true, optional: true },
  result: { type: Object, blackbox: true, optional: true },
  errorReason: { type: String, optional: true },
  history: { type: Array, optional: true },
  'history.$': HistoryItem,
  lastModified: { type: Date, autoValue: () => new Date() }
})

Commands.attachSchema(Commands.schema)

if (Meteor.isServer) {
  Commands.rawCollection().createIndex({ nodeId: 1 })
  Commands.rawCollection().createIndex({ eventId: 1 }, { unique: 1 })
  Commands.rawCollection().createIndex({ status: 1 })
  Commands.rawCollection().createIndex({ createdAt: -1 })
  Commands.rawCollection().createIndex({ nodeId: 1, createdAt: -1 })
}

export default Commands
