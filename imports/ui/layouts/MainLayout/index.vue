<template>
  <div id="main-layout">
    <template v-if="userId">
      <MainMenu />
      <router-view></router-view>
    </template>
    <template v-else>
      <Login />
    </template>
  </div>
</template>
<script>
import { Meteor } from 'meteor/meteor'
import Login from '/imports/ui/views/Users/Login.vue'
import MainMenu from '/imports/ui/layouts/MainLayout/MainMenu.vue'

export default {
  components: {
    Login,
    MainMenu
  },
  data() {
    return {}
  },
  meteor: {
    userId() {
      return Meteor.userId()
    }
  }
}
</script>
<style lang="scss">
pre {
  max-height: 300px;
  overflow-y: auto;
}
</style>