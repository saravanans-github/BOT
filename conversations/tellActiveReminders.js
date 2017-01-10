    function tellActiveReminders(bot, message, data)
    {
        var reminders = data.items;
        var message = null;

        if(reminders.length == 0)
            message = {channel:data.channel, text:'No reminders for tomorrow. Good night!'};
        
        message = {channel:data.channel, text:'hi @saravanans some reminders...'};
            
        bot.say(message);

        for(var i=0; i < reminders.length; i++)
        {
            message = {channel:data.channel, text:reminders[i].what.description};
            bot.say(message);
        }
    }

    module.exports = tellActiveReminders;