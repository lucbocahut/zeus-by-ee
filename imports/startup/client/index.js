import { Meteor } from 'meteor/meteor'
import Vue from 'vue'
import App from '/imports/ui/App.vue'
import VueMeteorTracker from 'vue-meteor-tracker'
import router from './routes'
import '@mdi/font/css/materialdesignicons.css'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Meteor.startup(() => {
  Vue.use(VueMeteorTracker)
  Vue.use(Buefy)
  new Vue({
    router,
    el: '#app',
    ...App
  })
})
