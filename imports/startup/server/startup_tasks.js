import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import { Email } from 'meteor/email'
import Events from '/imports/collections/Events'
import Commands from '/imports/collections/Commands'

// cleanup on startup
console.log('* cleanup events', Events.update({ scanned: false }, { $set: { scanned: true } }, { multi: 1 }))
console.log('* cleanup commands', Commands.update({ status: { $in: ['created', 'scheduled', 'running'] } }, { $set: { status: 'expired' } }, { multi: 1 }))

Accounts.emailTemplates.siteName = 'Zeus by EE'
Accounts.emailTemplates.from = 'luc@lyb.re'

Accounts.emailTemplates.enrollAccount.subject = (user) => {
  return `Welcome to Zeus by Encrypted Energy, ${user.name}`
}

Accounts.emailTemplates.enrollAccount.text = (user, url) => {
  return `Hi ${user.name}, \n\n` + 'Your account is almost ready.' +
    ' Please follow the link to activate your account:\n\n' +
    url.replace('#/enroll-account', 'resetpassword')
}

Accounts.emailTemplates.resetPassword.from = () => {
  // Overrides the value set in `Accounts.emailTemplates.from` when resetting
  // passwords.
  return 'Zeus by EE <luc@lyb.re>'
}

Accounts.emailTemplates.resetPassword.subject = (user) => {
  return `Reset password`
}

Accounts.emailTemplates.resetPassword.text = (user, url) => {
  return `Hi ${user.name}, \n\nA password reset request was triggered for your Zeus by EE acount.` +
    ' To change your password, please click on the link and follow instructions:\n\n' +
    url.replace('#/reset-password', 'resetpassword')
}

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Email address verification!"
  },
  text(user, url) {
    return `Hi ${user}! Please confirm your email by click on the following link: ${url}`
  }
}

// ============================
// setup user document

Accounts.onCreateUser((options, user) => {
  const customizedUser = {
    ...user,
    name: options.name,
    role: options.role || 'operator'
  }

  return customizedUser
})
