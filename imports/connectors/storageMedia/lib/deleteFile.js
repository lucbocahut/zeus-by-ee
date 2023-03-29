import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import getClient from "../getClient";

const settings = Meteor.settings && Meteor.settings.connectors && Meteor.settings.connectors.storage || { connection: {} }

/**
 * Remove a file from storage
 * @param {string} fileNameOrUrl path and name or url of the file to delete
 * @returns true is success or false
 */
const deleteFile = async function (fileNameOrUrl) {
  let fileName = fileNameOrUrl;

  // if url, remove domain and get file name
  if(fileNameOrUrl.includes('.com/')) {
    fileName = fileNameOrUrl.split('.com/')[1];
  }

  try {

    const command = new DeleteObjectCommand({
      Bucket: settings.bucket,
      Key: fileName,
    });

    const s3Client = getClient();
    
    const data = await s3Client.send(command);
    return data.$metadata.httpStatusCode === 204;
   

  } catch (error) {
    console.log('Error detected: ', error)
    throw new Meteor.Error('api-error', error.message)
  }
}

export default deleteFile
