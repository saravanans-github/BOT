var dotenv = require('dotenv');
var Botkit = require('botkit');
var os = require('os');
var AWS = require('aws-sdk');
var getGroceryList = require('./conversations/getGroceryList.js');
var tellActiveReminders = require('./conversations/tellActiveReminders');

var cRule = '';
var cData = null;

// Ensure that the region is correct
AWS.config.update({
    region:'ap-southeast-1'
});

// Load my environment variables
dotenv.load();

// Convo manager for getGroceryList
var __startConversation = function (err, data)
{
    // if (err) {
    //     console.log("Decrypt error: " + err);
    // } else
    //     this.token = data;//.Plaintext.toString('ascii');
    
    bot.startRTM();

    controller.on(['rtm_open'], function(bot, message) {
            console.log('firing up the convo for rule: ' + cRule);
            new RULE_TO_CONVO_MAP[cRule](bot, message, cData);
    });

    //TODO: add a listener to listen for follow up actions
}

/********************* DEPRECATED ************************************/ 
// Publish the message that Nayya recieves to the topic
// function publishMsgToTopic (message, topicID) {
//         var paramsMessage = {
//             Message: JSON.stringify(message),
//             TopicArn: topicID
//         };
        
//         // Publish the chat msg on the specified Topic
//         snsClient.publish(paramsMessage, function(err, data){
//             if(err) console.log(err, err.stack);
//             else    console.log(data);
//         });
// }

// Decrypt the slack bot key and call the required convo
function decryptKMS(callback) {
   // Decrypt KMS Token        
        if (kmsEncyptedToken && kmsEncyptedToken !== "<kmsEncryptedToken>") {
            var encryptedBuf = new Buffer(kmsEncyptedToken, 'base64');
            var cipherText = {CiphertextBlob: encryptedBuf};

            var kms = new AWS.KMS(); 
            kms.decrypt(cipherText, callback);
        } else {
            console.log("Token has not been set.");
        }
}

var __getGroceryList = function(bot, message)
{
    new getGroceryList(bot, message);
} 

var __tellActiveReminders = function(bot, message, data)
{
    new tellActiveReminders(bot, message,data);
} 


// do a map of the convos to the rules
var RULE_TO_CONVO_MAP = {
    // Rule        : Callback
    GetGroceryList : __getGroceryList,
    TellActiveReminders : tellActiveReminders
}

function nayya(rule, data)
{
    // Get the name of the rule
    cRule = rule;

    // Store any data to be handled
    cData = data;

    // decrypt the slack bot key and get the Answer
    //decryptKMS(__startConversation);
    console.log('token: ' + process.env.SLACKAPITOKEN);
    __startConversation(null, process.env.SLACKAPITOKEN)
}

module.exports = nayya;