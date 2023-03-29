import { Meteor } from 'meteor/meteor'
import './startup_tasks.js'
import './publications.js'
import '/imports/api'
import './dev.js'
import './cron.js'
import './routes'
import SSOAP from 'strong-soap'
import xml2js from "xml2js";


Meteor.startup(() => {
  console.log('')
  console.log('================================================================')
  if (process.env.PRODUCTION === 'true') {
    console.log('Meteor Server Started in Production mode...')
  } else {
    console.log('Meteor Server Started in Staging mode...')
  }
  console.log('================================================================')
})