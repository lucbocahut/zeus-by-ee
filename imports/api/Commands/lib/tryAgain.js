import Commands from '/imports/collections/Commands'

const tryAgain = async function ({ commandId }) {
  console.log('invoking tryAgain')

  // reset command only if its not confirmed
  Commands.update(
    { _id: commandId, status: { $ne: 'confirmed' } },
    {
      $set: { status: 'created', createdAt: new Date() },
      $unset: { errorReason: 1, result: 1, run: 1 }
    }
  )
  console.log(Commands.findOne({ _id: commandId }))
  return 1
}

export default tryAgain

// name: String,
// nodeId: String,
// createdAt: Date,
// attempts: Number,
// status: { type: String, allowedValues: ['created', 'running', 'errored', 'confirmed', 'discarded'] },
// payload: { type: Object, blackbox: true, optional: true },