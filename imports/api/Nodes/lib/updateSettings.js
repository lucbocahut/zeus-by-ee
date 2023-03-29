import { Meteor } from 'meteor/meteor'
import Nodes from '/imports/collections/Nodes'

async function updateSettings({ nodeId, settings = {} }) {
  return Nodes.update({ _id: nodeId }, { $set: { settings } })
}

export default updateSettings
