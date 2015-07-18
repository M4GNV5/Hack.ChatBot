var autoCommand = function(bot, sender, args)
{
	var arg = args.join(" ");

	var cmdResults = [];
	for(var cmd in bot.commands)
	{
		if(cmd.length > 3 && args.indexOf(cmd) !== -1)
		{
			cmdResults.push(cmd);
		}
	}
	if(cmdResults.length == 0)
	{
		bot.send("@" + sender + " sorry i dont understand that :(");
		return;
	}
	else if(cmdResults.length > 1)
	{
		bot.send("@" + sender + " possible results: " + cmdResults.join(", "));
		return;
	}

	arg = arg.replace(new RegExp(cmdResults[0], "g"), "");

	var argSplit = arg.split(" ");
	for(var i = 0; i < argSplit.length; i++)
	{
		if(argSplit[i].trim() == "")
			argSplit.splice(i, 1);
	}

	var filter = bot.config.autoCmd.filter;
	for(var i = 0; i < filter.length; i++)
	{
		var index = argSplit.indexOf(filter[i])
		if(index !== -1)
			argSplit.splice(index, 1);
	}

	bot.commands[cmdResults[0]](bot, sender, argSplit);
};

var autoFilter = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "autoFilter"))
		return;

	bot.config.autoCmd.filter.push(args[0]);
	bot.send("@" + sender + " added " + args[0] + " to the filter");
};

module.exports = {auto: autoCommand, autoFilter: autoFilter};

