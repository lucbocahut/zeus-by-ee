<template>
  <div id="home">
    <h1 class="title is-1">Hello World</h1>

    <section>
      <b-field label="Name">
          <b-input v-model="ticker"></b-input>
          <b-select v-model="yellowKey">
            <option value="curncy">curncy</option>
            <option value="index">index</option>
            <option value="comdty">comdty</option>            
          </b-select>
      </b-field>
    </section>
    <b-button @click="testIt" label="Get quote" :loading="loading"/>
    
    <hr/>
    <pre>{{ result }}</pre>
  </div>
</template>

<script>
/* globals FileReader */
import { Meteor } from 'meteor/meteor'

export default {
  data () {
    return {
      ticker: 'ESH3',
      yellowKey: 'index',
      result: null,
      loading: false
    }
  },
  computed: {
  },
  meteor: {
    
  },
  methods: {
    async testIt() {
      const ticker = this.ticker
      const yellowKey = this.yellowKey
      
      this.loading = true
      const result = Meteor.call('getQuote', { ticker, yellowKey })
      this.result = result
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
#home {
  padding: 20px;
  background: #f0f0f0;
}
</style>