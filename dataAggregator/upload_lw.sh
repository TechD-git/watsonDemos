for f in `find ./root/da -type f -name "*.json" `; 

do 

echo "Processing $f file.."; 
curl -X POST -u "apikey":"Xe4i0IPqKpsq-qljOnphFuoQ47AzBLRQDxMRDt1zTuWr" -F file=@"$f" 'https://api.us-south.discovery.watson.cloud.ibm.com/instances/b2dacf82-9b06-4b13-ad72-8279b5276fb1/v2/projects/1db622f1-61f6-4fa3-9aef-f5da9ad7597e/collections/91eb3fca-2c9e-6609-0000-018e57d145f7/documents?version=2019-11-29'
mv "$f" "$f".uploaded
sleep 1

done
