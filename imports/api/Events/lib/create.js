import { Meteor } from 'meteor/meteor'
import { fetch, Headers } from 'meteor/fetch'
import Nodes from '/imports/collections/Nodes'
import Events from '/imports/collections/Events'

async function create({ nodeId, eventName, payload, remoteUniqueId, headers }) {
  //console.log('invoking create')

  // some tests here probably...
  const nodeInfo = Nodes.findOne({ _id: nodeId })
  if (!nodeInfo) {
    console.log('ignored event: unknown node')
    return false
  }

  return Events.insert({
    nodeId,
    eventName,
    headers,
    remoteUniqueId,
    payload,
    createdAt: new Date(),
    scanned: false
  })
}

export default create
