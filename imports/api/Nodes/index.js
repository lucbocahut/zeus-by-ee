import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { isOperator } from '/imports/lib/auth'
import Nodes from '/imports/collections/Nodes'
import create from '/imports/api/Nodes/lib/create'
import discard from '/imports/api/Nodes/lib/discard'
import updateChannels from './lib/updateChannels'
import updateFees from './lib/updateFees'
import updateSettings from './lib/updateSettings'
import startRebalance from './lib/startRebalance'

const nameSpace = 'Nodes' // should be the same as the collection name
const actions = {
  create: {
    auth: isOperator,
    action: create
  },
  discard: {
    auth: isOperator,
    action: discard
  },
  updateChannels: {
    auth: isOperator,
    action: updateChannels
  },
  updateFees: {
    auth: isOperator,
    action: updateFees
  },
  updateSettings: {
    auth: isOperator,
    action: updateSettings
  },
  startRebalance: {
    auth: isOperator,
    action: startRebalance
  }
}

// setup actions
Object.keys(actions).forEach(name => {
  Nodes[name] = function (props) {
    return new Promise((resolve, reject) => {
      Meteor.call(
        `${nameSpace}.${name}`, props, (error, result) => {
          if (error) reject(error)
          resolve(result)
        }
      )
    })
  }

  Meteor.methods({
    [`${nameSpace}.${name}`](props) {
      console.log(`invoking ${nameSpace}.${name}`)
      const userId = this.userId
      const userInfo = Meteor.users.findOne(this.userId)
      const userName = userInfo && userInfo.name
      check(userId, Match.Where(actions[name].auth))
      return actions[name].action({ ...props, userId, userName })
    }
  })
})

export default Nodes
