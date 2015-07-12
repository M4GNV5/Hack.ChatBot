var fs = require("fs");
var cmds = require("./../data/ownCommands.json");
var _cmds = {};

var createOwnCmdFunc = function(output)
{
	return function(bot, sender, args)
	{
		bot.send(output);
	};
};

for(var key in cmds)
{
	_cmds[key] = createOwnCmdFunc(cmds[key]);
}

var addOwnCmd = function(bot, sender, args)
{
	if(typeof bot.permLevel[sender] == 'undefined' || bot.permLevel[sender] < 3)
	{
		bot.send("@" + sender + " you dont have the permission to use this command");
		return;
	}

	if(typeof bot.commands[args[0]] != 'undefined')
	{
		bot.send("@" + sender + " that commands already exists");
	}
	else
	{
		var name = args[0];
		var output = args.slice(1).join(" ");

		bot.commands[name] = createOwnCmdFunc(output);
		cmds[name] = output;

		bot.send("@" + sender + " added command " + name);

		saveOwnCmds();
	}
};

var removeOwnCmd = function(bot, sender, args)
{
	if(typeof bot.permLevel[sender] == 'undefined' || bot.permLevel[sender] < 3)
	{
		bot.send("@" + sender + " you dont have the permission to use this command");
		return;
	}

	if(typeof bot.commands[args[0]] == 'undefined')
	{
		bot.send("@" + sender + " that commands does not exists");
	}
	else
	{
		delete bot.commands[args[0]];
		delete cmds[args[0]];
		bot.send("@" + sender + " removed command " + args[0]);

		saveOwnCmds();
	}
};

var saveOwnCmds = function()
{
	fs.writeFile("./src/data/ownCommands.json", JSON.stringify(cmds), function(err)
	{
		if(err)
			throw err;
	});
};

var exports = {add: addOwnCmd, remove: removeOwnCmd};
for(var key in _cmds)
{
	exports[key] = _cmds[key];
}

module.exports = exports;