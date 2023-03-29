import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Nodes = new Mongo.Collection('Nodes')

const Chain = new SimpleSchema({
  chain: String,
  network: String
})

const Feature = new SimpleSchema({
  name: String,
  is_required: Boolean,
  is_known: Boolean
})

const Info = new SimpleSchema({
  "version": String,
  "commit_hash": String,
  "identity_pubkey": String,
  "alias": String,
  "color": String,
  "num_pending_channels": SimpleSchema.Integer,
  "num_active_channels": SimpleSchema.Integer,
  "num_inactive_channels": SimpleSchema.Integer,
  "num_peers": SimpleSchema.Integer,
  "block_height": SimpleSchema.Integer,
  "block_hash": String,
  "best_header_timestamp": String,
  "synced_to_chain": Boolean,
  "synced_to_graph": Boolean,
  "testnet": Boolean,
  "chains": [Chain],
  "uris": [String],
  "features": { type: Object, blackbox: true },
  "require_htlc_interceptor": Boolean
})

Nodes.schema = new SimpleSchema({
  createdAt: Date,
  userId: String,
  userName: String,
  host: String,
  macaroon: String,
  info: Info,
  channels: { type: Array, optional: true },
  'channels.$': { type: Object, blackbox: true, optional: true },
  settings: { type: Object, blackbox: true, optional: true },
  lastModified: { type: Date, autoValue: () => new Date() }
})

Nodes.attachSchema(Nodes.schema)

if (Meteor.isServer) {
  Nodes.rawCollection().createIndex({ host: 1 }, { unique: true })
}

export default Nodes
