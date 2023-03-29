import { Meteor } from 'meteor/meteor'
import uploadFile from './lib/uploadFile'
import uploadFileFromUrl from './lib/uploadFileFromUrl'
import getBucketFiles from './lib/getBucketFiles'
import getFile from './lib/getFile'
import deleteFile from './lib/deleteFile'

const storageMedia = {}

if (Meteor.isServer) {
  storageMedia.uploadFile = uploadFile;
  storageMedia.uploadFileFromUrl = uploadFileFromUrl;
  storageMedia.getBucketFiles = getBucketFiles;
  storageMedia.getFile = getFile;
  storageMedia.deleteFile = deleteFile;
}

if (Meteor.isClient) {
  storageMedia.uploadFile = () => {};
  storageMedia.uploadFileFromUrl = () => {};
  storageMedia.getBucketFiles = () => {};
  storageMedia.getFile = () => {};
  storageMedia.deleteFile = () => {};
  
}

export default storageMedia
