<template>
  <div id="main_nav_container">
    <div id="main_nav">
      <router-link to="/">
        <b-image src="/ee.png" class="main_logo" />
      </router-link>
      <div class="start">

        <router-link to="/nodes">
          <b-icon icon="rotate-orbit" />
          <span class="text"><b>EVENTS</b></span>
        </router-link>
        <router-link to="/commands">
          <b-icon icon="circle-multiple-outline" />
          <span class="text"><b>COMMANDS</b></span>
        </router-link>

      </div>
      <div class="end">
        <router-link to="#" @click.native="logout">
          <b-icon @click="logout" icon="power-standby" />
          <span class="text"><b>{{ user && user.name || 'logout' }}</b></span>

        </router-link>

      </div>
    </div>
    <div id="main_nav_spacer"></div>
  </div>
</template>
<script>
import { Meteor } from 'meteor/meteor'
import { isAdmin, isManager } from '/imports/lib/auth.js'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      date: new Date(),
      activeTab: 1
    }
  },
  meteor: {

  },
  computed: {
    user() {
      return Meteor.user()
    }
  },
  methods: {
    logout() {
      Meteor.logout()
    }
  }
}
</script>
<style lang="scss">
@keyframes appear {
  0% {
    opacity: 0
  }

  100% {
    opacity: 1
  }
}

#main_nav_spacer {
  display: block;
  position: relative;
  content: '';
  height: 50px;
}

#main_nav {

  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 50px;
  background: #000;
  border-bottom: 1px solid #eee;
  z-index: 10;
  display: flex;

  .main_logo {
    width: 30px;
    margin: 13px 20px;
  }


  .connected_user {
    display: inline-flex;

    .connected_user_info {
      font-size: smaller;

      display: flex;
      flex-direction: column;
    }

    .name {
      color: #fff;
      font-weight: bold;
    }

    .site {
      font-size: smaller;
      color: #fff;
    }

    .icon {
      margin: 4px 15px 0 15px;
      color: #ccc;
    }
  }

  .start,
  .end {
    margin-left: 20px;

    &>a {
      display: inline-block;
      margin: 4px 0;
      padding: 6px 18px;
      height: 40px;
      text-transform: capitalize;
      font-variant: uppercase;
      position: relative;

      color: #999;
      border-radius: 6px;

      &:hover {
        background: #333;
      }

      &.active {
        background: #333;
        color: #fff;
      }

      .icon {
        padding: 5px 0 0 0;

        i:before {
          position: relative;
          top: -4px;
        }
      }

      .text {
        position: absolute;
        bottom: 1px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 8px;
        text-transform: uppercase;
      }
    }

    .router-link-active {
      color: #fff;
      background: #333;
    }
  }

  .end {
    position: absolute;

    right: 5px;

    .dark-button {
      background: #000;
      color: #fff;
      border: #000;
      transition: all 0.5s ease;

      &:hover {
        background: #444;
      }
    }

    .dropdown {
      .dropdown-menu {
        .has-link {


          .icon {
            margin-top: 5px;
            margin-right: 12px;
          }

          span {}

          a {
            display: flex;
            font-size: 16px;
            padding: 10px 30px;
          }
        }
      }
    }
  }

  .navbar-item {
    text-transform: lowercase;
    font-variant: small-caps;
  }
}
</style>