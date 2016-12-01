var messages = {};

exports.init = function(bot)
{
	bot.on("chat", function(data)
	{
		if(messages[data.nick])
		{
			var entries = messages[data.nick];
			delete messages[data.nick];

			var text = "@" + data.nick + " you have " + entries.length + " new " +
				(entries.length == 1 ? "message" : "messages") + "\n";

			var now = new Date();
			entries.forEach(function(msg)
			{
				var time = new Date(msg.time);
				if(now.getDate() != time.getDate() || now.getMonth() != time.getMonth())
					text += "[" + time.toLocaleString() + "]";
				else
					text += "[" + time.toLocaleTimeString() + "]";

				text += " " + msg.sender + " : " + msg.message + "\n";
			});

			bot.send(text);
		}
	});
}

exports.msg = function(bot, sender, args)
{
	if(args.length < 2)
		return bot.send("@" + sender + " usage: !msg <nick> <message ...>");

	var target = args[0];
	if(target[0] == "@")
		target = target.substr(1);

	messages[target] = messages[target] || [];
	messages[target].push({
		time: Date.now(),
		sender: sender,
		message: args.slice(1).join(" ")
	});
};
