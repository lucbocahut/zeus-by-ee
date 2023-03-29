import { fetch, Headers } from 'meteor/fetch'

function encode(str) {
  //console.log('original', str)
  const bytes = Uint8Array.from(Buffer.from(str, 'hex'))
  //console.log(bytes)
  const base64String = Buffer.from(bytes).toString('base64')
  //console.log(base64String)
  const encodedString = encodeURIComponent(base64String)
  //console.log(encodedString)
  return encodedString
}

const queryRoutes = async function ({ host, macaroon, nodePubkey, amount, lastHop, channelId }) {

  const outgoing_chan_id = channelId
  const last_hop_pubkey = encode(lastHop)
  // console.log({ lastHop, last_hop_pubkey })
  const url = `https://${host}:8080/v1/graph/routes/${nodePubkey}/${amount}?outgoing_chan_id=${outgoing_chan_id}&last_hop_pubkey=${last_hop_pubkey}`

  // console.log({ url })

  // Replace the following values with the query details you want to pay.
  const query = {
    outgoing_chan_id: channelId,
    last_hop_pubkey: lastHop
  }

  // console.log({ query })

  // Generate an query.
  return fetch(url, {
    method: 'GET',
    headers: {
      'Grpc-Metadata-macaroon': macaroon,
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify(query)
  })
    .then(res => res.json())
}

export default queryRoutes
