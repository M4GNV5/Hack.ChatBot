var init = function(bot)
{
	bot.bans = [];
};

var ban = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "ban"))
		return;

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

var unban = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "unban"))
		return;

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

module.exports = { init: init, ban: ban, unban: unban };

