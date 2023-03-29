import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import getClient from "../getClient";

const settings = Meteor.settings && Meteor.settings.connectors && Meteor.settings.connectors.storage || { connection: {} }

/**
 * Get all files from a folder
 * @param {string} folder 
 */
const getBucketFiles = async function (folder) {
  try {
    const command = new ListObjectsCommand({
      Bucket: settings.bucket,
      Prefix: folder
    });

    const s3Client = getClient();

  const result = await s3Client.send(command)
  return result.Contents;

  } catch (error) {
    console.log('Error detected: ', error)
    throw new Meteor.Error('api-error', error.message)
  }
}

export default getBucketFiles
