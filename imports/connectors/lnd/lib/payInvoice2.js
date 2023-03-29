import { fetch, Headers } from 'meteor/fetch'

const payInvoice = async function ({ host, macaroon, paymentRequest, feeLimitMsat, timeLimit, allow_self_payment = true }) {

  // todo: upgrade to v2 https://lightning.engineering/api-docs/api/lnd/router/send-payment-v2
  // /v2/router/send
  const url = `https://${host}:8080/v2/router/send`

  const body = {
    payment_request: paymentRequest,
    fee_limit_msat: feeLimitMsat,
    allow_self_payment,
    timeout_seconds: timeLimit
    // last_hop_pubkey: convertToHex(lastHop),
    // outgoing_chan_id: channelId
  }

  const payment = {
    method: 'POST',
    headers: {
      'Grpc-Metadata-macaroon': macaroon,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  // Pay the invoice.
  return fetch(url, payment)
    .then(res => {
      return res.text()
    })
    .then(text => {
      const elements = text.trim().split("\n")
      return elements.pop()
    }) // last element only
    .then(body => {
      return JSON.parse(body)
    })
    .catch(err => console.error('Error paying invoice:', err))
}

export default payInvoice