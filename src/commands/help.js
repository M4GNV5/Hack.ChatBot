var help = function(bot, sender, args)
{
	var cmds = [];
	var lvl = bot.permLevel[sender] || 0;

	for(var key in bot.commands)
	{
		var requiredLvl = bot.config.requiredPerm[key] || 0;

		if(requiredLvl <= lvl)
			cmds.push(key);
	}
	cmds = cmds.sort();
	bot.send("$\\Large\\text{hack.chat bot by M4GNV5}$\nCommands: !" + cmds.join(", !"));
}

module.exports = { h: help, help: help };