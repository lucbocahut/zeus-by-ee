import uploadFile from './uploadFile'
import { fetch, Response } from 'meteor/fetch'

/**
 * Download a file from a URL and upload it to storage
 * @param {string} fileName file name without extension. Extension will be genetared from fileContent.type
 * @param {string} fileUrl file url to download
 * @returns file url
 */
const uploadFileFromUrl = async function (fileName, fileUrl) {
  //console.log(`Download ${fileName} file from ${fileUrl} and upload it to folder ${folder}`)
  try {
    
    const fileContent = await fetch(fileUrl).then((res) => { return res.blob(); });
    //console.log('starting file',  fileContent)
    return await uploadFile(
      fileName + "."+fileContent.type.split('/')[1], 
      await new Response(fileContent).arrayBuffer()
    )

  } catch (error) {
    console.log('Error detected: ', error)
    throw new Meteor.Error('api-error', error.message)
  }
}

export default uploadFileFromUrl
