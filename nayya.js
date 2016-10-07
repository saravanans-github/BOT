var dotenv = require('dotenv');
var Botkit = require('botkit');
var os = require('os');
var AWS = require('aws-sdk');
//var qs = require('querystring');

var controller = Botkit.slackbot({
    debug: false
});

// Ensure that the region is correct
AWS.config.update({
    region:'ap-southeast-1'
});

// Load my environment variables
dotenv.load();

// get the kms slack token
var kmsEncyptedToken = process.env.KMSENCRYPTEDTOKEN

// Call backs
function __startListening (err, data)
{
    if (err) {
        console.log("Decrypt error: " + err);
    } else
        this.token = data.Plaintext.toString('ascii');

   var bot = controller.spawn({
        token: this.token
    });
    
    bot.startRTM();
    
    controller.on(['rtm_open'], function(bot, message) {
            message = {channel:'D1M9KQWTG', user:'U1M8BBPD1', text:''};

        bot.startConversation(message, function(err, convo) {
            var askWhatToBuy = function(response, convo) {
                convo.ask("what wld they be?", [
                {
                    pattern: new RegExp(/([0-9a-z]), ([0-9a-z])/i),
                    callback: function(response,convo) {
                        convo.say('Awesome... I\'ll remind you at 6pm today.');
                        convo.say('ttyl');
                        convo.next();
                    }
                },
                {
                    default: false,
                    callback: function(reply, convo) {
                        // As the question again.
                        convo.repeat();
                    }
                }]);
            };

            convo.ask('hi @saravanans. Any groceries to buy today?',
            [{
                pattern: bot.utterances.yes,
                callback: askWhatToBuy
            },
            {
                pattern: bot.utterances.no,
                callback: function(reply, convo) {
                    convo.say('Np.');
                    convo.say('Bye for nw.');
                    convo.next();
                }
            },
            {
                default: true,
                callback: function(reply, convo) {
                    convo.repeat();
                }
            }]);


            // TODO: Send the result of the conversation to SNS to process the next Rule
            convo.on('end',function(convo) {
                if (convo.status=='completed') {
                    // do something useful with the users responses
                    var res = convo.extractResponses();

                    // reference a specific response by key
                    var value  = convo.extractResponse('key');

                    // ... do more stuff...

                } else {
                    // something happened that caused the conversation to stop prematurely
                }
            });
        }); 
    });
}

// Publish the message that Nayya recieves to the topic
function publishMsgToTopic (message, topicID) {
        var paramsMessage = {
            Message: JSON.stringify(message),
            TopicArn: topicID
        };
        
        // Publish the chat msg on the specified Topic
        snsClient.publish(paramsMessage, function(err, data){
            if(err) console.log(err, err.stack);
            else    console.log(data);
        });
}

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

function main()
{
    // // Define what needs to be listened for and where to publish
    // controller.hears(['(.*)'], 'direct_message,direct_mention,mention', function(bot, message) 
    // {
    //     // Construct the client.
    //     snsClient = new AWS.SNS({credentials:AWS.credentials});

    //     console.log(message);

    //     // Get the list of topics
    //     snsClient.listTopics(null, function (err,data) {
    //         if(err) console.log(err, err.stack);
    //         else   publishMsgToTopic({ text: message.text, channel: message.channel }, data.Topics[0].TopicArn);
    //     }); 
    // });

    decryptKMS(__startListening);
}

main();