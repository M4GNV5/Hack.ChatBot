var help = function(bot, sender, args)
{
	var cmds = Object.keys(bot.commands).join(", !");
	bot.send("$\\Large\\text{hack.chat bot by M4GNV5}$\nCommands: !" + cmds);
}

module.exports =
{
	h: help,
	help: help
};