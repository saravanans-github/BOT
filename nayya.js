var Botkit = require('botkit');

Nayya.DONE = ['(done)','(paid)','(settled)','(setled)'];
Nayya.MOTIVATION = ['(worse)', '(bad)', '(shit)'];

Nayya.MOTIVATIONS = ['Don\t worry. Things hv been worse in the past... Cheer up.', 
                     'The night is darkest before dawn... Good times are comming.',
                     'Great things do not come easy... hold on tight.',
                     'Pain is an investment for a greater good.']

Nayya.prototype.sayMotivation = function(bot, message)
{
    bot.reply(message, Nayya.MOTIVATIONS[Math.round(Math.random() * Nayya.MOTIVATIONS.length)]);
}

function Nayya (_controller)
{
    controller = _controller;
}

module.exports = Nayya;