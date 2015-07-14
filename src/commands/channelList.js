var fs = require("fs");

var channelList = function(bot, sender, args)
{
	if(typeof args[0] != 'undefined' && args[0] == "add" && typeof args[1] != 'undefined')
	{
		if(typeof bot.permLevel[sender] == 'undefined' || bot.permLevel[sender] < 1)
		{
			bot.send("@" + sender + " ask @M4GNV5 to add your channel to the list");
			return;
		}

		var name = args[1];
		bot.channel.push(name);
	}
	else if(typeof args[0] != 'undefined' && args[0] == "remove" && typeof args[1] != 'undefined')
	{
		if(typeof bot.permLevel[sender] == 'undefined' || bot.permLevel[sender] < 3)
		{
			bot.send("@" + sender + " ask @M4GNV5 to add your channel to the list");
			return;
		}

		var name = args[1];

		if(bot.channel.indexOf(name) !== -1)
		{
			bot.channel.splice(bot.channel.indexOf(name), 1);
		}
		else
		{
			bot.send("Channel ?" + name + " is not on the list");
		}
	}
	else
	{
		bot.send("Known public channel: ?" + bot.channel.join(" ?"));
	}
}

module.exports = { channel: channelList };
