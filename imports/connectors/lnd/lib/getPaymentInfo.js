import { Meteor } from 'meteor/meteor'
import { fetch, Headers } from 'meteor/fetch'
import Nodes from '/imports/collections/Nodes'

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

async function getPaymentInfo({ host, macaroon, paymentHash }) {

  const encoded = encode(paymentHash)
  console.log('getPaymentInfo', { paymentHash, encoded })

  const url = `https://${host}:8080/v2/router/track/${encoded}`
  try {
    return fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'no-cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: new Headers({
        'Grpc-Metadata-macaroon': macaroon,
        'Content-Type': 'application/json'
      }),
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
      .then(res => res.json())
  } catch (err) {
    console.error(err)
    throw new Meteor.Error(err.toString())
  }
}

export default getPaymentInfo
