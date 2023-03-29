<template>
  <div id="rebalance" class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Initiate rebalancing</p>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <section class="modal-card-body">
      <b-message>Select an outgoing and incoming channel and the amount to transfert...</b-message>
      <b-field label="Outgoing channel">
        <b-dropdown aria-role="list" v-model="outgoingChannelId" @input="updateAmount">
          <template #trigger="{ active }">
            <b-button :label="(outgoingChannel && outgoingChannel.remoteNodeAlias) || 'Select an outgoing channel...'"
              type="" :icon-right="active ? 'menu-up' : 'menu-down'" />
          </template>

          <template v-for="channel in channels">
            <b-dropdown-item aria-role="listitem" :value="channel.chan_id">{{ channel.remoteNodeAlias }} ---
              {{ formatSats(channel.totalBalance) }} {{ channel.percentLocal }}% ic
            </b-dropdown-item>
          </template>
        </b-dropdown>
      </b-field>
      <div v-if="outgoingChannelId" class="channelInfo">
        <div><b>local balance:</b> {{ formatSats(outgoingChannel.local_balance) }}</div>
        <div><b>remote balance:</b> {{ formatSats(outgoingChannel.remote_balance) }}</div>
        <div><b>inbound capacity:</b> {{ outgoingChannel.percentLocal }}%</div>
      </div>
      <b-slider v-if="outgoingChannelResultingIC" size="is-medium" :min="0" :max="100" :value="outgoingChannelResultingIC"
        disabled type="is-warning">
        <template>
          <b-slider-tick v-for="val in [25, 50, 75]" :value="val" :key="val">{{ val }}</b-slider-tick>
        </template>
      </b-slider>

      <b-field label="Target channel">
        <b-dropdown aria-role="list" v-model="targetChannelId" @input="updateAmount">
          <template #trigger="{ active }">
            <b-button :label="(targetChannel && targetChannel.remoteNodeAlias) || 'Select an incoming channel...'" type=""
              :icon-right="active ? 'menu-up' : 'menu-down'" />
          </template>

          <template v-for="channel in targetChannels">
            <b-dropdown-item aria-role="listitem" :value="channel.chan_id">{{ channel.remoteNodeAlias }} ---
              {{ formatSats(channel.totalBalance) }} {{ channel.percentLocal }}% ic</b-dropdown-item>
          </template>
        </b-dropdown>
      </b-field>
      <div v-if="targetChannelId" class="channelInfo">
        <div><b>local balance:</b> {{ formatSats(targetChannel.local_balance) }}</div>
        <div><b>remote balance:</b> {{ formatSats(targetChannel.remote_balance) }}</div>
        <div><b>inbound capacity:</b> {{ targetChannel.percentLocal }}%</div>
      </div>
      <b-slider v-if="targetChannelResultingIC !== undefined" size="is-medium" :min="0" :max="100"
        :value="targetChannelResultingIC" disabled type="is-warning">
        <template>
          <b-slider-tick v-for="val in [25, 50, 75]" :value="val" :key="val">{{ val }}</b-slider-tick>
        </template>
      </b-slider>

      <template v-if="outgoingChannelId && targetChannelId">
        <b-field label="Amount (in sat)">
          <b-slider size="is-medium" type="is-dark" :min="0" :max="100" v-model="amount">
            <template>
              <b-slider-tick v-for="val in [25, 50, 75]" :value="val" :key="val">{{ val }}</b-slider-tick>
            </template>
          </b-slider>
        </b-field>

        <div><b>{{ formatSats(amount / 100 * maxSatsAmount) }}</b> / {{
          formatSats(maxSatsAmount) }}</div>
      </template>
      <br />
    </section>
    <footer class="modal-card-foot">
      <b-button label="Close" @click="$emit('close')" />
      <b-button type="is-black" label="Attempt Rebalance" icon-right="chevron-right" @click="startRebalance"
        :loading="loading" />
    </footer>
  </div>
</template>
<script>
import API from '/imports/api'
import formatSats from '/imports/lib/formatSats'

export default {
  props: [
    'nodeId',
    'initChannelId'
  ],
  data() {
    return {
      loading: false,
      result: '',
      outgoingChannelId: this.initChannelId,
      targetChannelId: null,
      amount: 0,
      formatSats
    }
  },
  watch: {
    channels(channels) {
      console.log('watch', channels)
      this.updateTargetChannel()
    }
  },
  meteor: {
    $subscribe: {
      "Nodes_info": function () {
        return [{ nodeId: this.nodeId }]
      }
    },
    channels() {
      const nodeId = this.nodeId
      console.log({ nodeId })
      return API.Channels.find({ nodeId }).fetch()
        .filter(i => i.active === true)
        .map(i => {
          return {
            ...i,
            totalBalance: Number(i.local_balance) + Number(i.remote_balance),
            netBalance: Number(i.local_balance) - Number(i.remote_balance),
            percentLocal: 100 - Math.round(100 * Number(i.local_balance) / (Number(i.local_balance) + Number(i.remote_balance)))
          }
        })
        .sort((a, b) => {
          if (a.percentLocal < b.percentLocal) {
            return -1
          }
          if (a.percentLocal > b.percentLocal) {
            return 1
          }
          return 0
        })

    }
  },
  methods: {
    async startRebalance() {
      this.loading = true
      const nodeId = this.nodeId
      const outgoingChannelId = this.outgoingChannelId
      const targetChannelId = this.targetChannelId
      const amount = Math.round(this.amount * this.maxSatsAmount / 100)
      try {
        const result = await API.Nodes.startRebalance({
          nodeId, amount, outgoingChannelId, targetChannelId
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
    },
    updateAmount() {
      const outgoingChannel = this.outgoingChannel
      const targetChannel = this.targetChannel
      let medianAmount = Number(outgoingChannel.totalBalance) / 2 - (Number(outgoingChannel.totalBalance) - Number(outgoingChannel.local_balance))
      if (medianAmount < 0) {
        medianAmount = 0
      }
      const updateAmount = Math.min(this.maxSatsAmount, medianAmount)
      console.log('updateAmount', outgoingChannel, targetChannel, this.maxSatsAmount, medianAmount, updateAmount)
      if (outgoingChannel && targetChannel) {
        this.amount = updateAmount / this.maxSatsAmount * 100
      }
    },
    updateTargetChannel() {
      if (this.targetChannelId) {
        return
      }
      this.targetChannelId = this.targetChannels.find(i => i.percentLocal > 50).chan_id
      this.updateAmount()
    }
  },
  computed: {
    maxSatsAmount() {
      return Math.min(
        parseInt(parseInt(this.outgoingChannel.local_balance)),
        parseInt(this.targetChannel.totalBalance) - parseInt(this.targetChannel.local_balance)
      )
    },
    outgoingChannel() {
      if (this.outgoingChannelId && this.channels) {
        return this.channels.find(i => i.chan_id === this.outgoingChannelId)
      }
    },
    targetChannel() {
      if (this.targetChannelId && this.channels) {
        return this.channels.find(i => i.chan_id === this.targetChannelId)
      }
    },
    outgoingChannelResultingIC() {
      if (this.outgoingChannel && this.targetChannel) {
        const amount = this.amount / 100 * this.maxSatsAmount
        const i = this.outgoingChannel
        return 100 - Math.round(100 * (Number(i.local_balance) - Number(amount)) / (Number(i.local_balance) + Number(i.remote_balance)))
      }
    },
    targetChannelResultingIC() {
      if (this.outgoingChannel && this.targetChannel) {
        const amount = this.amount / 100 * this.maxSatsAmount
        console.log(this.targetChannel.local_balance, amount)
        const i = this.targetChannel
        return 100 - Math.round(100 * (Number(i.local_balance) + Number(amount)) / (Number(i.local_balance) + Number(i.remote_balance)))
      }
    },
    targetChannels() {
      if (this.channels) {
        return this.channels.filter(i => i.chan_id !== this.outgoingChannelId)
      }
    }
  }
}

</script>
<style lang="scss">
#rebalance {
  background: #f0f0f0;

  border-radius .centered {
    max-width: 300px;
    margin: auto;
    text-align: center;
  }

  .channelInfo {
    background: #eee;
    padding: 10px 20px;
    border-radius: 5px;
    margin-bottom: 30px;
    font-size: smaller;
  }
}
</style>