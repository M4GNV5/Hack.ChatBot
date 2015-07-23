var onlineTripcodes = {};
var init = function(bot)
{
	bot.permLevel = {};
	bot.requirePerm = function(sender, name)
	{
		var senderLvl = bot.permLevel[sender] || 0;
		var requiredLvl = bot.config.requiredPerm[name] || 0;

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

	bot.on("chat", function(data)
	{
		if(typeof data.trip != 'undefined')
		{
			onlineTripcodes[data.nick] = data.trip;
			if(typeof bot.config.users[data.trip] != 'undefined')
			{
				bot.permLevel[data.nick] = bot.config.users[data.trip];
			}
		}
	});
	bot.on("onlineRemove", function(data)
	{
		if(typeof onlineTripcodes[data.nick] != 'undefined')
			delete onlineTripcodes[data.nick];
		if(typeof bot.permLevel[data.nick] != 'undefined')
			delete bot.permLevel[data.nick];
	});
}

var _verify = function(bot, sender, trip, user)
{
	if(user == "vortico")
			bot.send("$\\color{red}{vortico}$ is always $\\color{lightgreen}{valid}$!");
	else if(bot.config.tripCodes[user])
	{
		if(bot.config.tripCodes[user] === trip)
			bot.send("@" + sender + " " + user + " is $\\color{lightgreen}{valid}$!");
		else
			bot.send("@" + sender + " " + user + " is $\\color{red}{not\\space valid}$!");
	}
	else
	{
		bot.send("@" + sender + " is not on the list, ask one of the admins to add " + user + " .");
	}
}

var verify = function(bot, sender, args, data)
{
	if(typeof args[0] == 'undefined' || args[0].trim() == "") //self verification
	{
		if(typeof data.trip == 'string')
			_verify(bot, sender, data.trip, sender);
		else
			bot.send("@" + sender + " you do not have a TripCode,\n when logging in use [username]#[password].");
	}
	else if(args[0] == "add" && typeof args[1] != 'undefined' && typeof args[2] != 'undefined')
	{
		if(bot.requirePerm(sender, "verifyAdd"))
			return;

		bot.config.tripCodes[args[2]] = args[1];
		bot.send("@" + sender + " added " + args[2] + " to the list");
	}
	else if(args[0] == "remove" && typeof args[1] != 'undefined')
	{
		if(bot.requirePerm(sender, "verifyAdd"))
			return;

		if(typeof bot.config.tripCodes[args[1]] == 'undefined')
		{
			delete bot.config.tripCodes[args[1]];
			bot.send("@" + sender + " removed " + args[1] + " from the list");
		}
		else
		{
			bot.send("@" + sender + " " + args[1] + " is not on the list");
		}
	}
	else if(typeof args[1] == 'undefined')
	{
		if(args[0] == "vortico")
			bot.send("$\\color{red}{vortico}$ is always $\\color{lightgreen}{valid}$!");
		else if(typeof onlineTripcodes[args[0]] != 'undefined')
			_verify(bot, sender, onlineTripcodes[args[0]], args[0]);
		else
			bot.send("@" + sender + " syntax is !verify <user> or !verify <tripcode> <user>");
	}
	else //Other Verification
	{
		var user = args[1];
		if(user.indexOf('@') != -1)
			user = user.substr(1);
		_verify(bot, sender, args[0], user);
	}
};

module.exports = { verify: verify, init: init };
