var channelList = function(bot, sender, args)
{
	if(typeof args[0] != 'undefined' && args[0] == "add" && typeof args[1] != 'undefined')
	{
		if(bot.requirePerm(sender, "channelAdd"))
		return;

		var name = args[1];
		bot.config.channel.push(name);
	}
	else if(typeof args[0] != 'undefined' && args[0] == "remove" && typeof args[1] != 'undefined')
	{
		if(bot.requirePerm(sender, "channelAdd"))
			return;

		var name = args[1];

		if(bot.config.channel.indexOf(name) !== -1)
		{
			bot.config.channel.splice(bot.config.channel.indexOf(name), 1);
		}
		else
		{
			bot.send("Channel ?" + name + " is not on the list");
		}
	}
	else
	{
		bot.send("Known public channel: ?" + bot.config.channel.join(" ?"));
	}
}

module.exports = { channel: channelList };
