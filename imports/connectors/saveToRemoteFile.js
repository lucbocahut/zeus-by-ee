'use strict'
const Client = require('ssh2-sftp-client')

async function saveToRemoteFile ({ connSettings, sourceStream, remotePath }) {
  const sftp = new Client('save-to-remote')
  await sftp.connect(connSettings)

  // first check if remote folder exists
  const remoteFolder = remotePath.split('/').slice(0, -1).join('/')
  const d1 = await sftp.exists(`/var/sftp${remoteFolder}`)
  const dirExists = await sftp.exists(`${remoteFolder}`)
  console.log({ remoteFolder, d1, dirExists })
  if (!dirExists) {
    console.log('creating', { remoteFolder })
    const result = await sftp.mkdir(remoteFolder, true)
    console.log('->', { result })
  }

  // now upload
  await sftp.put(sourceStream, remotePath)

  await sftp.end()

  return true
}

export default saveToRemoteFile
