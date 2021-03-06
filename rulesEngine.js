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

var instructionObject;

function readAndParseInstruction(filename)
{
    // Read from the file
    fs.readFile(filename, (err, data) => {
    if (err) throw err;

    // Call the callback
    __parseInstruction(data)
    });
}

function parseInstruction(data)
{
    // Clear the object
    instructionObject = null;

    try {
        instructionObject = JSON.parse(data); 
    } catch (err) {
        console.log(err, err.stack);
        return;
    }
}

function RulesEngine()
{
    // Load the instruction
    readAndParseInstruction('reminder/groceries.json');
}

module.exports = RulesEngine;