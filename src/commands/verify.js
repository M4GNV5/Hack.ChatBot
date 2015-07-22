var fs = require("fs");

var tripCodes = require("../data/usersTripCode.json");

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
	else if(args[0].length === 0)
	{
		console.log('Test');
		console.log(args);
		if(data.trip != 'undefined')
		{
			if(tripCodes[sender] === data.trip)
				bot.send("@" + sender + " is $\\color{lightgreen}{valid}$!");
			else
			{
				bot.send("@" + sender + " is $\\color{red}{not valid}$! Feel free to ask one of the admins to add you to the list");
			}
		}
	}
	else if(typeof args[1] == 'undefined')
	{
		bot.send("@" + sender + " syntax is !verify [user] [tripCode] ");
	}
	else
	{
		var user = args[0]
		if(user.indexOf('@') != -1)
			user = user.substr(1);
		
		if(tripCodes[user] === args[1])
			bot.send("@" + sender + " " + user + " has been recognized as $\\color{lightgreen}{valid}$!");
		else
			bot.send("@" + sender + " " + user + " is $\\color{red}{not valid}$!");
	}
};

module.exports = { verify: verify };