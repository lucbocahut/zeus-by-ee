<template>
  <div id="create_node" class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Update Channel Policy</p>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <section class="modal-card-body">
      <b-field label="BaseFee (msats)">
        <b-input v-model="baseFee"></b-input>
      </b-field>
      <b-field label="ppmFee (variable fee per million)">
        <b-input v-model="ppmFee"></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button label="Close" @click="$emit('close')" />
      <b-button type="is-black" label="Update" icon-right="chevron-right" @click="updateFees"
        :loading="loadingConnection" />
    </footer>
  </div>
</template>
<script>
import API from '/imports/api'

export default {
  props: [
    'nodeId',
    'channelId',
    'baseFee',
    'ppmFee'
  ],
  data() {
    return {
      loadingConnection: false,
      connectionOK: false,
      result: ''
    }
  },
  methods: {
    async updateFees() {
      this.loadingConnection = true
      const nodeId = this.nodeId
      const channelId = this.channelId
      const baseFee = this.baseFee
      const ppmFee = this.ppmFee
      try {
        const result = await API.Nodes.updateFees({
          nodeId,
          channelId,
          baseFee,
          ppmFee
        })
        if (result) {
          console.log({ result })
          this.$emit('updated', { nodeId: result })
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