import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import getClient from "../getClient";

const settings = Meteor.settings && Meteor.settings.connectors && Meteor.settings.connectors.storage || { connection: {} }


const getFile = async function (fileId) {
  try {
    const command = new GetObjectCommand({
      Bucket: settings.bucket,
      Key: fileId
    });

    const s3Client = getClient();

    const result = await s3Client.send(command)
    //console.log('getFile', result)
    return result;

  } catch (error) {
    console.log('Error detected: ', error)
    throw new Meteor.Error('api-error', error.message)
  }
}

export default getFile
