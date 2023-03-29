import createEvent from '/imports/api/Events/lib/create'
import Nodes from '/imports/collections/Nodes'
import Events from '/imports/collections/Events'

async function eventHook(req, res) {
  const result = false

  try {

    const nodeId = req.params.nodeId
    // augment with event and event_type details
    const payload = req.body
    const eventName = req.get('ce-type')
    const remoteUniqueId = req.get('ce-id')
    const headers = req.headers

    // check for dupe events
    const eventInfo = Events.findOne({ remoteUniqueId })
    if (eventInfo) {
      res.status(400).json({ result: 'Duplicate event' })
    }

    // payload check
    if (!(payload)) {
      res.status(400).json({ result: 'Bad payload' })
      return false
    }

    const nodeInfo = Nodes.findOne({ _id: nodeId })
    if (!nodeInfo) {
      res.status(404).json({ result: 'Unknown resource' })
      return false
    }

    const result = await createEvent({
      remoteUniqueId,
      nodeId,
      eventName,
      payload,
      headers
    })
    if (result) {
      res.status(201).json({ result: 'OK' })
      console.log(201, 'Received event', result)
      return true
    }
  } catch (e) {
    console.log(e)
  }

  // fail if nothing good happened
  res.status(500).json({ result: 'NOK' })
  console.log(500, 'Error while receiving event', result)
}

export default eventHook
