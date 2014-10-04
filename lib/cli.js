#!/usr/bin/env node

var cli = {
  'new': function() {
    console.log("This will make a new project by cloning it from git and installing dependencies.");
  },
  'run': function() {
    console.log("This will start a gulp task using a locally-installed instance of gulp.");
  },
  'help': function() {
    console.log("This will print out help stuff.");
  },
  '-v': function() {
    console.log("This will print out a version.");
  }
}

var command = process.argv[2];
var args = process.argv.slice(3);

// Print the help stuff if no command is given
if (typeof command === 'undefined') command = 'help';

cli[command].apply(this, args);
console.log(args);
