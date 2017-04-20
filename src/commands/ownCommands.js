function createCommand(cmd)
{
	return function(bot, sender, args)
	{
		if(cmd.type == "text")
		{
			var text = cmd.text;

			function replace(oldText, newText)
			{
				while(text.indexOf(oldText) !== -1)
					text = text.replace(oldText, newText);
			}

			replace("%url%", bot.url);
			replace("%channel%", bot.channel);
			replace("%self%", bot.nick);
			replace("%sender%", sender);

			for(var i = 0; i < args.length; i++)
			{
				replace("%" + i + "%", args[i]);
			}

			if(!/%[0-9]+%/g.test(text))
			{
				bot.send(text);
				return;
			}
		}
		else
		{
			bot.send("Unknown command type");
			return;
		}

		if(cmd.usage)
			bot.send("Usage: " + cmd.usage);
		else
			bot.send("Failed executing !" + cmd.name);
	};
}

exports.init = function(bot)
{
	function startup()
	{
		for(var key in bot.config.ownCommands)
		{
			bot.commands[key] = createCommand(bot.config.ownCommands[key]);
		}
	}

	if(!bot.config.ownCommands)
		bot.on("config", startup);
	else
		startup();
};

exports.command = function(bot, sender, args, data)
{
	if(bot.requirePerm(sender, "command"))
		return;

	if(args.length < 2)
		return bot.send("@" + sender + " Usage: !command set-text|delete|usage|info <cmd> <text ...>");

	var name = args[1].toLowerCase();
	var text = args.slice(2).join(" ");

	var cmd;
	if(bot.config.ownCommands.hasOwnProperty(name))
		cmd = bot.config.ownCommands[name];

	function commandsBy(user)
	{
		/*return bot.config.ownCommands.filter(function(cmd)
		{
		return cmd.author.nick == user || cmd.author.trip == user;
		});*/
		var commands = [];
		for(var key in bot.config.ownCommands)
		{
			var cmd = bot.config.ownCommands[key];
			if(cmd.author.nick == user || cmd.author.trip == user)
				commands.push(cmd);
		}

		return commands;
	}
	function checkUserPerm(isCreate)
	{
		var config = bot.config.command;

		if(!cmd && bot.commands[name])
			bot.send("@" + sender + " that is a builtin command");
		else if(!cmd && !isCreate)
			bot.send("@" + sender + " no such command exists");
		else if(isCreate && text.trim() == "")
			bot.send("@" + sender + " command cannot be empty");
		else if(isCreate && commandsBy(sender).length >= (bot.permLevel[sender] || 0) * config.limitScale + config.limitBase)
			bot.send("@" + sender + " you already created too many commands");
		else if(cmd && cmd.author.trip != data.trip && bot.requirePerm(sender, "command-admin", true))
			bot.send("@" + sender + " cannot modify someone else's command");
		else
			return true;

		return false;
	}

	switch(args[0])
	{
		case "set-text":
			if(!checkUserPerm(true))
				return;

			bot.config.ownCommands[name] = {
				name: name,
				type: "text",
				author: {trip: data.trip, nick: sender},
				text: text,
				created: Date.now(),
				edited: Date.now()
			};
			bot.commands[name] = createCommand(bot.config.ownCommands[name]);

			bot.send("@" + sender + " set command " + name);
			break;


		//TODO set-pastebin


		case "delete":
			if(!checkUserPerm())
				return;

			delete bot.commands[name];
			delete bot.config.ownCommands[name];

			bot.send("@" + sender + " deleted command " + name);
			break;


		case "usage":
			if(!checkUserPerm())
				return;
			cmd.usage = text;
			cmd.edited = Date.now();
			break;


		case "info":
			if(!checkUserPerm())
				return;

			var msg = "Info for command !" + name +
				"\nAuthor: [" + cmd.author.trip + "] " + cmd.author.nick +
				"\nType: " + cmd.type;

			if(cmd.type == "pastebin")
				msg += "\nUrl: https://pastebin.com/" + cmd.url;
			else if(cmd.type == "text")
				msg += "\nText: " + cmd.text.split("\n")[0].substr(0, 80);

			if(cmd.usage)
				msg += "\nUsage: " + cmd.usage;

			bot.send(msg);
	}
};
