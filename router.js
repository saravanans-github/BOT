var qs = require('querystring');
var express = require('express');
var AWS = require('aws-sdk');
var dotenv = require('dotenv');
var instruction = require('./instruction.js'); 

var snsClient;
var router = express.Router();
var app = express();


// Load my environment variables
dotenv.load();

// Ensure that the region is correct
AWS.config.update({
    region:'ap-southeast-1'
});

// Set the API version for SNS
AWS.config.apiVersions = {
  sns: '2010-03-31',
  // other service API versions
};

// Log every request that comes in to our Middleware
router.use(function timestamplog(req, res, next) {
    console.log('MW incoming. %s @ %dt', req.url, Date.now());
    next();
});

// Process the POST request to processMsg
router.post('/processMsg', __processMessage) ;

function __processMessage (req, res){
    var body = '';

    // process the POST data
    req.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            req.connection.destroy();
    });

    req.on('end', function () {
        var jsonPayload;
        
        try {
            jsonPayload = JSON.parse(body); 
        } catch (err) {
            console.log(err, err.stack);
            // Request not JSON formatted. 
            // Tell SNS that we got a bad request as the  
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end();
        }

        // This is to allow the HTTP endpoint to subscribe for to the SNS Topic
        if (jsonPayload.Type == 'SubscriptionConfirmation')
        {
            console.log(body);
            var snsClient = new AWS.SNS(AWS.credentials);
            var params = {
            "Token" : json.Token,
            "TopicArn" : json.TopicArn
            };
            console.log('Subscribed to Notication ' + snsClient.confirmSubscription(params, function(err, data){
                if(err) console.log(err, err.stack);
                else    console.log(data);
            }));
        }
        // All other messages come here
        else if(jsonPayload.Type = 'Notification')
        {
            var jsonMessage;

            try {
                jsonMessage = JSON.parse(jsonPayload.Message); 
            } catch (err) {
                console.log(err, err.stack);
                return;
            }

            var message = '{"username" : "nayya", "channel" : "' + jsonMessage.channel + '", "text" : "' + jsonMessage.text + '"}';
            console.log('Notified: ' + message);            
            
            var request = require('request');
            request.post(process.env.WEBHOOK_REMINDER).form({payload:message});

            // Tell SNS that we got the msg loud and clear
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Ok');
        }
    });
}

function main()
{
    app.post('*', router);
    app.listen(3000);
    
    console.log('listening on PORT 3000');

    var grocery = new instruction('reminder/groceries.json'); 
}

main();