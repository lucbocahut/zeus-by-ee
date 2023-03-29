
// migrations are an essential part of the life of an app.
// the idea here is to sequence out migrations incrementally so it is obvious which migration comes first
// another major aspect is to make migrations idempotent: running a migration twice or several times should not break the app

// we simply use dates
// V2022_08_15

// the migration function is passed the user object
// the user object is the user that is running the migration
// this is useful to know who is running the migration

// to run the migration, simply run the following command:
// Meteor.call('Dev.runMigration', { migrationName: 'V2023_03_28'})

import { Meteor } from 'meteor/meteor'
import { isAdmin } from '/imports/lib/auth'
import { check, Match } from 'meteor/check'

const V2022_08_15 = async ({ userId, userName }) => {
  // example migration
  console.log('placeholder migration', { userId, userName })
}

const V2023_03_28 = async ({ userId, userName }) => {
  // example migration
  console.log('user to operator migration', { userId, userName })
  // only admins can run this migration
  check(userId, Match.Where(isAdmin))
  Meteor.users.update({ role: { $exists: false } }, { $set: { role: 'operator' } }, { multi: true })
}

export default {
  V2022_08_15,
  V2023_03_28
}
