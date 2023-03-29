import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import Commands from '/imports/collections/Commands'
import create from '/imports/api/Commands/lib/create'
import tryAgain from '/imports/api/Commands/lib/tryAgain'
import { isOperator } from '/imports/lib/auth'

const nameSpace = 'Commands' // should be the same as the collection name
const actions = {
  create: {
    auth: isOperator,
    action: create
  },
  tryAgain: {
    auth: isOperator,
    action: tryAgain
  }
}

// setup actions
Object.keys(actions).forEach(name => {
  Commands[name] = function (props) {
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

export default Commands
