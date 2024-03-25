require('dotenv').config();
const request = require('request')

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

async function load(doc, filename){
  var options = {
//    uri:'https://gateway.watsonplatform.net/discovery/api/v1/environments/'+process.env.DISCOVERY_ENVIRONMENT_ID+'/collections/'+process.env.DISCOVERY_COLLECTION_ID+'/documents?version=2016-12-01&configuration_id='+process.env.DISCOVERY_CONFIGURATION_ID,
    uri: discovery_url + "/v2/projects/" + discovery_project + "/collections/" + discovery_collection + "/documents?version=2023-03-31",
    method: 'POST',
    formData: {
        metadata: {
            doc: JSON.stringify(doc)
        }
    },
    auth: {
       user: "apikey",
       pass: discovery_apikey
    },
};

request(options, function(err, httpResponse, body){
    if(err){
      console.log(err);
    }
    console.dir(body);
});

}

async function discovery_load(input, filename){

  console.log("Uploading " + filename +"...");
  console.log(input);
  const file_part = ReadableStream.from(JSON.stringify(input));

    const params = {
        projectId: discovery_project, 
        collectionId: discovery_collection, 
        file: file_part,
        filename: filename,
        fileContentType: 'application/json',
        metadata: {
          filename: filename,
          file_type: "json"}
      };
      
      var document_obj = {
        environment_id: discovery_project,
        collection_id: discovery_collection,
        file: input
      };

    discovery.addJsonDocument(document_obj)
        .then(response => {
          console.log(JSON.stringify(response.result, null, 2));
        })
        .catch(err => {
          console.log('error:', err);
        });


};

module.exports = load;