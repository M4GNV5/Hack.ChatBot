var init = function(bot) 
{
	bot.afks = [];
	
	bot.on("onlineRemove", function (data)
	{
		_checkLeave(bot, data);
	});
};

var _addAFK = function(bot, user) 
{
	bot.afks.push(user);
}

var _removeAFK = function(bot, user) 
{
	if(bot.afks.indexOf(user) !== -1)
		bot.afks.splice(bot.afks.indexOf(user), 1);
}

var _checkLeave = function(bot, data)
{
	if(bot.afks.indexOf(data.nick) !== -1)
			_removeAFK(bot, data.nick);
}

var afk = function(bot, sender, args) 
{

	if(bot.afks.indexOf(sender) !== -1)
		_removeAFK(bot, sender);
	else 
	{
		bot.send("User @" + sender + " is now AFK");
		_addAFK(bot, sender);
	}
};

module.exports = 
{
	init: init,
	afk: afk
};