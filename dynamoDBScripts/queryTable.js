var byOwnerId = "U1M8BBPD1";
var params = {
    TableName: 'Reminders', /* required */
    Select: 'ALL_ATTRIBUTES',
    KeyConditionExpression: 'ownerId = :byOwnerId',
    FilterExpression: 'active = :active',
    ExpressionAttributeValues: {
        ":byOwnerId": {"S": byOwnerId},
        ":active": {"BOOL": false}
    },
};

var AWS = require('aws-sdk');

// Ensure that the region is correct
AWS.config.update({
    region:'ap-southeast-1'
});

var dynamodb = new AWS.DynamoDB({region_name:'ap-southeast-1', endpoint:"http://localhost:8000"});
dynamodb.query(params, function(err, data){
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});