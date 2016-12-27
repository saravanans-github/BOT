var Promise = require('promise');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({region_name:'ap-southeast-1' /*, endpoint:"http://localhost:8000"*/});
const ACTIVE_REMINDER_TABLE_NAME = 'ActiveReminders';
const REMINDER_TABLE_NAME = 'Reminders';

var RuleReminder =
{
    getReminders: function(byOwnerId, byActive, callback)
    {
        var response;
        var params = {
            TableName: (byActive)? REMINDER_TABLE_NAME : ACTIVE_REMINDER_TABLE_NAME, /* required */
            Select: 'ALL_ATTRIBUTES',
            KeyConditionExpression: 'ownerId = :byOwnerId',
            FilterExpression: 'active = :active',
            ExpressionAttributeValues: {
                ":byOwnerId": {"S": byOwnerId},
                ":active": {"BOOL": byActive}
            },
        };

        var request = dynamodb.query(params);
        var promise = request.promise();

        // handle promise's fulfilled/rejected states
        promise.then(
            function(data) {
                console.log(data.Items);
                callback(null, data);
            },
            function(error) {
                /* handle the error */
                console.log(err, err.stack);
                callback(err, null);
            }
        );
    },
    updateActiveReminders: function(byOwnerId, callback)
    {
        var response;
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

        console.log(params);

        var request = dynamodb.query(params);
        var promise = request.promise();

        // handle promise's fulfilled/rejected states
        promise.then(
            function(data) {
                console.log(data.Items);
                var currentDateTime = new Date(Date.now());
                var currentItem = null;

                for(var i=0;i <data.Items.length; i++)
                {
                    currentItem = data.Items[i];

                    // TODO: check if the item has expired. CORRECT CODE BUT IN WRONG PLACE :)
                    // if (currentItem.when.value & currentDateTime.getTime() > Number(currentItem.when.value))
                    //     continue;
                    switch (currentItem.when.M.period.S) {
                        case "week":
                            if((Number(currentItem.when.M.day.S) - currentDateTime.getDay()) == 1) // if it is 1 day before
                            {
                                // update the value of when this reminder is due
                                var tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                currentItem.when.M.due.S = tomorrow.getTime().toString(); // the due date
                                currentItem.active.BOOL = true;
                                console.log('is Active? ');
                                console.log(currentItem.active.BOOL);
                            }
                            break;
                    }

                    // we need to add this to the DB
                    if(currentItem.active.BOOL)
                    {
                        currentItem.title.S += '|ACTIVATED';
                        var params = {    
                            'Item': currentItem,
                            'TableName': 'Reminders'
                        }

                        console.log('new params');
                        console.log(params);

                        dynamodb.putItem(params, function(err, data){
                            if (err) console.log(err, err.stack); // an error occurred
                            else  callback(null, params);           // successful response
                            });
                    }
                }
            },
            function(error) {
                /* handle the error */
                console.log(err, err.stack);
                callback(err, null);
            }
        );
    },    
    reminder: {
        who: {
            remind: ""
        },
        what: {
            description: ""
        },
        when: {
            due: 0
        }
    }
}

module.exports = RuleReminder;