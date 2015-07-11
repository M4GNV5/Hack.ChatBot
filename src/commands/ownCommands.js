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

		bot.commands[name] = function(_bot, _sender, _args)
		{
			_bot.send(output);
		};

		bot.send("@" + sender + " added command " + name);
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
		bot.send("@" + sender + " removed command " + args[0]);
	}
};

module.exports = { add: addOwnCmd, remove: removeOwnCmd};