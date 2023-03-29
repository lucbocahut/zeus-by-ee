import Nodes from '/imports/collections/Nodes'
import Events from '/imports/collections/Events'
import Commands from '/imports/collections/Commands'

async function discard({ nodeId }) {
  // remove all data related to this node
  Events.remove({ nodeId }, { multi: true })
  Commands.remove({ nodeId }, { multi: true })
  return Nodes.remove({ _id: nodeId })
}

export default discard
