import addEvent from '/imports/api/Events/lib/create'
import dayjs from 'dayjs'

const newId = () => {
  return dayjs().valueOf() + '.' + Array.from(Array(20), () => Math.floor(Math.random() * 36).toString(36)).join('');
}
async function updateFees({ nodeId, channelId, baseFee, ppmFee }) {

  return addEvent({
    remoteUniqueId: newId(),
    nodeId,
    eventName: 'local.command.channels.attempt_fee_policy_change',
    payload: {
      channel_id: channelId,
      base_fee_msat: baseFee,
      fee_rate_per_mil: ppmFee
    }
  })
}

export default updateFees
