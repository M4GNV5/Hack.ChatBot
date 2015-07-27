var init = function(bot)
{
	bot.afks = [];

	bot.on("chat", function(data)
	{
		var index = bot.afks.indexOf(data.nick);
		if(index !== -1)
			bot.afks.splice(index, 1);

		if(data.nick !== bot.nick)
		{
			for(var i = 0; i < bot.afks.length; i++)
			{
				var name = "@" + bot.afks[i];
				if(data.text.indexOf(name) !== -1)
					bot.send(name + " is afk!");
			}
		}
	});

	bot.on("onlineRemove", function (data)
	{
		if(bot.afks.indexOf(sender) !== -1)
			bot.afks.splice(bot.afks.indexOf(user), 1);
	});
};

var afk = function(bot, sender, args)
{
	var index = bot.afks.indexOf(sender);
	if(index !== -1)
	{
		bot.afks.splice(index, 1);
		bot.send("Welcome back @" + sender + "");
	}
	else
	{
		bot.send("User @" + sender + " is now AFK");
		bot.afks.push(sender);
	}
};

module.exports =
{
	init: init,
	afk: afk
};
