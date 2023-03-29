import { Meteor } from 'meteor/meteor'

const settings = Meteor.settings.connectors.email

// GLOBAL
process.env.MAIL_URL = 'smtp://' + encodeURIComponent(settings.connection.user) + ':' + encodeURIComponent(settings.connection.pass) + '@' + settings.connection.host + ':' + settings.connection.port
