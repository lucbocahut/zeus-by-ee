import { Meteor } from 'meteor/meteor'

const roles = [
  'admin',
  'operator',
]
const isInRole = function (userId, role) {
  const userInfo = Meteor.users.findOne({ _id: userId })
  if (!userInfo) {
    return false
  }
  if (userInfo.role !== role) {
    return false
  }
  return true
}

export const hasRole = function (userId) {
  const userInfo = Meteor.users.findOne({ _id: userId })
  if (!userInfo) {
    return false
  }
  return userInfo.role
}

export const isAdmin = function (userId) {
  return isInRole(userId, 'admin')
}

export const isOperator = function (userId) {
  return isInRole(userId, 'operator') || isInRole(userId, 'admin')
}

export default {
  roles,
  isAdmin,
  isOperator,
  hasRole
}
