var fs = require("fs");

var tripCodes = require("../data/usersTripCode.json");

var _verify = function(bot, sender, trip, user)
{
	if(user == "vortico")
			bot.send("$\\color{red}{vortico}$ is allways $\\color{lightgreen}{valid}$!");
	else if(tripCodes[user])
	{
		if(tripCodes[user] === trip)
			bot.send("@" + sender + " " + user + " is $\\color{lightgreen}{valid}$!");
		else
			bot.send("@" + sender + " " + user + " is $\\color{red}{not\\space valid}$!");
	}
	else
		bot.send("@" + sender + " is not on the list, ask one of the admins to add " + user + " .");
}

var verify = function(bot, sender, args, data) 
{
	if(typeof args[0] != 'undefined' && args[0] == "add" && typeof args[1] != 'undefined')
	{
		if(bot.requirePerm(sender, "verifyAdd"))
		return;
	}
	else if(typeof args[0] != 'undefined' && args[0] == "remove" && typeof args[1] != 'undefined')
	{
		if(bot.requirePerm(sender, "verifyAdd"))
		return;
	}
	else if(args[0].length === 0) //Self Verification
	{
		if(data.trip)
			_verify(bot, sender, data.trip, sender);						
		else
			bot.send("@" + sender + " you do not have a TripCode,\n when logging in use [username]#[password].");
	}
	else if(typeof args[1] == 'undefined') //Missusage of syntax
	{
		if(args[0] == "vortico")
			bot.send("$\\color{red}{vortico}$ is allways $\\color{lightgreen}{valid}$!");
		else	
			bot.send("@" + sender + " syntax is !verify [tripCode] [user]");
	}
	else //Other Verification
	{
		var user = args[1]
		if(user.indexOf('@') != -1)
			user = user.substr(1);
		_verify(bot, sender, args[0], user);
	}
};

module.exports = { verify: verify };