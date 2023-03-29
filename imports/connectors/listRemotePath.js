'use strict'
const Client = require('ssh2-sftp-client')

async function listRemotePath ({ connSettings, remotePath }) {
  const sftp = new Client('list-remote')
  await sftp.connect(connSettings)

  // now list
  const list = await sftp.list(remotePath)

  await sftp.end()

  return list
}

export default listRemotePath
