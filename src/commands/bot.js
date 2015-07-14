var ChatConnection;

var channels = {};

var init = function(bot)
{
	ChatConnection = bot.constructor;
	channels[bot.channel] = bot;
}

var botCmd = function(bot, sender, args)
{
	if(typeof bot.permLevel[sender] == 'undefined' || bot.permLevel[sender] < 5)
	{
		bot.send("@" + sender + " you dont have the permission to use this command");
		return;
	}

	if(typeof args[0] == 'undefined')
	{
		bot.send("@" + sender + " usage !bot debug|list|join|perm");
		return;
	}

	if(args[0] == "debug")
	{
		args[1] = args[1] || "";
		var split = args[1].split(".");
		var out = bot;
		for(var i = 0; i < split.length; i++)
		{
			if(typeof out[split[i]] == 'undefined')
			{
				bot.send("@" + sender + " could not read property " + split[i]);
				break;
			}
			else
			{
				out = out[split[i]];
			}
		}

		try
		{
			bot.send("@" + sender + " " + JSON.stringify(out));
		}
		catch(e)
		{
			bot.send("@" + sender + " error parsing json (maybe circular object?)");
		}
	}
	else if(args[0] == "perm")
	{
		bot.permLevel[args[1]] = parseInt(args[2]);
	}
}

module.exports = { init: init, bot: botCmd };
