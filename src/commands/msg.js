var messages = {};

function formatTimeDiff(time)
{
	var diff = (Date.now() - time) / 1000;
	if(diff < 60 * 2)
		return Math.floor(diff) + "s ago";

	diff /= 60;
	if(diff < 120)
		return Math.floor(diff) + "m ago";

	diff /= 60;
	if(diff < 120)
		return Math.floor(diff) + "h ago";

	diff /= 24;
	return Math.floor(diff) + "d ago";
}

exports.init = function(bot)
{
	bot.on("chat", function(data)
	{
		if(messages.hasOwnProperty(data.nick))
		{
			var entries = messages[data.nick];
			delete messages[data.nick];

			var text = "@" + data.nick + " you have " + entries.length + " new " +
				(entries.length == 1 ? "message" : "messages") + "\n";

			var now = new Date();
			entries.forEach(function(msg)
			{
				text += "[" + formatTimeDiff(msg.time) + "] " + msg.sender + " : " + msg.message + "\n";
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
