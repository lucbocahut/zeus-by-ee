import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { isOperator } from '/imports/lib/auth'
import create from '/imports/api/Users/lib/create'
import resetPassword from '/imports/api/Users/lib/resetPassword'

const Users = Meteor.users

const nameSpace = 'Users' // should be the same as the collection name
const actions = {
  create: {
    action: create,
    auth: isOperator
  },
  resetPassword: {
    action: resetPassword,
    auth: () => true // anyone can reset their password (no auth)
  }
}

// setup actions
Object.keys(actions).forEach(name => {
  Users[name] = function (props) {
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

export default Users
