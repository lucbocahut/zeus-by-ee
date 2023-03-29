import { Meteor } from 'meteor/meteor'
import { isAdmin } from '/imports/lib/auth.js'
import { check, Match } from 'meteor/check'

import migrations from '/imports/startup/server/migrations'

// this script enables basic dev functions:
// - run migrations
// - run testable functions

// testable function imports
const testableFunctions = {

}

Meteor.methods({
  async 'Dev.runMigration'({ migrationName, props = {} }) {
    const userId = this.userId
    const userInfo = Meteor.users.findOne(this.userId)
    const userName = userInfo.name
    check(userId, Match.Where(isAdmin))
    return ['started migration', await migrations[migrationName]({ userName, userId, ...props })]
  },

  async 'Dev.Test'({ name, props = {} }) {
    const userId = this.userId
    check(userId, Match.Where(isAdmin))
    console.log(`started function ${name}`)
    return testableFunctions[name](props)
  }
})
