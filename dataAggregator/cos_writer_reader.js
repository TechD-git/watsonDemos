// ----------------------------------------------
// Setup
// ----------------------------------------------
let cos = null;
let bucket = null;
// establish connection to IBM Cloud Object Storage (COS)
async function setup(){
    const creds = require('./content-store-creds.json');
    const cos_config = require('./cos-config.json');
    const COS = require('ibm-cos-sdk');
    let s3Config = {
      accessKeyId: creds.cos_hmac_keys.access_key_id,
      secretAccessKey: creds.cos_hmac_keys.secret_access_key,
      region: 'ibm',
      endpoint: new COS.Endpoint(cos_config.cos_endpoint_url),
    }
    cos = new COS.S3(s3Config);
    console.log("connected to Cloud Object Storage");
    bucket = cos_config.cos_bucket;
}


/* -----------------------------------------------
*  write_cos_file function 
*/
async function write_cos_file(itemName, fileText){
    await setup();
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

/* -----------------------------------------------
*  read_cos_file function 
*/
async function read_cos_file(filename){
    await setup();
    console.log(`Reading file: ${filename}...`);
    var params = {
        Bucket: bucket,
        Key: filename
    }
    var readObject = null;
    
    try {
        readObject = await cos.getObject(params);
        console.log("Object read.");
    }
    catch (error){
        console.log(`Error! ${error}`);
    }
    
    return readObject;
}

/* -----------------------------------------------
*  list_cos_files function 
*/
async function list_cos_files(){
    console.log("Entering list_cos_files.");
    await setup();
    
    console.log(`Retrieving bucket contents from: ${bucket}`);
    var objList = await cos.listObjects({Bucket: 'coa-custom-crawler-output'})
    console.log("After listObjects.");    
    console.log(objList);
    if (objList != null && objList.Contents != null) {
        for (var i = 0; i < objList.Contents.length; i++) {
            var itemKey = objList.Contents[i].Key;
            var itemSize = objList.Contents[i].Size;
            console.log(`Item: ${itemKey} (${itemSize} bytes).`)
        }
    } 
    else {
        console.log("Enpty list.")
    }   
    return objList;
}

  module.exports = { write_cos_file, read_cos_file, list_cos_files };