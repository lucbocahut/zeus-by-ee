import Nodes from '/imports/collections/Nodes'
import createInvoice from './lib/createInvoice'
import getChannels from './lib/getChannels'
import getChannelBalances from './lib/getChannelBalances'
import getPaymentInfo from './lib/getPaymentInfo'
import getInfo from './lib/getInfo'
import getFees from './lib/getFees'
import getRemoteInfo from './lib/getRemoteInfo'
import payInvoice from './lib/payInvoice2'
import queryRoutes from './lib/queryRoutes'
import updateChannelPolicy from './lib/updateChannelPolicy'

const endpoints = {
  createInvoice,
  getChannels,
  getChannelBalances,
  getFees,
  getInfo,
  getRemoteInfo,
  getPaymentInfo,
  payInvoice,
  queryRoutes,
  updateChannelPolicy
}

export default (nodeId) => {
  const { host, macaroon, info: { identity_pubkey: nodePubkey } } = Nodes.findOne({ _id: nodeId })
  const lnd = {}
  Object.keys(endpoints).forEach(k => {
    lnd[k] = (params = {}) => endpoints[k]({ ...params, host, macaroon, nodePubkey })
  })
  return lnd
}