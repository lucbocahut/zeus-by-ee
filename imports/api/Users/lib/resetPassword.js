import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import SimpleSchema from 'simpl-schema'

const resetPassword = function ({ email }) {
  const userInfo = Meteor.users.findOne({ "emails.address": email })
  if (!userInfo) {
    throw new Meteor.Error("User not found")
  }
  Accounts.sendResetPasswordEmail(userInfo._id)
  return true
}

export default resetPassword
