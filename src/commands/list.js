var ChatConnection;

var usersOnline = [];

var init = function(bot)
{
	ChatConnection = bot.constructor;

	bot.on("onlineSet", function(args)
	{
		usersOnline = args.nicks;
	});
	bot.on("onlineAdd", function(args)
	{
		usersOnline.push(args.nick);
	});
	bot.on("onlineRemove", function(args)
	{
		var leaverIndex = usersOnline.indexOf(args.nick);
		if(leaverIndex !== -1)
			usersOnline.splice(leaverIndex, 1);
	});
};

var list = function(bot, sender, args)
{
	if(typeof args[0] == 'undefined' || args[0].trim() == "")
	{
		bot.send("Users online: " + usersOnline.join(", "));
	}
	else
	{
		var channel = args[0];
		var nick = Math.random().toString(36).substring(3, 7);

		var closed = false;
		var _bot = new ChatConnection(bot.url, nick, channel);
		_bot.on("onlineSet", function(args)
		{
			bot.send("Users online in ?" + channel + ": " + args.nicks.join(", "));
			closed = true;
			_bot.ws.close();
		});

		setTimeout(function()
		{
			if(!closed)
				_bot.ws.terminate();
		}, 3000);
	}
}

module.exports = { init: init, list: list };