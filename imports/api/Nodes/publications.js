import { Meteor } from 'meteor/meteor'
import Nodes from '/imports/collections/Nodes'
import Events from '/imports/collections/Events'
import Commands from '/imports/collections/Commands'
import Channels from '/imports/collections/Channels'

Meteor.publish('Nodes_list', function () {

  try {
    const userId = this.userId
    if (!userId) {
      throw new Meteor.Error('User unknown')
    }
    const pointers = [
      Nodes.find({ userId }, {
        fields: {
          host: 1,
          createdAt: 1
        }
      })
    ]
    // console.log('publishing Nodes_list', pointers.map(i => i.count()))
    return pointers
  } catch (e) {
    return this.ready()
  }
})

Meteor.publish('Nodes_info', function ({ nodeId }) {
  try {
    const pointers = [
      Nodes.find({ _id: nodeId }, {
        fields: {
          host: 1,
          createdAt: 1,
          info: 1,
          channels: 1,
          settings: 1
        }
      }),
      Channels.find({ nodeId }),
      Events.find({ nodeId }, { limit: 100, sort: { createdAt: -1 } }),
      Commands.find({ nodeId }, { limit: 100, sort: { createdAt: -1 } })
    ]
    // console.log('publishing Nodes_info', nodeId, pointers.map(i => i.count()))
    return pointers
  } catch (e) {
    return this.ready()
  }
})

