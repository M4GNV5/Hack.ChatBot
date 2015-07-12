var md5 = require("MD5");
var knowUsers = require("./../data/users.json");
var lib = require("./../lib.js");

var invitedUsers = [];

var init = function(bot)
{
	bot.permLevel = {};
}

var login = function(bot, sender, args)
{
	lib.awaitPrivateInput(bot, sender, 60000, function(_bot, joined)
	{
		_bot.send("Awaiting password for " + sender + " in ?" + bot.channel);
	}, function(_bot, _sender, text)
	{
		var pw = md5(text);

		if(typeof knowUsers[pw] != 'undefined' && knowUsers.hasOwnProperty(pw))
		{
			var user = knowUsers[pw];
			_bot.send("@" + _sender + " successfully authed as " + user.nick + " in ?" + bot.channel)
			bot.send("@" + sender + " successfully authed as " + user.nick);
			bot.permLevel[sender] = user.level;

			return true;
		}
		return false;
	});
};

var logout = function(bot, sender, args)
{
	if(typeof bot.permLevel[sender] == 'number')
	{
		delete bot.permLevel[sender];
		bot.send("@" + sender + " logout successfull");
	}
	else
	{
		bot.send("@" + sender + " you are not logged in");
	}
}

module.exports = { init:init, login: login, logout: logout };
