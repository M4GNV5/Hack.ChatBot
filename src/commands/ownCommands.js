var request = require("request");
var runCode = require("../jsvm.js");

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

			if(text.split("\n").length > 5)
				text = text.substring(0, text.indexOf("\n")).substr(0, 497) + "...";
			else if(text.length > 500)
				text = text.substr(0, 497) + "...";

			if(!/%[0-9]+%/g.test(text))
			{
				bot.send(text);
				return;
			}
		}
		else if(cmd.type == "js")
		{
			var ctx = cmd.context || {};
			ctx.command = cmd.name;
			ctx.sender = sender;
			ctx.channel = bot.channel;
			ctx.nick = bot.nick;
			ctx.args = args;

			runCode(cmd.text, ctx, function(err, out, ctx)
			{
				if(err && !out)
					return bot.send("@" + sender + " " + err);

				if(out.split("\n").length > 5)
					out = out.substring(0, out.indexOf("\n")).substr(0, 497) + "...";
				else if(out.length > 500)
					out = out.substr(0, 497) + "...";

				if(cmd.usage && err)
				{
						bot.send("@" + sender + " " + cmd.usage);
				}
				else if(JSON.stringify(ctx).length < 10 * 1024 * 1024)
				{
					cmd.context = ctx;
					bot.send("@" + sender + " " + out);
				}
				else
				{
					bot.send("@" + sender + " context of !" + cmd.name + " is too big");
				}
			});
			return;
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
		return bot.send("@" + sender + " Usage: !command set-text|set-js|set-pastebin|delete|usage|info <cmd> <text ...>");

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
	function setCommand(type, text)
	{
		if(!cmd)
		{
			cmd = bot.config.ownCommands[name] = {
				name: name,
				type: type,
				author: {trip: data.trip, nick: sender},
				text: text,
				created: Date.now(),
				edited: Date.now()
			};

			bot.commands[name] = createCommand(cmd);
		}
		else
		{
			cmd.type = type;
			cmd.text = text;
			cmd.edited = Date.now();
		}
	}
	function checkUserPerm(isCreate)
	{
		var config = bot.config.command;

		if(!cmd && bot.commands[name])
			bot.send("@" + sender + " that is a builtin command");
		else if(!cmd && !isCreate)
			bot.send("@" + sender + " no such command exists");
		else if(!/^\w+$/.test(name))
			bot.send("@" + sender + " Commands shall not have special characters");
		else if(isCreate && text.trim() == "")
			bot.send("@" + sender + " command cannot be empty");
		else if(isCreate && name.length > 16)
			bot.send("@" + sender + " command names cannot be longer than 16 characters");
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

			setCommand("text", text);
			bot.send("@" + sender + " set command " + name);
			break;

		case "set-js":
			if(bot.requirePerm(sender, "command-js") || !checkUserPerm(true))
				return;

			setCommand("js", text);
			bot.send("@" + sender + " set command " + name);
			break;


		case "set-pastebin":
			if(bot.requirePerm(sender, "command-js") || !checkUserPerm(true))
				return;

			request("http://pastebin.com/raw.php?i=" + text, function(err, res, code)
			{
				if(err || !code || res.code != 200)
				{
					bot.send("@" + sender + " " + (err || "Invalid pastebin").toString());
				}
				else
				{
					setCommand("js", code);
					bot.send("@" + sender + " set command " + name);
				}
			});
			break;


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

			bot.send("@" + sender + " set command usage");
			break;


		case "list":
			if(args[1] == "*")
			{
				var users = {};
				for(var key in bot.config.ownCommands)
				{
					var nick = bot.config.ownCommands[key].author.nick;
					users[nick] = users[nick] || 0;
					users[nick]++;
				}

				var msg = [];
				for(var key in users)
					msg.push(key + "(" + users[key] + ")");

				bot.send("@" + sender + " Users that created commands, syntax is nick(amount):\n" + msg.join(", "));
			}
			else
			{
				var list = commandsBy(args[1]);
				for(var i = 0; i < list.length; i++)
					list[i] = "!" + list[i].name;

				if(list.length == 0)
					list.push("-");

				bot.send("@" + sender + " Commands by " + args[1] + ": " + list.join(", "));
			}
			break;


		case "info":
			if(!checkUserPerm())
				return;

			var msg = "Info for command !" + name +
				"\nAuthor: [" + cmd.author.trip + "] " + cmd.author.nick +
				"\nType: " + cmd.type;

			if(cmd.usage)
				msg += "\nUsage: " + cmd.usage;

			bot.send(msg);
			break;
	}
};
