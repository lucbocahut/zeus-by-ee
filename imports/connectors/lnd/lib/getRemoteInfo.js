import { Meteor } from 'meteor/meteor';
import { fetch, Headers } from 'meteor/fetch';

async function getRemoteInfo({ host, macaroon, remotePubKey }) {

  const url = `https://${host}:8080/v1/graph/node/${remotePubKey}`
  try {
    const response = await fetch(url, {
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
    return response.json()

  } catch (err) {
    throw new Meteor.Error("Can't connect to node")
  }
}

export default getRemoteInfo