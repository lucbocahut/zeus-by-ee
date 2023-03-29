import { Meteor } from 'meteor/meteor'

import Vue from 'vue'
import VueRouter from 'vue-router'

import MainLayout from '/imports/ui/layouts/MainLayout'

import ResetPassword from '/imports/ui/views/Users/ResetPassword'

import Commands from '/imports/ui/views/Commands'
import Nodes from '/imports/ui/views/Nodes'
import NodeHub from '/imports/ui/views/Nodes/Hub'

Vue.use(VueRouter)

const routes = [
  // ===================================
  // RESET PASSWORD

  { path: '/resetpassword/:resetToken', name: 'Reset Password', props: true, component: ResetPassword },

  // ===================================
  // Commands
  {
    path: '',
    component: MainLayout,
    children: [
      // Home
      { path: '', component: Nodes },

      // ===================================
      // Commands
      { path: '/commands', component: Commands },

      // ===================================
      // Nodes
      { path: '/nodes', component: Nodes },
      { path: '/nodes/:nodeId', component: NodeHub },
      { path: '/nodes/:nodeId/:section', component: NodeHub }


    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
