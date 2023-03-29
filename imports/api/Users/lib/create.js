import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import SimpleSchema from 'simpl-schema'

const create = function (newUser) {
  new SimpleSchema({
    name: { type: String },
    email: { type: String }
  }).validate(newUser)
  const userInfo = Meteor.users.findOne({ "emails.address": newUser.email })
  let userId = userInfo && userInfo._id
  if (!userInfo) {
    if (!newUser.role) {
      newUser.role = 'operator'
    }
    userId = Accounts.createUser(newUser)
  }

  // default to sending email
  Accounts.sendEnrollmentEmail(userId)
  return userId
}

export default create
