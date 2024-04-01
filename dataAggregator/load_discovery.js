require('dotenv').config();
// module that implements writing files to IBM Cloud Object Storage (COS)
const object_storage = require('./cos_writer_reader');

let discovery_apikey = process.env.DISCOVERY_APIKEY;
if(discovery_apikey) {console.log('DISCOVERY_APIKEY set: ' + discovery_apikey);}
else {console.log('No DISCOVERY_APIKEY set!');}
let discovery_url = process.env.DISCOVERY_URL;
if(discovery_url) {console.log('DISCOVERY_URL set: ' + discovery_url);}
else {console.log('No DISCOVERY_URL set!');}
let discovery_project = process.env.DISCOVERY_PROJECT;
if(discovery_project) {console.log('DISCOVERY_PROJECT set: ' + discovery_project);}
else {console.log('No DISCOVERY_PROJECT set!');}
let discovery_collection = process.env.DISCOVERY_COLLECTION;
if(discovery_collection) {console.log('DISCOVERY_COLLECTION set: ' + discovery_collection);}
else {console.log('No DISCOVERY_COLLECTION set!');}

async function discovery_load(filename, jsonData){

  const DiscoveryV2 = require('ibm-watson/discovery/v2');
  const { IamAuthenticator } = require('ibm-watson/auth');
  // get a handle for Watson Discovery instance: "Watson Discovery for NeuralSeek"
  const discovery = new DiscoveryV2({
    version: '2023-03-31',
    authenticator: new IamAuthenticator({
      apikey: discovery_apikey,
    }),
    serviceUrl: discovery_url,
  });

  console.log(`Uploading file: ${filename}.`);

  var Readable = require('stream').Readable

  var s = new Readable()
  s.push(jsonData)    // the string you want
  s.push(null)      // indicates end-of-file basically - the end of the stream
  
  const params = {
    projectId: discovery_project, 
    collectionId: discovery_collection, 
    file: s,
    filename: filename
    };

   
  await discovery.addDocument(params)
    .then(response => {
      console.log(JSON.stringify(response.result, null, 2));
    })
    .catch(err => {
      console.log('error:', err);
    });

  console.log("Finished uploading file.");
}


module.exports = discovery_load;