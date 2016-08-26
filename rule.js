// First we'll need to compile the rule
// Parse the rule
// Get the default rule to execute
// analyse the WHAT
    // analyse the type
        // this is mainly for future use; i.e the NLP tags that will need to map against
    // if it starts w/ a "rule" then execute the referenced Rule and populate the values for the WHAT field
    // else that is 'what' nayya will hv to ask
// analyse the WHEN
    // if it starts w/ a "rule" then execute the referenced Rule and populate the values for the WHEN field
    // else check the tags
        // if its 'daily', check time of day  
        // if its in, fire up in the next array item duration
// analyse the WHO
    // if it starts w/ a "rule" then execute the referenced Rule and populate the values for the WHO field
    // else check the tags
        // match the nick name to a slack user id/channel
// analyse rules
    // the rules will be executed sequentially after the current rule is executed

var schedule = require('node-schedule');

var src;
var who,what,when;

rule.prototype.compileWhat = function() 
{
    if(this.src.what[0] == 'rule'){
        this.what.isRule = true; // then it is a rule
        this.what.nameOfRule = this.src.what[1];
    }
    else
        this.what.toAsk = this.src.what[0];

    console.log('    compiling WHAT... OK');
}

rule.prototype.compileWhen = function() 
{
    var date = new Date();

    if(this.src.when[0] == 'rule'){
        this.when.isRule = true; // then it is a rule
        this.when.nameOfRule = this.src.when[1];
    }
    else
    {
        // get when in a day
        if(this.src.when[1] == 'morning')
        {
            // gimme an approximate time between 7-9am
            date.setHours(Math.floor(Math.random()*(9-7+1)+7));
            date.setMinutes(Math.floor(Math.random()*(60-0+1)+0));
        }
        else if(this.src.when[1] == 'evening')
        {
            // gimme an approximate time between 5-9pm (i.e 17 - 21 hrs)
            date.setHours(Math.floor(Math.random()*(21-17+1)+17));
            date.setMinutes(Math.floor(Math.random()*(60-0+1)+0));
        }

        // get the recurring frequency
        if(this.src.when[0] == 'daily')
        {
            this.when.recur = new schedule.RecurrenceRule();
            this.when.recur.dayOfWeek = [0,1,2,3,4,5,6];
            this.when.recur.hour = [7,8,9];
            this.when.recur.minute = [0, new schedule.Range(1,30)];
        }
        else
            this.when.date = date;
    }

    console.log('    compiling WHEN... OK');
}

rule.prototype.compileWho = function()
{
    if(this.src.who[0] == 'rule'){
        this.who.isRule = true; // then it is a rule
        this.who.nameOfRule = this.src.who[1];
    }
    else
        // TODO: this has to be enhanced to allow nicknames
        this.who.toAsk = this.src.who[0]; // get the slack ID
    
    console.log('    compiling WHO... OK');
}

function rule(src)
{
    this.src = src;

    this.what = {
        toAsk:'',
        isRule:false,
        nameOfRule:''
    };

    this.when = {
        isRule: false,
        nameOfRule:''
    };

    this.who = {
        toAsk: '',
        isRule:false,
        nameOfRule:''
    };

    this.compileWhat();
    this.compileWhen();
    this.compileWho();

    return this;
}

module.exports = rule;