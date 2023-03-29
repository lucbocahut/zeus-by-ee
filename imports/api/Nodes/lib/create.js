import { Meteor } from 'meteor/meteor'
import getInfo from '/imports/connectors/lnd/lib/getInfo'
import Nodes from '/imports/collections/Nodes'

async function create({ host, macaroon, userId, userName }) {
  const url = `https://${host}:8080/v1/channels`

  // is the node already in our system?
  const nodeInfo = Nodes.findOne({ host })
  if (nodeInfo) {
    throw new Meteor.Error('Node already exists')
  }

  // does the connection work
  const info = await getInfo({ host, macaroon })

  if (!info) {
    throw new Meteor.Error("Can't connect to node")
  }

  const record = {
    host,
    macaroon,
    createdAt: new Date(),
    info,
    userId,
    userName
  }
  console.log(record)
  return Nodes.insert(record)
}

export default create
