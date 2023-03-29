import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import Channels from '/imports/collections/Channels'

const nameSpace = 'Channels' // should be the same as the collection name
const actions = {

}

// setup actions
Object.keys(actions).forEach(name => {
  Channels[name] = function (props) {
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

export default Channels
