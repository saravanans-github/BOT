var params = {
    'Item': {
        'ownerId': {'S': 'G3Q8HS007'},
        'title': {'S': 'Arjun  school uniform'},
        'active': {'BOOL': false},
        'who': {'M': {
            'remind': {'SS': ['U1M8BBPD1']}
            // 'fyi': {'S': ''},
            // 'tag':{'M': {}}
        }},
        'what': {'M': {
            'description': {'S': "FYR... ARJUN needs to wear his T-Shirt to school tomorrow morning."}
            // 'tag': {'M': {}}
        }},
        'when': {'M': {
            'due': {'S': "2"},
            'period': {'S': 'week'},
            'day': {'S':'2'}
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