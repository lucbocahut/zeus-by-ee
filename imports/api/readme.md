# API

This folder contains all local business application code such as reading and writting to collections and event based code. 

The nature of Meteor is to provide server and client facing code at the same time. This code can run indifferently on the server and on the client (where effects are simulated in the local client based Mongo DB store). 


## Application domain

API code is seperated into business domain. Each folder usually drives a corresponding collection and defines a set of rules to update the collection.


## Client side

All API code is in effect event driven. Usually UI code triggers API code. The effects are then propagated to the Mongo store and reflected in the UI via subscriptions and reads.

Clients subscribe to publications which are defined in the API code. 


## Collections

Collections are defined in the collections folder for convenience, but all collection interaction is done from the API code.


## Authentication

Authentication is provided by the authentication library which is based in the main library folder. This lib simply relies on the Meteor.users table for identifying and authorizing users based on their role: admin, user.

Authentication is done at the method level: each top level domain such as Users or Events contains an index which wraps around a definition for that namespace to create a front end API object. For instance API.Users.resetPassword is a method on the client that wraps the Meteor DDP calling mechanism (Meteor.call) and defines on the server the method definitions. These methods are where the authentication is implemented, where a check is performed against the auth function for that action. 


## External services

When an event triggers a data change and we want to propagate this information to an external service, we connect via the connectors code. Connectors code is considered to be isomorph, running both on client and server in a safe way. 

Scheduled syncing is handled by the sync code and not covered in the api code.


## Notes

- API code won't contain any usernames or specific access information as is
- API code relies on Collection and connectors code to be isomorph, running indiferently on client and server, and usually doesn't need to concern itself with where things run other than providing an adequate interface in its methods.
- In other words methods are the gate keepers for client/server side code execution

