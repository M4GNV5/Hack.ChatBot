var sudo = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "sudo"))
		return;

	var senderPerm = bot.permLevel[sender] || 0;

	var _sender = args[0] || sender;
	var _senderPerm = bot.permLevel[_sender];

	if(senderPerm < _senderPerm)
	{
		bot.send("@" + sender + " cannot sudo as someone with higher permissions");
		return;
	}

	var text = args.slice(1).join(" ") || "!help";

	var data = {cmd: "chat", nick: _sender, text: text}
	bot.emit("chat", data);
}
module.exports = {sudo: sudo};
