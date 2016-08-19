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

var src;

function compileWhen()
{

}

function compileWho()
{

}

function compileRules()
{

}

function rule(src)
{
    this.src = src;
    var what = '';
    var when = {
        time: new Date(),
        freq: 0
    };

    compileWhat = function() {
        if(src.what[0] == 'rule')
            ; // then it is a rule
        else
            what = src.what[0];
    }

    compileWhen = function() {
    if(src.when[0] == 'rule')
        ; // then it is a rule
    else
    {
        // get the repeat frequency
        if(src.when[0] == 'daily')
        {
            when.freq = (24*60*60); // every 24 hrs
        }

        // get when in a day
        if(src.when[1] == 'morning')
        {
            // gimme an approximate time between 7-9am
            when.time.setHours(Math.floor(Math.random()*(9-7+1)+7));
            when.time.setMinutes(Math.floor(Math.random()*(60-0+1)+0));
        }
        else if(src.when[1] == 'evening')
        {
            // gimme an approximate time between 5-9pm (i.e 17 - 21 hrs)
            when.time.setHours(Math.floor(Math.random()*(21-17+1)+17));
            when.time.setMinutes(Math.floor(Math.random()*(60-0+1)+0));
        }
    }
}

    this.getWhat = function () { return what; }
    this.getWhen = function () { return when; }

    compileWhat();
    compileWhen();

    return this;
}

module.exports = rule;