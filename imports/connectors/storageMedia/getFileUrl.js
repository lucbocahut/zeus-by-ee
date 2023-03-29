const settings = Meteor.settings && Meteor.settings.connectors && Meteor.settings.connectors.storage || { connection: {} }

/**
 * Generate url for a specific file in storage
 * @param {string} fileName 
 * @returns 
 */
export default function getFileUrl(fileName) {
    return `https://${settings.bucket}.${settings.region}.digitaloceanspaces.com/${fileName}`;
}