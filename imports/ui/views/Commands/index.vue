<template>
  <div id="commands_list">
    <b-field label="Commands"></b-field>
    <section>
      <template v-if="!commands || commands.length === 0">
        <b-message type="is-info">No commands yet, wait for events to populate this list...</b-message></template>
      <template v-else>
        <b-table :data="commands" sticky-header height="600" class="ee-table" @select="display"
          :row-class="(row, index) => row.status">
          <b-table-column label="Command">
            <template v-slot="props">
              {{ props.row.name }}
            </template>
          </b-table-column>
          <b-table-column label="Node">
            <template v-slot="props">
              {{ props.row.nodeName || props.row.nodeId }}
            </template>
          </b-table-column>
          <b-table-column label="Status">
            <template v-slot="props">
              {{ props.row.status }}
              <span v-if="props.row.status === 'errored'">({{ props.row.errorReason }})</span>
            </template>
          </b-table-column>
          <b-table-column label="Amount">
            <template v-slot="props">
              {{ formatSats(props.row.result && props.row.result.result && props.row.result.result.value_sat || 0) }}
            </template>
          </b-table-column>
          <b-table-column label="Fee">
            <template v-slot="props">
              {{ formatSats(props.row.result && props.row.result.result && props.row.result.result.fee_sat || 0) }}
            </template>
          </b-table-column>
          <b-table-column label="Last Update">
            <template v-slot="props">
              {{ ago(props.row.lastModified, tick) }}
            </template>
          </b-table-column>
        </b-table>
      </template>
    </section>
  </div>
</template>
<script>
import { Meteor } from 'meteor/meteor'
import ViewDetails from '/imports/ui/views/Nodes/modals/ViewDetails'
import API from '/imports/api'
import formatSats from '/imports/lib/formatSats'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  data() {
    return {
      loading: false,
      tick: new Date(),
      nodeId: null
    }
  },
  created() {
    const context = this
    Meteor.setInterval(() => {
      context.tick = new Date()
    }, 1000)
    this.nodeId = this.$route.params && this.$route.params.nodeId
  },
  watch: {
    '$route'(to, from) {
      this.nodeId = this.$route.params && this.$route.params.nodeId
    }
  },
  meteor: {
    $subscribe: {
      "Commands_list": function () {
        if (this.nodeId) {
          return [{ nodeId: this.nodeId }]
        }
        return []
      }
    },
    commands() {
      const find = {}
      const nodeId = this.nodeId
      if (nodeId) {
        find.nodeId = nodeId
      }
      return API.Commands.find(find).fetch()
        .sort((a, b) => {
          if (dayjs(a.createdAt).isBefore(b.createdAt)) {
            return 1
          }
          if (dayjs(b.createdAt).isBefore(a.createdAt)) {
            return -1
          }
          return 0
        })
    }
  },
  methods: {
    formatSats,
    tryAgain({ _id: commandId }) {
      return API.Commands.tryAgain({ commandId })
    },
    selectCommand(commandInfo) {
      console.log({ commandInfo })
    },
    ago(from, now) {
      return dayjs(from).from(dayjs(now))
    },
    display(record) {
      console.log({ record })
      this.$buefy.modal.open({
        parent: this,
        component: ViewDetails,
        props: { record },
        hasModalCard: true,
        customClass: 'from-command-list',
        trapFocus: true
      })
    }
  }
}
</script>
<style lang="scss">
#commands_list {
  padding: 20px;

  .centered {
    max-width: 300px;
    margin: auto;
    text-align: center;
  }

  .confirmed {
    background-color: #e6ffed;
  }

  .running {
    background-color: #fffbe6;
  }
}
</style>