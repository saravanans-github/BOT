var dotenv = require('dotenv');
var qs = require('querystring');
var express = require('express');
var AWS = require('aws-sdk');
var dotenv = require('dotenv');
var nayya = require('./nayya.js'); 
var ruleReminder = require('./ruleReminder.js');
var Promise = require('promise');


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
    console.log('MW incoming. %s @ %d', req.url, Date.now());
    next();
});

// Process the POST request to processMsg
//router.post('/processMsg', __processMessage) ;
//router.post('/reminder/send', __sendReminders);
router.get('/reminder/get', __getReminders);
router.post('/reminder/update', __updateReminders);
router.post('/reminder/send', __sendReminders);
router.delete('/reminder/delete', __deleteReminders);


function __getReminders (req, res, next){
    "use strict";    

    ruleReminder.getReminders(  req.query.byOwnerId, 
                                req.query.byActive.localeCompare("false") ? true : false, 
                                function(err, data){  // respond w/ 200

        // re-format data
        var reminders = [];
	var j = 0;

        for(var i=0; i<data.Items.length; i++)
        {
            var reminder = { who: { remind: [] }, what: { description: ""}, when: { due: 0 } };

            // do not return the items if they have expired
            // TODO: delete this item from the DB
            if( data.Items[i].active.BOOL == true &&
                (new Date(Number(data.Items[i].when.M.due.S))).getTime() <= Date.now())
                continue;

            reminder.who.remind = data.Items[i].who.M.remind.SS;
            reminder.what.description = data.Items[i].what.M.description.S;
            reminder.when.due = Number(data.Items[i].when.M.due.S);
            reminders[j++] = reminder;
        }

        var response = { channel: req.query.byOwnerId, count: reminders.length, items: reminders};


        res.set('Content-Type', 'application/json');
        res.status(200);
        res.json(response).send();
    });
}

function __updateReminders (req, res, next){
    "use strict";

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

            //TODO:
            // 1. Get the in-active Reminders by iD

            ruleReminder.updateActiveReminders(jsonPayload.byOwnerId, function(err, data){
                // respond w/ 200

                res.set('Content-Type', 'application/json');
                res.status(200);
                res.json(data).send();
            });
        } catch (err) {
            console.log(err, err.stack);

            // Request not JSON formatted. 
            // Respond that we got a bad request as the  
            res.set('Content-Type', 'application/json');
            res.status(400);
            res.json({"status": "ERROR", "exception": "request not JSON formated"}).send();
        }
    })
}

function __sendReminders (req, res)
{
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

            // 3. Tell Nayya to remind on slack abt the active reminders
            res.set('Content-Type', 'application/json');
            res.status(200);
            res.json({"status": "OK"}).send();

            // Ask Nayya to ask the questions
            new nayya(jsonPayload.rule, jsonPayload.data);

        } catch (err) {
            console.log(err, err.stack);

            // Request not JSON formatted. 
            // Respond that we got a bad request as the  
            res.set('Content-Type', 'application/json');
            res.status(400);
            res.json({"status": "ERROR", "exception": "request not JSON formated"}).send();
        }
    })
}

function __deleteReminders (req, res)
{
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

            // 3. Tell Nayya to remind on slack abt the active reminders
            res.set('Content-Type', 'application/json');
            res.status(200);
            res.json({"status": "OK"}).send();

            // Ask Nayya to ask the questions
            new nayya(jsonPayload.rule, jsonPayload.data);

        } catch (err) {
            console.log(err, err.stack);

            // Request not JSON formatted. 
            // Respond that we got a bad request as the  
            res.set('Content-Type', 'application/json');
            res.status(400);
            res.json({"status": "ERROR", "exception": "request not JSON formated"}).send();
        }
    })
}

/********** Deprecated *************************/
// This is where the subscription to SNS happens
// function __processMessage (req, res){
//     var body = '';

//     // process the POST data
//     req.on('data', function (data) {
//         body += data;

//         // Too much POST data, kill the connection!
//         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
//         if (body.length > 1e6)
//             req.connection.destroy();
//     });

//     req.on('end', function () {
//         var jsonPayload;
        
//         try {
//             jsonPayload = JSON.parse(body); 
//         } catch (err) {
//             console.log(err, err.stack);
//             // Request not JSON formatted. 
//             // Tell SNS that we got a bad request as the  
//             res.writeHead(400, {'Content-Type': 'text/plain'});
//             res.end();
//         }

//         // This is to allow the HTTP endpoint to subscribe for to the SNS Topic
//         if (jsonPayload.Type == 'SubscriptionConfirmation')
//         {
//             console.log(body);
//             var snsClient = new AWS.SNS(AWS.credentials);
//             var params = {
//             "Token" : json.Token,
//             "TopicArn" : json.TopicArn
//             };
//             console.log('Subscribed to Notication ' + snsClient.confirmSubscription(params, function(err, data){
//                 if(err) console.log(err, err.stack);
//                 else    console.log(data);
//             }));
//         }
//         // All other messages come here
//         else if(jsonPayload.Type = 'Notification')
//         {
//             var jsonMessage;

//             try {
//                 jsonMessage = JSON.parse(jsonPayload.Message); 
//             } catch (err) {
//                 console.log(err, err.stack);
//                 return;
//             }

//             var message = '{"username" : "nayya", "channel" : "' + jsonMessage.channel + '", "text" : "' + jsonMessage.text + '"}';
//             console.log('Notified: ' + message);            
            
//             var request = require('request');
//             request.post(process.env.WEBHOOK_REMINDER).form({payload:message});

//             // Tell SNS that we got the msg loud and clear
//             res.writeHead(200, {'Content-Type': 'text/plain'});
//             res.end('Ok');
//         }
//     });
// }

function main()
{
    app.post('*', router);
    app.get('*', router);
    app.listen(3000);
    
    console.log('listening on PORT 3000');
}

main();
