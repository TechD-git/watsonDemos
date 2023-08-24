for f in messages/*.json; 

do 

echo "Processing $f file.."; 
curl -X POST -u "apikey":"[yourapikey]" -F file=@"$f" 'https://api.us-south.discovery.watson.cloud.ibm.com/instances/[instanceid]/v2/projects/[projectid]/collections/[collectionid]/documents?version=2019-11-29'
mv "$f" "$f".uploaded
sleep 1

done
