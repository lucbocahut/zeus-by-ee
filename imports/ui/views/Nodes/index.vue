<template>
  <div id="nodes">
    <h1 class="title is-1">Connected Nodes</h1>
    <section>
      <template v-if="!nodes || nodes.length === 0">
        <b-message type="is-info">Please connect a node to get started...</b-message></template>
      <template v-else>
        <b-message type="is-info">Select a node to view events and settings</b-message>
        <b-table :data="nodes" @click="selectNode" hoverable sticky-header class="ee-table">
          <b-table-column label="Host">
            <template v-slot="props">
              {{ props.row.host }}
            </template>
          </b-table-column>
          <b-table-column label="Created">
            <template v-slot="props">
              {{ ago(props.row.createdAt, tick) }}
            </template>
          </b-table-column>
        </b-table>
      </template>
    </section>
    <section>
      <br>
      <b-button type="is-dark" label="Connect a Node..." @click="addNode" />
    </section>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor'
import CreateNode from '/imports/ui/views/Nodes/modals/CreateNode'
import API from '/imports/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  data() {
    return {
      loading: false,
      tick: new Date()
    }
  },
  created() {
    const context = this
    Meteor.setInterval(() => {
      context.tick = new Date()
    }, 1000)
  },
  meteor: {
    $subscribe: {
      "Nodes_list": function () {
        return []
      }
    },
    nodes() {
      return API.Nodes.find({}).fetch()
    }
  },
  methods: {
    addNode() {
      const context = this
      this.$buefy.modal.open({
        parent: this,
        component: CreateNode,
        hasModalCard: true,
        customClass: 'from-node-list',
        trapFocus: true,
        events: {
          'connected': ({ nodeId }) => {
            context.$router.push(`/nodes/${nodeId}/Settings`)
          }
        }
      })
    },
    selectNode(nodeInfo) {
      this.$router.push(`/nodes/${nodeInfo._id}`)
    },
    ago(from, now) {
      return dayjs(from).from(dayjs(now))
    }
  }
}
</script>

<style lang="scss">
#nodes {
  padding: 20px;
}
</style>