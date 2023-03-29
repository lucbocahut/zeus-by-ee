import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Channels = new Mongo.Collection('Channels')

// const HistoryItem = new SimpleSchema({
//   createdAt: Date,
//   info: { type: Object, blackbox: true }
// })

const Constraints = new SimpleSchema({
  "csv_delay": SimpleSchema.Integer,
  "chan_reserve_sat": String,
  "dust_limit_sat": String,
  "max_pending_amt_msat": String,
  "min_htlc_msat": String,
  "max_accepted_htlcs": SimpleSchema.Integer
})

// const NodeInfo = new SimpleSchema({

// })

Channels.schema = new SimpleSchema({
  nodeId: String,
  active: Boolean,
  createdAt: Date,
  remote_pubkey: String,
  channel_point: String,
  chan_id: String,
  capacity: String,
  local_balance: String,
  remote_balance: String,
  commit_fee: String,
  commit_weight: String,
  fee_per_kw: String,
  unsettled_balance: String,
  total_satoshis_sent: String,
  total_satoshis_received: String,
  num_updates: String,
  pending_htlcs: { type: Array, optional: true },
  'pending_htlcs.$': { type: Object, blackbox: true, optional: true },
  csv_delay: SimpleSchema.Integer,
  private: Boolean,
  initiator: Boolean,
  chan_status_flags: String,
  local_chan_reserve_sat: SimpleSchema.Integer,
  remote_chan_reserve_sat: SimpleSchema.Integer,
  static_remote_key: Boolean,
  commitment_type: String,
  lifetime: SimpleSchema.Integer,
  uptime: SimpleSchema.Integer,
  close_address: { type: String, optional: true },
  push_amount_sat: SimpleSchema.Integer,
  thaw_height: SimpleSchema.Integer,
  local_constraints: Constraints,
  remote_constraints: Constraints,
  alias_scids: { type: Array, optional: true },
  'alias_scids.$': { type: Object, blackbox: true, optional: true },
  zero_conf: Boolean,
  zero_conf_confirmed_scid: String,
  remoteNodeAlias: String,
  channelFees: { type: Object, blackbox: true, optional: true },
  remoteNodeInfo: { type: Object, blackbox: true, optional: true },
  lastModified: { type: Date, autoValue: () => new Date() }
})

Channels.attachSchema(Channels.schema)

if (Meteor.isServer) {
  Channels.rawCollection().createIndex({ nodeId: 1 })
  Channels.rawCollection().createIndex({ chan_id: 1 }, { unique: 1 })
  Channels.rawCollection().createIndex({ createdAt: -1 })
  Channels.rawCollection().createIndex({ nodeId: 1, createdAt: -1 })
}

export default Channels
