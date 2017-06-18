var config = require("../config.json")

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
    trigger = config["cmdPrefix"]
	bot.send("$\\Large\\text{hack.chat bot by M4GNV5}$\nCommands: "
             + trigger + cmds.join(", " + trigger));
}

module.exports = { h: help, help: help };
