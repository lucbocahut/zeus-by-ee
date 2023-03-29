import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Events = new Mongo.Collection('Events')

Events.schema = new SimpleSchema({
  eventName: { type: String, optional: true },
  remoteUniqueId: String,
  nodeId: String,
  createdAt: Date,
  headers: { type: Object, blackbox: true, optional: true },
  payload: { type: Object, blackbox: true, optional: true },
  lastModified: { type: Date, autoValue: () => new Date() },
  scanned: Boolean
})

Events.attachSchema(Events.schema)

if (Meteor.isServer) {
  Events.rawCollection().createIndex({ remoteUniqueId: 1 }, { unique: 1 })
  Events.rawCollection().createIndex({ nodeId: 1 })
  Events.rawCollection().createIndex({ createdAt: -1 })
  Events.rawCollection().createIndex({ nodeId: 1, createdAt: -1 })
  Events.rawCollection().createIndex({ createdAt: -1, scanned: 1 })

}

export default Events
