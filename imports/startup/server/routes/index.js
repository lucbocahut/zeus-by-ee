import { Meteor } from 'meteor/meteor'
import express from 'express'
import bodyParser from 'body-parser'
import eventHook from '/imports/startup/server/routes/webhooks/eventHook'

const app = express()
app.use(express.json())
app.post('/events/:nodeId', eventHook)

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' })
})

WebApp.connectHandlers.use(app)
console.log('server routes created...')
