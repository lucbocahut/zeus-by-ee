import Commands from '/imports/collections/Commands'
import rebalance from '/imports/api/Commands/lib/rebalance'
import updateFees from '/imports/api/Commands/lib/updateFees'
import updateChannels from '/imports/api/Nodes/lib/updateChannels'
import dayjs from 'dayjs'

const runCommands = async function () {

  // expire old commands
  Commands.update(
    {
      status: 'created',
      createdAt: { $lt: dayjs().subtract(5, 'minutes').toDate() }
    },
    { $set: { status: 'expired' } },
    { multi: true }
  )

  // some tests here probably...
  const commands = Commands.find({ status: 'created' }).fetch()
  Commands.update({ _id: { $in: commands.map(i => i._id) } }, {
    $set: { status: 'scheduled' },
    $inc: { attempts: 1 }
  }, { multi: true })
  if (commands.length > 0) {
    console.log('found', commands.length, 'command.s to run...')
  }

  const affectedNodes = {}

  for (let i = 0; i < commands.length; i++) {
    const commandInfo = commands[i]

    switch (commandInfo.name) {
      case "rebalance":
        await rebalance(commandInfo)
        break;

      case "updateFees":
        await updateFees(commandInfo)
        break;
    }
    // nodes to update
    affectedNodes[commandInfo.nodeId] = 1
  }

  // update affected nodes
  const updateTheseNodes = Object.keys(affectedNodes)
  for (let n = 0; n < updateTheseNodes.length; n++) {
    await updateChannels({ nodeId: updateTheseNodes[n] })
  }
}

export default runCommands

// name: String,
// nodeId: String,
// createdAt: Date,
// attempts: Number,
// status: { type: String, allowedValues: ['created', 'running', 'errored', 'confirmed', 'discarded'] },
// payload: { type: Object, blackbox: true, optional: true },