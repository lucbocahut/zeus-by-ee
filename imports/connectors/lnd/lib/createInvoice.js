import { fetch, Headers } from 'meteor/fetch'
import Nodes from '/imports/collections/Nodes'

const createInvoice = async function ({ host, macaroon, nodePubkey, amount, channelId, lastHop }) {

  const url = `https://${host}:8080/v1`

  // Replace the following values with the invoice details you want to pay.
  const invoice = {
    value: amount, // in satoshis
    routeHints: [
      {
        "hopHints": [
          {
            "node_id": nodePubkey,
            "chan_id": channelId
          },
          {
            node_id: lastHop
          }
        ]
      }
    ]
  }

  // Generate an invoice.
  return fetch(`${url}/invoices`, {
    method: 'POST',
    headers: {
      'Grpc-Metadata-macaroon': macaroon,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(invoice)
  })
    .then(res => res.json())
}

export default createInvoice
