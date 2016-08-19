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

var fs = require('fs');
var rule = require('./rule.js');

var instructionObject;
var ruleAtHead = 0;
var rules = [];

instruction.prototype.compile = function()
{
    // loop thru all the rules and compile them
    for(var item in instructionObject)
    {
        rules.push(new rule(instructionObject[item]));
    }
}

instruction.prototype.load = function(filename, __callback)
{
    // Read from the file
    fs.readFile(filename, (err, data) => {
    if (err) throw err;

    // Call the callback
    __load(data, __callback);
    });
}

function __load(data, __callback)
{
    // Clear the object
    instructionObject = null;

    try {
        instructionObject = JSON.parse(data);
    } catch (err) {
        console.log(err, err.stack);
        return;
    }

    typeof (__callback) == 'function' ? __callback() : true;
}

function instruction()
{
    // Load the instruction
    this.load('reminder/groceries.json', this.compile);

}

// Unit Testing
//instruction();
var instruct = new instruction();

module.exports = instruction;