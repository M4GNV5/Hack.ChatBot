var md5 = require("MD5");
var knowUsers = require("./../data/users.json");
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
}

var login = function(bot, sender, args)
{
	lib.awaitPrivateInput(bot, sender, 180000, function(_bot, joined)
	{
		_bot.send("Awaiting password for " + sender + " in ?" + bot.channel);
	}, function(_bot, _sender, text)
	{
		var pw = md5(text);

		if(typeof knowUsers[pw] != 'undefined' && knowUsers.hasOwnProperty(pw))
		{
			var user = knowUsers[pw];
			bot.send("@" + sender + " successfully authed as " + user.nick);
			bot.permLevel[sender] = user.level;

			return true;
		}
		return false;
	});
};

module.exports = { init:init, login: login };
