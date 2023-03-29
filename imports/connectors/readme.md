# Connectors

Files in this folder can be imported from client or server side code, but mostly we want all connectors to only run on the server so stubing is recomended. 


### Pseudo code example
`
const CoolLib = {}
if (Meteor.isServer) {
  CoolLib.method = function ({ }) {
  	// do something useful
  }
}
if (Meteor.isClient) {
  CoolLib.method = () => {} // stub
}
export default CoolLib
`


## basic principles

- connector code should be specific to the service we are connected to and as generic as possible. Abstracting away the , authentication and basic connectivity as well as common tasks.
- connector code should not use the local api but only push or surface data from the service