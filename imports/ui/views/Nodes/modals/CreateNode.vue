<template>
  <div id="create_node" class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Connect Node</p>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <section class="modal-card-body">
      <b-field label="Host">
        <b-input v-model="host"></b-input>
      </b-field>
      <template>
        <b-field label="Admin Macaroon"></b-field>
        <b-field class="file" :class="{ 'has-name': !!adminMacaroonFile }" v-if="!macaroon">
          <b-upload @input="computeMacaroon" expanded type="is-light" drag-drop class="centered">
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large">
                  </b-icon>
                </p>
                <p>Drop your macaroon here or click to upload</p>
              </div>
            </section>
          </b-upload>
        </b-field>
        <b-field v-else>
          <p class="control">
            <b-button type="is-light" icon-left="lock-outline" label="Your macaroon has been set" disabled />
          </p>
          <p class="control">
            <b-button label="Remove" @click="macaroon = null" />
          </p>
        </b-field>
      </template>
    </section>
    <footer class="modal-card-foot">

      <b-button label="Close" @click="$emit('close')" />
      <b-button type="is-black" label="Connect Node" icon-right="chevron-right" @click="addNode"
        :loading="loadingConnection" />
    </footer>

  </div>
</template>
<script>
import { createCipheriv } from 'crypto'
import API from '/imports/api'

const convertToHex = function (input) {
  let hex = "";
  for (var i = 0; i < input.length; i++) {
    var byteStr = input.charCodeAt(i).toString(16);
    if (byteStr.length < 2) {
      byteStr = "0" + byteStr;
    }
    hex += byteStr;
  }
  console.log('should be hex', hex)
  return hex
}

export default {
  data() {

    return {
      host: '',
      adminMacaroonFile: null,
      macaroon: null,
      loadingConnection: false,
      connectionOK: false,
      result: '',
      activeTab: 0
    }
  },
  methods: {
    resetConnectionInfo() {
      adminMacaroonFile = null
      this.macaroon = null
      this.host = ''
    },
    async addNode() {
      this.loadingConnection = true
      const macaroon = this.macaroon
      const host = this.host
      try {
        const result = await API.Nodes.create({
          macaroon,
          host
        })
        if (result) {
          console.log({ result })
          this.$emit('connected', { nodeId: result })
          this.$emit('close')
        }
      } catch (e) {
        this.$buefy.toast.open({
          duration: 5000,
          message: e.toString(),
          position: 'is-bottom',
          type: 'is-danger'
        })
        this.loadingConnection = false
      }
    },

    computeMacaroon(adminMacaroonFile) {
      const context = this
      console.log(adminMacaroonFile)
      const fr = new FileReader();
      fr.onloadend = function () {
        const result = fr.result;
        let hex = convertToHex(result)
        context.macaroon = hex
      }

      fr.readAsBinaryString(adminMacaroonFile);
    }
  },
  computed: {
    channels() {
      if (!this.result) {
        return []
      }
      return this.result.channels.map(c => {
        const balance = 100 * Number(c.local_balance) / (Number(c.local_balance) + Number(c.remote_balance))
        return {
          ...c,
          balance
        }
      })
    }
  }
}
</script>
<style lang="scss">
#create_node {
  background: #f0f0f0;

  border-radius .centered {
    max-width: 300px;
    margin: auto;
    text-align: center;
  }
}
</style>