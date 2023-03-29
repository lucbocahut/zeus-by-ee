import { S3Client } from '@aws-sdk/client-s3';
const settings = Meteor.settings && Meteor.settings.connectors && Meteor.settings.connectors.storage || { connection: {} }


/**
 * Return client class with correct config
 * @returns 
 */
export default function getClient() {
    return new S3Client({
        endpoint: settings.url, 
        region: settings.region, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
        credentials: {
          accessKeyId: settings.accessKeyId, // Access key pair. You can create access key pairs using the control panel or API.
          secretAccessKey: settings.secretAccessKey // Secret access key defined through an environment variable.
        }
    });
}