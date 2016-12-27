var params = {
   "AttributeDefinitions": [ 
      { 
         "AttributeName": "ownerId",
         "AttributeType": "S"
      },
      {
        "AttributeName": "title",
        "AttributeType": "S"
      }
   ],
   "KeySchema": [ 
      { 
         "AttributeName": "ownerId",
         "KeyType": "HASH"
      },
      {
        "AttributeName": "title",
        "KeyType": "RANGE"         
      }
   ],
   "ProvisionedThroughput": { 
      "ReadCapacityUnits": 1,
      "WriteCapacityUnits": 1
   },
   "TableName": "ActiveReminders"
};

//aws dynamodb create-table --table-name Reminders --attribute-definitions AttributeName=UserId,AttributeType=S --key-schema AttributeName=UserId,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

var AWS = require('aws-sdk');

// Ensure that the region is correct
AWS.config.update({
    region:'ap-southeast-1'
});

var dynamodb = new AWS.DynamoDB({region_name:'ap-southeast-1', endpoint:"http://localhost:8000"});
dynamodb.createTable(params, function(err, data){
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});