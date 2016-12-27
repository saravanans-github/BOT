    function tellActiveReminders(bot, message, data)
    {
        var reminders = data.items;
        var message = {channel:data.channel, text:'hi @saravanans some reminders...'};
            
        bot.say(message);

        for(var i=0; i < reminders.length; i++)
        {
            message = {channel:data.channel, text:reminders[i].what.description};
            bot.say(message);
        }
    }

    module.exports = tellActiveReminders;