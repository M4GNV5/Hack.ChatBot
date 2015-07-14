var md5 = require("MD5");
var lib = require("./../lib.js");

var invitedUsers = [];

var init = function(bot)
{
	bot.permLevel = {};
	bot.permLevel[bot.nick] = 666;

	bot.on("onlineRemove", function(data)
	{
		if(typeof bot.permLevel[data.nick] != 'undefined')
		{
			delete bot.permLevel[data.nick];
		}
	});

	bot.requirePerm = function(sender, name)
	{
		var senderLvl = bot.permLevel[sender] || 0;
		var requiredLvl = bot.config.requiredPerm[name] || 0

		if(requiredLvl <= senderLvl)
		{
			return false;
		}
		else
		{
			bot.send("@" + sender + " you dont have the permission to use this command");
			return true;
		}
	}
}

var login = function(bot, sender, args)
{
	lib.awaitPrivateInput(bot, sender, 180000, function(_bot, joined)
	{
		_bot.send("Awaiting password for " + sender + " in ?" + bot.channel);
	}, function(_bot, _sender, text)
	{
		var pw = md5(text);

		if(typeof bot.config.users[pw] != 'undefined' && bot.config.users.hasOwnProperty(pw))
		{
			var user = bot.config.users[pw];
			bot.send("@" + sender + " successfully authed as " + user.nick);
			bot.permLevel[sender] = user.level;

			return true;
		}
		return false;
	});
};

module.exports = { init:init, login: login };
