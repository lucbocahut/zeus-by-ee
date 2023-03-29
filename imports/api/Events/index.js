import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import Events from '/imports/collections/Events'
import create from '/imports/api/Events/lib/create'
import { isOperator } from '/imports/lib/auth'

const nameSpace = 'Events' // should be the same as the collection
const actions = {
  create: {
    auth: isOperator,
    action: create
  }
}

// setup actions
Object.keys(actions).forEach(name => {
  Events[name] = function (props) {
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
      console.log(`invoking ${nameSpace}.${name}`, { ...props })
      const userId = this.userId
      const userInfo = Meteor.users.findOne(this.userId)
      const userName = userInfo && userInfo.name
      check(userId, Match.Where(actions[name].auth))
      return actions[name].action({ ...props, userId, userName })
    }
  })
})

export default Events
