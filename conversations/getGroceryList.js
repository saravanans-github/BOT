    function getGroceryList(bot, message)
    {
        bot.startConversation(message, function(err, convo) {
            convo.ask('hi @saravanans. Any groceries to buy today?',
            [{
                pattern: bot.utterances.yes,
                callback: function(reply, convo) {
                    console.log('yes i want to buy');
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
                    convo.next();
                }
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
    }

    module.exports = getGroceryList;