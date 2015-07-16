var ChatConnection = require("./connection.js");

exports.awaitPrivateInput = function(mainBot, user, timeout, joinCb, messageCb)
{
	var invitation = {cmd: "invite", nick: user};
	mainBot.ws.send(JSON.stringify(invitation));

	var getPrivateInput = function(args)
	{
		var split = args.text.split(" ");

		if(split[0] != "You" && split[1] != "invited")
			return;

		var nick = "";
		for(var i = 2; i < split.length - 2; i++)
		{
			nick += " " + split[i];
		}
		nick = nick.trim();

		if(nick != user)
			return;

		var channel = split[split.length - 1].substr(1);

		var bot = new ChatConnection(mainBot.url, mainBot.nick, channel);
		var closed = false;

		bot.on("onlineAdd", function(args)
		{
			joinCb(bot, args.nick);
		});
		bot.on("chat", function(args)
		{
			var finished = messageCb(bot, args.nick, args.text);

			if(finished)
			{
				bot.ws.close();
				mainBot.removeListener("info", getPrivateInput);
				closed = true;
			}
		});

		if(timeout > 0)
		{
			setTimeout(function()
			{
				if(!closed)
				{
					bot.ws.terminate();
					mainBot.removeListener("info", getPrivateInput);
				}
			}, timeout);
		}
	};

	mainBot.on("info", getPrivateInput);
}
