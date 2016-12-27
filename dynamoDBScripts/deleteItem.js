var params = {
    "TableName": "Reminders",
    "Key": {
        "ownerId": {
            "S": "C3K03U7B5"
        },
        "title": {
            "S": "Abhi Piano lesson"
        }
    },
    "ReturnValues": "ALL_OLD"
};

var AWS = require('aws-sdk');

// Ensure that the region is correct
AWS.config.update({
    region:'ap-southeast-1'
});

var dynamodb = new AWS.DynamoDB({region_name:'ap-southeast-1' /*, endpoint:"http://localhost:8000"*/});
dynamodb.deleteItem(params, function(err, data){
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});