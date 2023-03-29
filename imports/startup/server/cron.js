/* globals SyncedCron */
import runCommands from '/imports/api/Commands/lib/run'
import scanEvents from '/imports/api/Commands/lib/scan'

// parser is a later.parse object
// if (process.env.PRODUCTION === 'true') {
const cronJobs = [
  // {
  //   schedule: 'every 1 hours',
  //   name: 'Placeholder cron job',
  //   action: () => console.log('hi')
  // },
  {
    schedule: 'every 10 seconds',
    name: 'Start commands',
    action: runCommands
  },
  {
    schedule: 'every 2 seconds',
    name: 'Scan events',
    action: scanEvents
  }
]

cronJobs.forEach(({ name, schedule, action, options }) => {
  SyncedCron.add({
    name,
    schedule: function (parser) {
      return parser.text(schedule)
    },
    job: async function () {
      await action(options)
    }
  })
})

console.log('Cron jobs have been initialized.')
// } else {
//   console.log('WARNING: cron jobs are disabled when not in production.')
// }

SyncedCron.config({
  // Log job run details to console
  log: false
})
SyncedCron.start()
