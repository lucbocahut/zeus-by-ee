<template>
  <div id="reset" class="is-flex">
    <div class="reset-body">
      <div class="">
        <p class="title">
          Zeus by EE
        </p>
        <p class="subtitle">
          Create new password
        </p>
        <hr>
        <br>
        <form v-if="!success">
          <b-message v-if="error">{{ error }}</b-message>
          <b-field label="Password" label-position="inside">
            <b-input type="password" v-model="password" @keyup.native.enter="resetPassword"></b-input>
          </b-field>

          <b-field label="Password confirmation" label-position="inside">
            <b-input type="password" v-model="password2" @keyup.native.enter="resetPassword"></b-input>
          </b-field>

          <div class="action">
            <b-button type="is-black" expanded @click="resetPassword" :loading="working">Save changes</b-button>
          </div>
          <br />
          <router-link to="/"><b-button type="is-text" label="Back to login" expanded /></router-link>
        </form>
        <div v-else>
          <b-message>Your new password has been created.</b-message>
          <router-link to="/"><b-button type="is-text" label="Login" expanded /></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

export default {
  props: ['resetToken'],
  data: () => ({
    password: '',
    password2: '',
    error: '',
    working: false,
    success: false
  }),
  methods: {
    resetPassword() {
      //
      let context = this

      this.error = ''
      if (this.password !== this.password2) {
        this.error = "Password and confirmation don't match, please check your inputs."
        return
      }

      const resetToken = this.resetToken
      this.working = true
      Accounts.resetPassword(resetToken, this.password, function (error) {
        console.log(this, context)
        if (error) {
          console.log(error)
          context.error = error
        } else {
          console.log('success')
          context.success = true
        }
        context.working = false
      })
    }
  }
}
</script>

<style lang="scss">
#reset {
  position: relative;
  display: flex;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;

  .reset-body {
    width: 320px;
    display: inline-block;
    background-color: #fff;

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