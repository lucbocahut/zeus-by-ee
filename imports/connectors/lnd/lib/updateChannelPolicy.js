import { fetch, Headers } from 'meteor/fetch'

const updateChannelPolicy = async function ({ host, macaroon, channelPoint, baseFee, ppmFee }) {

  const url = `https://${host}:8080/v1/chanpolicy`

  // Replace the following values with the invoice details you want to pay.
  const [funding_txid_str, output_index] = channelPoint.split(':')
  const body = {
    chan_point: {
      funding_txid_str,
      output_index
    },
    base_fee_msat: Math.round(baseFee), // in msat
    fee_rate_ppm: Math.round(ppmFee), // in satoshis per million satoshis
    time_lock_delta: 24 // random number of blocks above 18
  }

  // console.log('updateChannelPolicy', { body })

  return fetch(`${url}`, {
    method: 'POST',
    headers: {
      'Grpc-Metadata-macaroon': macaroon,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
}

export default updateChannelPolicy
