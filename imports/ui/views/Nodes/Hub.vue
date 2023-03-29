<template>
  <div id="nodes">
    <h1 class="title is-1">{{ nodeInfo.info && nodeInfo.info.alias }}</h1>

    <b-tabs type="is-boxed" :value="tab" @input="tab => $router.push(`/nodes/${nodeId}/${tabs[tab]}`)">
      <b-tab-item label="Channels">
        <b-button type="" icon-left="refresh" @click="updateChannels" label="Sync Channels" :loading="loading">
        </b-button>
        <br><br>
        <template v-if="channels" v-for="channel in channels">
          <div>
            <b-field>
              <template #label>
                <div class="actionable" @click="display(channel)">{{ `${channel.remoteNodeInfo.node.alias} ---
                                  ${formatSats(channel.totalBalance)} ${channel.percentLocal}% inbound capacity` }}</div>

              </template>
              <b-slider size="is-medium is-warning actionable" :min="0" :max="100" :value="channel.percentLocal" disabled>
                <template>
                  <b-slider-tick v-for="val in [25, 50, 75]" :value="val" :key="val">{{ val }}</b-slider-tick>
                </template>
              </b-slider>

              <template #message>
                <div class="field is-grouped is-grouped-multiline actionable" v-if="!channel.commands.length">
                  <div class="control"
                    @click="updateFeePolicy({ channelId: channel.chan_id, baseFee: channel.channelFees.base_fee_msat, ppmFee: channel.channelFees.fee_per_mil })">
                    <b-field>
                      <p class="control">
                        <b-button class="button is-dark" size="is-small">base</b-button>
                      </p>
                      <b-input :value="`${channel.channelFees.base_fee_msat} msat`" disabled size="is-small"></b-input>

                    </b-field>
                  </div>

                  <div class="control"
                    @click="updateFeePolicy({ channelId: channel.chan_id, baseFee: channel.channelFees.base_fee_msat, ppmFee: channel.channelFees.fee_per_mil })">
                    <b-field>
                      <p class="control">
                        <b-button class="button is-dark" size="is-small">ppm</b-button>
                      </p>
                      <b-input :value="`${channel.channelFees.fee_per_mil}  / 1m`" disabled size="is-small"></b-input>

                    </b-field>
                  </div>

                  <div class="control actionable">
                    <b-button size="is-small" label="Rebalance..." icon-left="arrow-top-right" type="is-dark"
                      @click="startRebalance({ channelId: channel.chan_id })"></b-button>
                  </div>

                </div>
                <div v-else class="buttons">
                  <b-field>
                    <p class="control">
                      <b-button :loading="true" size="is-small" type="is-dark"></b-button>
                    </p>
                    <p class="control">
                      <b-button disabled size="is-small">{{ channel.commands[0].status }}...</b-button>
                    </p>
                  </b-field>
                </div>

              </template>
            </b-field>
            <br />
          </div>
        </template>
      </b-tab-item>

      <b-tab-item label="Events">
        <b-message type="is-info">
          Events posted to <b class="copyable" @click="copy(nodeEventUrl)">{{ nodeEventUrl }} <b-icon icon="content-copy"
              type="is-small" /></b> will appear here
        </b-message>
        <br />

        <b-table :data="events" sticky-header height="600" class="ee-table" @select="display">
          <b-table-column label="Event Name">
            <template v-slot="props">
              {{ props.row.eventName }}
            </template>
          </b-table-column>
          <b-table-column label="Id">
            <template v-slot="props">
              {{ props.row.remoteUniqueId }}
            </template>
          </b-table-column>
          <b-table-column label="Created">
            <template v-slot="props">
              {{ ago(props.row.createdAt, tick) }}
            </template>
          </b-table-column>
        </b-table>
      </b-tab-item>

      <b-tab-item label="Commands">

        <b-message type="is-info">
          Here you can view commands that have been performed on your node. You can view results and restart past
          commands.
        </b-message>
        <commands />
      </b-tab-item>

      <b-tab-item label="Settings">
        <section v-if="nodeInfo">
          <template>
            <b-message type="is-success" v-if="events && events.length > 0">
              <b-icon icon="check" /> Your node is receiving
              events</b-message>
            <b-message type="is-warning" has-icon v-else>
              Complete your setup by creating a stream from your Encrypted Energy account. Use the following url as
              your <code>Remote Destination URL</code>:
              <b class="copyable" @click="copy(nodeEventUrl)">{{ nodeEventUrl }} <b-icon icon="content-copy"
                  type="is-small" /></b>
            </b-message>
          </template>

          <b-message type="is-info">
            The following settings control how your node will be affected by events sent by the Encrypted
            Energy service.
          </b-message>

          <br />

          <b-field label="Rebalance">
            <b-switch v-model="nodeInfo.settings.enableRebalance" /> Enable rebalance commands
          </b-field>
          <div class="settings" :style="{ display: nodeInfo.settings.enableRebalance ? 'block' : 'none' }">
            <b-field label="Max Fees (% of transaction)">
              <b-input v-model="nodeInfo.settings.maxFeesPercent" />
            </b-field>
            <b-field label="Max time in seconds">
              <b-input v-model="nodeInfo.settings.maxTime" />
            </b-field>
            <b-field label="Min amount (in sats)">
              <b-input v-model="nodeInfo.settings.minAmount" />
            </b-field>
            <b-field label="Max amount per transaction (in sats)">
              <b-input v-model="nodeInfo.settings.maxAmount" />
            </b-field>
            <b-field label="Delay between rebalances">
              <b-input v-model="nodeInfo.settings.minRebalanceDelay" />
            </b-field>
            <b-field label="Daily rebalance budget">
              <b-input v-model="nodeInfo.settings.dailyRebalanceBudget" />
            </b-field>
          </div>

          <br />

          <b-field label="PolicyUpdate">
            <b-switch v-model="nodeInfo.settings.enablePolicyUpdate" /> Enable fee policy update commands
          </b-field>

          <b-button label="Save Settings" type="is-primary" :loading="saveSettingsLoading" @click="saveSettings" />
          <br><br>
        </section>
      </b-tab-item>

      <b-tab-item label="Delete" type="is-warning">
        <br />
        DANGER ZONE
        <br /><br />
        <b-message type="is-danger">
          If you want to remove this node and all associated data, you can do so at any time...
          <br /><br />
          <b-button type="is-danger" @click="removeNode" label="Remove Node..."></b-button>
        </b-message>

      </b-tab-item>
    </b-tabs>

  </div>
</template>

<script>
/* globals FileReader */
import { Meteor } from 'meteor/meteor'
import CreateNode from '/imports/ui/views/Nodes/modals/CreateNode'
import ViewDetails from '/imports/ui/views/Nodes/modals/ViewDetails'
import UpdateFeePolicy from '/imports/ui/views/Nodes/modals/UpdateFeePolicy'
import Rebalance from '/imports/ui/views/Nodes/modals/Rebalance'
import Commands from '/imports/ui/views/Commands'
import API from '/imports/api'
import formatSats from '/imports/lib/formatSats'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const tabs = [
  'Channels', 'Events', 'Commands', 'Settings', 'Delete'
]

export default {
  components: {
    Commands
  },
  data() {
    return {
      loading: false,
      nodeId: null,
      tick: new Date(),
      saveSettingsLoading: false,
      tab: 0,
      tabs
    }
  },
  created: function () {
    // set the local orderId
    const context = this
    this.nodeId = String(this.$route.params.nodeId)
    const tabItem = this.$route.params.section
    const tabIndex = tabs.indexOf(tabItem)
    this.tab = tabIndex !== -1 ? tabIndex : 0
    Meteor.setInterval(() => {
      context.tick = new Date()
    }, 1000)
  },

  watch: {
    '$route'(to, from) {
      this.nodeId = String(this.$route.params.nodeId)
      const tabItem = this.$route.params.section
      const tabIndex = tabs.indexOf(tabItem)
      this.tab = tabIndex !== -1 ? tabIndex : 0
    }
  },
  meteor: {
    $subscribe: {
      "Nodes_info": function () {
        return [{ nodeId: this.nodeId }]
      }
    },
    nodeInfo() {
      const nodeid = this.nodeId
      const nodeInfo = API.Nodes.findOne({ _id: this.nodeId }) || {}
      if (!nodeInfo.settings) {
        nodeInfo.settings = {
          maxFeesPercent: 1,
          maxTime: 1,
          minAmount: 10000,
          maxAmount: 200000,
          enableRebalance: false
        }
      }
      return nodeInfo
    },
    events() {
      const nodeId = this.nodeId
      return API.Events.find({ nodeId }).fetch()
        .sort((a, b) => {
          if (dayjs(a.createdAt).isBefore(b.createdAt)) {
            return 1
          }
          if (dayjs(b.createdAt).isBefore(a.createdAt)) {
            return -1
          }
          return 0
        })
    },
    channels() {
      const nodeId = this.nodeId
      return API.Channels.find({ nodeId }).fetch()
        .filter(i => i.active === true)
        .map(i => {
          const commands = API.Commands.find({ channelId: i.chan_id, status: { $in: ['created', 'running'] } }).fetch()
          return {
            ...i,
            totalBalance: Number(i.local_balance) + Number(i.remote_balance),
            netBalance: Number(i.local_balance) - Number(i.remote_balance),
            percentLocal: 100 - Math.round(100 * Number(i.local_balance) / (Number(i.local_balance) + Number(i.remote_balance))),
            commands
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
  computed: {
    nodeEventUrl() {
      return 'https://' + window.location.hostname + `/events/${this.nodeId}`
    }
  },
  methods: {
    addNode() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateNode,
        hasModalCard: true,
        customClass: 'from-node-list',
        trapFocus: true,
        enableRebalance: false
      })
    },
    updateFeePolicy({ channelId, baseFee, ppmFee }) {
      const nodeId = this.nodeId
      this.$buefy.modal.open({
        parent: this,
        component: UpdateFeePolicy,
        props: { nodeId, channelId, baseFee, ppmFee },
        hasModalCard: true,
        customClass: 'from-node-list',
        trapFocus: true,
      })
    },
    startRebalance({ channelId }) {
      const nodeId = this.nodeId
      const initChannelId = channelId
      this.$buefy.modal.open({
        parent: this,
        component: Rebalance,
        props: { nodeId, initChannelId },
        hasModalCard: true,
        customClass: 'from-node-list',
        trapFocus: true,
      })
    },
    copy(copyText) {
      // Copy the text inside the text field
      navigator.clipboard.writeText(copyText);

      // Alert the copied text
      this.$buefy.toast.open({
        duration: 5000,
        message: "Copied url to clipboard",
        position: 'is-bottom',
        type: 'is-info'
      })
    },
    removeNode() {
      const nodeId = this.nodeId
      const context = this
      this.$buefy.dialog.confirm({
        title: 'Remove Node',
        message: `Removing a node will remove all data, events and commands associated with this node forever. Are you sure you want to proceed?`,
        cancelText: 'Close',
        confirmText: 'Remove Node',
        type: 'is-danger',
        onConfirm: async () => {
          await API.Nodes.discard({ nodeId })
          context.$router.push('/')
        }
      })
    },
    async updateChannels() {
      const nodeId = this.nodeId
      this.loading = true
      try {
        await API.Nodes.updateChannels({ nodeId })
        this.loading = false
      } catch (e) {
        this.$buefy.toast.open({
          duration: 5000,
          message: e.toString(),
          position: 'is-bottom',
          type: 'is-danger'
        })
        this.loading = false
      }
    },
    async saveSettings() {
      const nodeId = this.nodeId
      this.saveSettingsLoading = true
      try {
        await API.Nodes.updateSettings({ nodeId, settings: this.nodeInfo.settings })
        this.saveSettingsLoading = false
      } catch (e) {
        this.$buefy.toast.open({
          duration: 5000,
          message: e.toString(),
          position: 'is-bottom',
          type: 'is-danger'
        })
        this.saveSettingsLoading = false
      }
    },
    ago(from, now) {
      return dayjs(from).from(dayjs(now))
    },
    formatSats,
    display(record) {
      console.log({ record })
      this.$buefy.modal.open({
        parent: this,
        component: ViewDetails,
        props: { record },
        hasModalCard: true,
        customClass: 'from-node-hub',
        trapFocus: true
      })
    }
  }
}

</script>

<style lang="scss">
#nodes {
  padding: 20px;

  .copyable {
    cursor: pointer;
  }

  .side-by-side {
    display: flex;

    .progress {
      width: 100px;
    }
  }

  .actionable {
    opacity: 0.8;
    cursor: pointer;
    transition: all 0.5s ease;

    &:hover {
      opacity: 1;
    }
  }

  .settings {
    margin-left: 20px;
  }

  .loading {
    height: 40px;
  }
}
</style>