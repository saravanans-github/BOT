// CONSTANTS
kmsEncyptedToken = "CiC+t+IKhbKCLUSP834vDZu8SAXPw/hqnLXIwOC0rEB2tBKxAQEBAgB4vrfiCoWygi1Ej/N+Lw2bvEgFz8P4apy1yMDgtKxAdrQAAACIMIGFBgkqhkiG9w0BBwageDB2AgEAMHEGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMvha/ptFPUWrX3deyAgEQgEQ/iPzB+w7vklx/j1WIP9qGGiJpTprxziRAu9QTfAtfscyo+PEOHlc1W1ARMvvetGBhkDLBzZOA7L9uuSltsdkOOAOYRQ==";

// JavaScript source code
var AWS = require('aws-sdk');
var qs = require('querystring');
var token, kmsEncyptedToken;
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

// Ensure that the region is correct
AWS.config.update({
    region:'ap-southeast-1'
});

// Set the API version for SNS
AWS.config.apiVersions = {
    sns: '2010-03-31',
    // other service API versions
};

// Publish the message that Nayya recieves to the topic
function publishMsgToTopic (msg, topicID) {
        var msgParams = {
            Message: msg,
            TopicArn: topicID
        };
        
        // Publish the chat msg on the specified Topic
        snsClient.publish(msgParams, function(err, data){
            if(err) console.log(err, err.stack);
            else    console.log(data);
        });
}

function Nayya () {
   // Decrypt KMS Token
        this.rtm = null;
        
        if (kmsEncyptedToken && kmsEncyptedToken !== "<kmsEncryptedToken>") {
            var encryptedBuf = new Buffer(kmsEncyptedToken, 'base64');
            var cipherText = {CiphertextBlob: encryptedBuf};

            var kms = new AWS.KMS();
            kms.decrypt(cipherText, function (err, data) {
                if (err) {
                    console.log("Decrypt error: " + err);
                } else {
                    token = data.Plaintext.toString('ascii');
                    
                        // double check that token is not null
                if (token != null)
                            startNayya(token); // start the chat bot
                }
            });
        } else {
            console.log("Token has not been set.");
        }
}

function startNayya (token)
    {
        // start the rtm
        this.rtm = new RtmClient(token, { logLevel: 'none' });
        
        // Start the real time chat i.e the socket io
        rtm.start();
        console.log('Listening');

        // Read the messges recieved
        rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
            // TODO: THIS HAS TO BE REMOVED BEFORE GOING LIVE
            // Log the message recieved.
            console.log('Message:', message);

            // Construct the client.
            snsClient = new AWS.SNS({credentials:AWS.credentials});

            // Get the list of topics
            snsClient.listTopics(null, function (err,data) {
                if(err) console.log(err, err.stack);
                else   publishMsgToTopic(message.text.toString('utf-8'), // Ensure that its in UTF.
                                         data.Topics[0].TopicArn);
            });
        });
};

Nayya.prototype.sendMessage = function (msg, personTo) {
        console.log('going to reply');

        // start the rtm
//        rtm = new RtmClient(token, { logLevel: 'none' });
        this.rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function(){
            rtm.sendMessage(msg, personTo, function messageSent(){ console.log('Replied');});
        });
}

module.exports.Nayya = Nayya;

// main();