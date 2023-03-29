<template>
  <div id="login">
    <div class="login-body">
      <div class="">
        <p class="title">
          Zeus
        </p>

        <template v-if="show === 'create'">
          <p class="subtitle">Account creation</p>
          <hr>
          <br>
          <template v-if="created === false">
            <form key="create">
              <b-message>
                Setup a new account to manage your nodes independently and securly.
              </b-message>
              <b-message v-if="error" type="is-error">{{ error }}</b-message>
              <b-field label="Name" label-position="inside">
                <b-input type="text" v-model="newUser.name"></b-input>
              </b-field>

              <b-field label="Email" label-position="inside">
                <b-input type="email" v-model="newUser.email"></b-input>
              </b-field>

              <b-message type="is-danger" v-if="createError">{{ createError }}</b-message>
              <div class="action">
                <b-button type="is-dark" expanded @click="create" :loading="creating">Create new account</b-button>
              </div>

              <br />
              <div class="action">
                <b-button type="is-text" expanded @click="show = false;">Looking to login
                  instead?</b-button>
              </div>
            </form>
          </template>

          <template v-else>
            <b-message>
              Please confirm your account by clicking the link in the email we just sent you.
            </b-message>
            <div class="actions">
              <p>Don't see our email?</p>
              <b-button label="Resend email" @click="create" type="is-text" expanded />
            </div>
          </template>
        </template>
        <template v-else-if="show === 'resetPassword'">
          <template v-if="resetPasswordSuccess === false">
            <p class="subtitle">Reset password</p>
            <hr>
            <br>
            <form key="resetPassword">
              <b-message>
                Enter your email adress to reset your password.
              </b-message>
              <b-message v-if="resetError" type="is-error">{{ resetError }}</b-message>
              <b-field label="Email" label-position="inside">
                <b-input type="email" v-model="resetPasswordEmail"></b-input>
              </b-field>
              <div class="action">
                <b-button type="is-dark" expanded @click="resetPassword" :loading="resettingPassword">Reset
                  password</b-button>
              </div>
              <br />
              <div class="action">
                <b-button type="is-text" expanded @click="show = false;">Looking to login
                  instead?</b-button>
              </div>
            </form>
          </template>
          <template v-else>
            <b-message>
              Please confirm your account by clicking the link in the email we just sent you.
            </b-message>
            <div class="actions">
              <p>Don't see our email?</p>
              <br />
              <b-button type="is-dark" expanded @click="resetPassword" :loading="resettingPassword">Reset
                password again</b-button>
            </div>
          </template>
        </template>
        <template v-else>
          <p class="subtitle">Connection</p>
          <hr>
          <br>
          <form key="login">
            <b-message v-if="error" type="is-error">{{ error }}</b-message>
            <b-field label="Email" label-position="inside">
              <b-input type="email" v-model="email" @keyup.native.enter="login">
              </b-input>
            </b-field>
            <b-field label="Password" label-position="inside">
              <b-input type="password" v-model="password" @keyup.native.enter="login"></b-input>
            </b-field>
            <div class="action">
              <b-button type="is-black" expanded @click="login" :loading="loggingIn">Login</b-button>
            </div>
            <br />
            <div class="action">
              <b-button type="is-text" expanded @click="show = 'resetPassword'">Need to reset your
                password?</b-button>
            </div>
            <br />
            <div class="action">
              <b-button type="is-text" label="Don't have an account? Create one now." @click="show = 'create'" />
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { Meteor } from 'meteor/meteor'
import API from '/imports/api'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      site: null,
      siteError: false,
      show: null,
      creating: false,
      created: false,
      newUser: {
        name: '',
        email: ''
      },
      resetPasswordEmail: '',
      resettingPassword: false,
      resetPasswordSuccess: false,
      resetError: '',
      createError: null
    }
  },
  meteor: {
    userID() {
      return Meteor.userId()
    },
    user() {
      return Meteor.user({})
    },
    loggingIn() {
      return Meteor.loggingIn()
    }
  },
  methods: {
    login() {
      console.log('login...')
      const context = this
      const email = context.email
      const password = context.password
      Meteor.loginWithPassword({ email }, password, function (error) {
        if (error) {
          console.log('login', error)
          context.error = error.message
        } else {
          context.$buefy.toast.open('Login successful')
        }
      })
    },
    logout() {
      Meteor.logout()
    },
    reset() {
      this.createError = ''
      this.newUser = {
        name: '',
        email: ''
      }
    },
    async create() {
      const context = this
      if (context.creating) {
        return
      }
      context.creating = true
      const newUser = context.newUser
      try {
        await API.Users.create(newUser)
        context.created = true
        context.creating = false
        context.$buefy.toast.open('User created')
      } catch (e) {
        context.creating = false
        context.createError = e.toString()
      }
    },
    async resend() {

    },
    async resetPassword() {
      const context = this
      if (context.resettingPassword) {
        return
      }
      context.resettingPassword = true
      const email = context.resetPasswordEmail
      try {
        await API.Users.resetPassword({ email })
        context.resetPasswordSuccess = true
        context.resettingPassword = false
        context.$buefy.toast.open('Reset request sent')
      } catch (e) {
        context.resettingPassword = false
        context.resetError = e.toString()
      }
    }
  }
}
</script>
<style lang="scss">
#login {
  position: relative;
  display: flex;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);

  justify-content: center;
  align-items: center;
  text-align: center;

  .login-body {
    width: 320px;
    display: inline-block;
    background-color: #fff;

    form {
      text-align: left;
    }

    @media all and (max-width: 330px) {
      width: 100%;
      padding: 5px;
    }

    .action {
      text-align: right;
    }
  }

  hr {
    width: 50%;
    margin: 0 25%;
  }
}
</style>