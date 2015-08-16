var fs = require("fs");

var init = function(bot)
{
	var startup = function()
	{
		for(var key in bot.config.ownCommands)
		{
			bot.commands[key.toLowerCase()] = createOwnCmdFunc(key, bot.config.ownCommands[key]);
		}
	};

	if(!bot.config.ownCommands)
	{
		bot.on("config", startup);
	}
	else
	{
		startup();
	}
};

var createOwnCmdFunc = function(cmd, output)
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
			if(args[i].trim() != "")
				replace("%" + i + "%", args[i]);
		}
		if(/%[0-9]+%/g.test(_output))
		{
			bot.send("@" + sender + " not enough arguments!");
			return;
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
		var name = args[0].toLowerCase();
		var output = args.slice(1).join(" ");

		bot.commands[name] = createOwnCmdFunc(name, output);
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
