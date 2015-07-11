var md5 = require("md5");
var knowUsers = require("./users.json");

var awaitingAuths = {};

var auth = function(bot, sender, args)
{
	if(typeof awaitingAuths[sender] == 'undefined')
	{
		var prefix = "";
		for(var i = 0; i < 4; i++)
		{
			var rnd = Math.round(Math.random() * 83) + 43;
			prefix += String.fromCharCode(rnd);
		}

		bot.send("@" + sender + " give me the md5 of " + prefix + " + your password");
		awaitingAuths[sender] = prefix;
	}
	else
	{
		var arg = args.join(" ");

		for(var key in knowUsers)
		{
			if(md5(awaitingAuths[sender] + key) == arg)
			{
				user = knowUsers[key];
				bot.permLevel[sender] = user.level;

				bot.send("@" + sender + " successfully authed as " + user.nick);
				return;
			}
		}
		bot.send("@" + sender + " invalid hash");
		delete awaitingAuths[sender];
	}
};

module.exports = { auth: auth };
