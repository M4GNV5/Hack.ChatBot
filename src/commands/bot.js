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

		bot.send("@" + sender + " " + JSON.stringify(out));
	}
	else if(args[0] == "list")
	{
		bot.send("@" + sender + " channel: ?" + Object.keys(channels).join(" ?"));
	}
	else if(args[0] == "join")
	{
		var newBot = new ChatConnection(bot.url, bot.nick, args[1]);

		newBot.on("chat", function(data) { newBot.parseCmd(data); });
		newBot.on("info", function(data) { console.log(newBot.channel + " | INFO : " + data.text); });
		newBot.on("warn", function(data) { console.log(newBot.channel + " | WARN : " + data.text); });

		newBot.commands = bot.commands;
		newBot.init = bot.init;
		newBot.parseCmd = bot.parseCmd;

		for(var i = 0; i < newBot.init.length; i++)
		{
			newBot.init[i](newBot);
		}

		channels[args[1]] = newBot;
	}
	else if(args[0] == "leave")
	{
		channels[args[1]].send("Goodbye!");
		channels[args[1]].ws.close();
	}
	else if(args[0] == "perm")
	{
		bot.permLevel[args[1]] = parseInt(args[2]);
	}
}

module.exports = { init: init, bot: botCmd };
