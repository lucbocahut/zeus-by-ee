import { fetch, Headers } from 'meteor/fetch'

const payInvoice = async function ({ host, macaroon, paymentRequest, feeLimitMsat, timeLimit, allow_self_payment = true }) {

  const url = `https://${host}:8080/v1/channels/transactions`

  const body = {
    payment_request: paymentRequest,
    fee_limit: { fixed_msat: feeLimitMsat },
    allow_self_payment,
    cltv_limit: timeLimit * 1000
    // last_hop_pubkey: convertToHex(lastHop),
    // outgoing_chan_id: channelId
  }
  console.log('payInvoice body', body)

  const payment = {
    method: 'POST',
    headers: {
      'Grpc-Metadata-macaroon': macaroon,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  console.log(payment)
  // Pay the invoice.
  return fetch(url, payment)
    .then(res => res.json())
    .catch(err => console.error('Error paying invoice:', err))
}

export default payInvoice