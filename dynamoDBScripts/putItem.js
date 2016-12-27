var params = {
    'Item': {
        'ownerId': {'S': 'C3K03U7B5'},
        'title': {'S': 'Abhi swimming lesson'},
        'active': {'BOOL': false},
        'who': {'M': {
            'remind': {'SS': ['U1M8BBPD1']}
            // 'fyi': {'S': ''},
            // 'tag':{'M': {}}
        }},
        'what': {'M': {
            'description': {'S': "Abhi's piano lesson is tomorrow @ 7.30pm"}
            // 'tag': {'M': {}}
        }},
        'when': {'M': {
            'due': {'S': "0"},
            'period': {'S': 'week'},
            'day': {'S':'3'}
            // 'tag':{'M': {}}
        }}
    },
    'TableName': 'Reminders',
    'ReturnConsumedCapacity': 'TOTAL',
    'ReturnValues': 'ALL_OLD'
};

var AWS = require('aws-sdk');

// Ensure that the region is correct
AWS.config.update({
    region:'ap-southeast-1'
});

var dynamodb = new AWS.DynamoDB({region_name:'ap-southeast-1' /*, endpoint:"http://localhost:8000"*/});
dynamodb.putItem(params, function(err, data){
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});