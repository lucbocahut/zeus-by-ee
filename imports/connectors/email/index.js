'use strict'
import { Meteor } from 'meteor/meteor'
const nodemailer = require('nodemailer')
const settings = Meteor.settings && Meteor.settings.connectors && Meteor.settings.connectors.email || { connection: {} }

// EMAIL SETTINGS
const user = settings.connection.user
const pass = settings.connection.pass
const host = settings.connection.host
const defaultMessage = settings.defaultMessage || 'Hi,\'\n\n\nThank you for your business.\n\n\nLuc Bocahut\n\n'

const defaultRecipients = settings.to

const from = settings.from // sender address
const replyTo = settings.replyTo

async function sendEmail({ recipients, cc, subject, message, html = null, attachments }) {

  // recipients
  if ((typeof recipients !== 'string') || (recipients === '')) {
    throw Error('recipients must be a non empty string')
  }

  const text = message || defaultMessage

  if (!cc) {
    cc = ''
  }
  const ccRecipients = cc.split(',')
  // to
  const to = [
    ...recipients.split(','),
    ...defaultRecipients
  ].filter(value => ccRecipients.indexOf(value) === -1)
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(',')

  // send mail with defined transport object
  if (process.env.PRODUCTION === 'true') {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user,
        pass
      }
    })
    // send mail
    await transporter.sendMail({
      from, // sender address
      replyTo,
      to, // list of receivers,
      cc,
      subject, // Subject line
      text, // plain text body
      attachments,
      html
    })
    console.log('Sent mail', result)
  } else {
    console.log('If in production we would send this mail', {
      from,
      replyTo,
      to,
      subject,
      text
    })
  }

  return 'Message sent'
}

export default sendEmail
