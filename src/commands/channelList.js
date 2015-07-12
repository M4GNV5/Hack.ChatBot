var fs = require("fs");
var channel = require("./../data/channel.json");

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
		channel.push(name);

		fs.writeFile("./src/data/channel.json", JSON.stringify(channel), function(err)
		{
			if(err)
				throw err;

			bot.send("Added channel ?" + name + " to the list");
		});
	}
	else if(typeof args[0] != 'undefined' && args[0] == "remove" && typeof args[1] != 'undefined')
	{
		if(typeof bot.permLevel[sender] == 'undefined' || bot.permLevel[sender] < 3)
		{
			bot.send("@" + sender + " ask @M4GNV5 to add your channel to the list");
			return;
		}

		var name = args[1];

		if(channel.indexOf(name) !== -1)
		{
			channel.splice(channel.indexOf(name), 1);

			fs.writeFile("./src/data/channel.json", JSON.stringify(channel), function(err)
			{
				if(err)
					throw err;

				bot.send("Removed channel ?" + name + " from the list");
			});
		}
		else
		{
			bot.send("Channel ?" + name + " is not on the list");
		}
	}
	else
	{
		bot.send("Known public channel: ?" + channel.join(" ?"));
	}
}

module.exports = { channel: channelList };
