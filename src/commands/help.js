var help = function(bot, sender, args)
{
	var cmds = Object.keys(bot.commands).join(", !");
	bot.send("$\\Large Hack.Chat$ $\\Large bot$ $\\Large by$ $\\Large M4GNV5.$\nCommands: !" + cmds);
}

module.exports =
{
	h: help,
	help: help
};