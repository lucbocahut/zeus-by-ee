'use strict'
const Client = require('ssh2').Client

// audited for security:
// this file is called from the server only and with credentials

// return a readable stream from a remote path
async function remoteFileContent ({ connSettings, path }) {
  return new Promise((resolve, reject) => {

    try {
      const conn = new Client()
      conn.on('ready', function (err) {
        if (err) {
          reject(err)
          return false
        }
        conn.sftp(function (err, sftp) {
          if (err) {
            reject(err)
            return false // exit here
          }
          // you'll be able to use sftp here
          // Use sftp to execute tasks like .unlink or chmod etc
          let content = ''
          let info = {}
          const readStream = sftp.createReadStream(path)
          sftp.stat(path, (err, stats) => {
            if (err) {
              console.log('error', err)
            }
            const { size, mtime } = stats
            info = { size, mtime }
          })

          readStream.on('data', function (data) {
            content += data
          })

          readStream.on('close', function () {
            console.log('remoteFileContent: remote file transferred succesfully', path)
            resolve({ info, content })
          })

          readStream.on('end', function () {
            // console.log('sftp connection closed')
            // resolve(content)
            // conn.close()
          })
        })
      }).connect(connSettings)
    } catch (error) {
      reject(error)
    }
  })
}

exports.remoteFileContent = remoteFileContent
