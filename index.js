const fs = require('fs');
const FileTree = require('./FileTree')

function readLines(input, func) {
}

function func(data) {
  console.log('Line: ' + data);
}

var input = fs.createReadStream('input.txt');
readLines(input, func);



const parseCommand = async command => {
  let [ action, origin, dest ] = command.split(' ');
  return {
    action,
    origin,
    dest
  };
};

const getCommands = async filename => {
  var remaining = '';
  const commands = [];

  return await new Promise((resolve, reject) => {
    input.on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);
        commands.push(line);
        index = remaining.indexOf('\n');
      }
    });
  
    input.on('end', function() {
      resolve(commands);
    });
  })
};


(async () => {
  const commands = await getCommands('input.txt');
  // console.log(commands)
  const fT = new FileTree();
  for (let command of commands) {
    console.log(command);
    let commandObj = await parseCommand(command);
    try {
      await fT[commandObj.action.toLowerCase()](commandObj.origin, commandObj.dest);
    } catch(e) {
      console.log(e);
    }
  }
})();