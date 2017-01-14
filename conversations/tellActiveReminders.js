    function tellActiveReminders(bot, data)
    {
        var reminders = data.items;
        var message = {channel:data.channel, text:''};

        console.log('here\'s what i\'m going to remind...');
        console.log(reminders);

        if(reminders.length == 0)
            message.text = 'No reminders for tomorrow. Good night!';
        else
            message.text = 'hi @saravanans @menaka85 some reminders...';
            
        bot.say(message);

        for(var i=0; i < reminders.length; i++)
        {
            message.text = reminders[i].what.description;
            bot.say(message);
        }
//       bot.closeRTM();
    }

    module.exports = tellActiveReminders;