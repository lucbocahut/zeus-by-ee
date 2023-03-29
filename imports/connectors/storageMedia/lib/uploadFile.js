import dayjs from 'dayjs'
import { PutObjectCommand } from '@aws-sdk/client-s3';
import getClient from "../getClient";
import getFileUrl from "../getFileUrl";

const settings = Meteor.settings && Meteor.settings.connectors && Meteor.settings.connectors.storage || { connection: {} }


/**
 * Upload a file to storage
 * @param {ArrayBuffer} fileContent ArrayBuffer of the file content
 * @param {string} fileName name with extension (e.g. picture.png)
 * @returns file url
 */
const uploadFile = async function (fileName, fileContent) {

  try {
    const s3Client = getClient();
    
    const command = new PutObjectCommand({
      Bucket: settings.bucket, // The path to the directory you want to upload the object to, starting with your Space name.
      Key: fileName, // Object key, referenced whenever you want to access this file later.
      Body: fileContent, // The object's contents. This variable is an object, not a string.
      ACL: 'public-read', // Defines ACL permissions, such as private or public.
      Metadata: { // Defines metadata tags.
        "upload-at": dayjs().toISOString()
      }
    });
    const data = await s3Client.send(command);
    if(data.$metadata.httpStatusCode === 200) {
      return getFileUrl(fileName);
    }
    else
    {
      return null;
    }
   

  } catch (error) {
    console.log('Error detected: ', error)
    throw new Meteor.Error('api-error', error.message)
  }
}

export default uploadFile
