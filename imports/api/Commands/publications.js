import Commands from '/imports/collections/Commands'

Meteor.publish('Commands_list', function ({ nodeId } = {}) {
  const find = {}
  if (nodeId !== undefined) {
    find.nodeId = nodeId
  }
  try {
    const pointers = [
      Commands.find(find, {
        fields: {
          name: 1,
          nodeId: 1,
          nodeName: 1,
          createdAt: 1,
          attempts: 1,
          channelId: 1,
          status: 1,
          payload: 1,
          run: 1,
          result: 1,
          errorReason: 1,
          lastModified: 1
        },
        limit: 200,
        sort: {
          createdAt: -1
        }
      })
    ]
    // console.log('publishing Commands_list', nodeId, find, pointers.map(i => i.count()))
    return pointers
  } catch (e) {
    return this.ready()
  }
})

Meteor.publish('Commands_info', function ({ commandId }) {
  try {
    const pointers = [
      Commands.find({ _id: commandId }, {
        fields: {
          host: 1,
          createdAt: 1
        }
      }),
      Commands.find({ commandId }, { limit: 1000, sort: { createdAt: -1 } })
    ]
    // console.log('publishing Commands_info', commandId, pointers.map(i => i.count()))
    return pointers
  } catch (e) {
    return this.ready()
  }
})

