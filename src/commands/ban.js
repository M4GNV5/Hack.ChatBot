var ban = function(bot, sender, args)
{
	if(typeof bot.permLevel[sender] == 'undefined' || bot.permLevel[sender] < 1)
	{
		bot.send("@" + sender + " you dont have the permission to use this command");
		return;
	}

	var bannUser = args.join(" ");
	if(bot.bans.indexOf(bannUser) !== -1)
	{
		bot.send("@" + sender + " user @" + bannUser + " is already banned");
	}
	else
	{
		bot.send("User @" + bannUser + " is now banned from using this bot");
		bot.bans.push(bannUser);
	}
};

var pardon = function(bot, sender, args)
{
	if(typeof bot.permLevel[sender] == 'undefined' || bot.permLevel[sender] < 1)
	{
		bot.send("@" + sender + " you dont have the permission to use this command");
		return;
	}

	var pardonUser = args.join(" ");
	if(bot.bans.indexOf(pardonUser) === -1)
	{
		bot.send("@" + sender + " user @" + pardonUser + " is not banned yet");
	}
	else
	{
		bot.send("@" + sender + " user @" + pardonUser + " is no longer banned");
		bot.bans.splice(bot.bans.indexOf(pardonUser), 1);
	}
};

module.exports = { ban: ban, pardon: pardon, unban: pardon };

