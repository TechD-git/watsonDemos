// ----------------------------------------------
// Setup
// ----------------------------------------------
// establish connection to IBM Cloud Object Storage (COS)
const creds = require('./content-store-creds.json');
const cos_config = require('./cos-config.json');
const COS = require('ibm-cos-sdk');
let s3Config = {
      accessKeyId: creds.cos_hmac_keys.access_key_id,
      secretAccessKey: creds.cos_hmac_keys.secret_access_key,
      region: 'ibm',
      endpoint: new COS.Endpoint(cos_config.cos_endpoint_url),
}
const cos = new COS.S3(s3Config);
console.log("connected to Cloud Object Storage");
  
var bucket = cos_config.cos_bucket;

/* -----------------------------------------------
*  write_file function 
*/
async function write_file(itemName, fileText){
        console.log(`Creating new file: ${itemName}`);
        return cos.putObject({
            Bucket: bucket, 
            Key: itemName, 
            Body: fileText
        }).promise()
        .then(() => {
            console.log(`File: ${itemName} created!`);
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}

  module.exports = write_file;