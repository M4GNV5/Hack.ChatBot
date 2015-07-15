var init = function(bot)
{
	bot.bans = [];
};

var _ban = function(bot, time, user)
{
	bot.bans.push(user);

	if(time > 0)
		setTimeout(function() { _unban(bot, user); }, time);
}
var _unban = function(bot, user)
{
	if(bot.bans.indexOf(user) !== -1)
		bot.bans.splice(bot.bans.indexOf(user), 1);
}

var ban = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "ban"))
		return;

	var time = parseInt(args[0]) * 1000 || 60000;
	var bannUser = args.slice(1).join(" ");
	if(bot.bans.indexOf(bannUser) !== -1)
	{
		bot.send("@" + sender + " user @" + bannUser + " is already banned");
	}
	else
	{
		bot.send("User @" + bannUser + " is now banned from using this bot for " + time / 1000 + " seconds");
		_ban(bot, time, bannUser);
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
		_unban(bot, pardonUser);
	}
};

module.exports = { init: init, ban: ban, unban: unban };
