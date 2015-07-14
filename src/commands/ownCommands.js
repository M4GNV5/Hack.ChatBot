var fs = require("fs");

var init = function(bot)
{
	var startup = function()
	{
		for(var key in bot.config.ownCommands)
		{
			bot.commands[key] = createOwnCmdFunc(bot.config.ownCommands[key]);
		}
	};

	if(!bot.config)
	{
		bot.on("config", startup);
	}
};

var createOwnCmdFunc = function(output)
{
	return function(bot, sender, args)
	{
		var _output = output;

		var replace = function(oldText, newText)
		{
			if(_output.indexOf(oldText) !== -1)
				_output = _output.replace(oldText, newText);
		}

		replace("%url%", bot.url);
		replace("%channel%", bot.channel);
		replace("%self%", bot.nick);
		replace("%sender%", sender);

		for(var i = 0; i < args.length; i++)
		{
			replace("%" + i + "%", args[i]);
		}

		bot.send(_output);
	};
};

var addOwnCmd = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "add"))
		return;

	if(typeof bot.commands[args[0]] != 'undefined')
	{
		bot.send("@" + sender + " that commands already exists");
	}
	else
	{
		var name = args[0];
		var output = args.slice(1).join(" ");

		bot.commands[name] = createOwnCmdFunc(output);
		bot.config.ownCommands[name] = output;

		bot.send("@" + sender + " added command " + name);
	}
};

var removeOwnCmd = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "remove"))
		return;

	if(typeof bot.commands[args[0]] == 'undefined')
	{
		bot.send("@" + sender + " that commands does not exists");
	}
	else
	{
		delete bot.commands[args[0]];
		delete bot.config.ownCommands[args[0]];
		bot.send("@" + sender + " removed command " + args[0]);
	}
};

module.exports = {init: init, add: addOwnCmd, remove: removeOwnCmd};