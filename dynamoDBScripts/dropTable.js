var params = {
  TableName: 'Reminders' /* required */
};

var AWS = require('aws-sdk');

// Ensure that the region is correct
AWS.config.update({
    region:'ap-southeast-1'
});

var dynamodb = new AWS.DynamoDB({region_name:'ap-southeast-1', endpoint:"http://localhost:8000"});

dynamodb.deleteTable(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
