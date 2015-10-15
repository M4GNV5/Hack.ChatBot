var fs = require("fs");
var path = require("path");

var ChatConnection = require("./connection.js");
var config = require("./config.json");

fs.readdir("./src/commands", function(err, files)
{
	if(err) throw err;

	var bot = new ChatConnection(config.url, config.nick, config.channel);

	bot.commands = {};
	bot.init = [];

	for(var i = 0; i < files.length; i++)
	{
		if(path.extname(files[i]) == ".js")
		{
			var cmds = require("./commands/" + files[i]);

			if(typeof cmds != 'object')
				throw "Invalid command " + files[i];

			if(typeof cmds.init == 'function')
			{
				cmds.init(bot);
				bot.init.push(cmds.init);
				delete cmds.init;
			}

			for(var key in cmds)
			{
				if(typeof cmds[key] != 'function')
					throw "Invalid command " + files[i];

				bot.commands[key] = cmds[key];
			}
		}
	}

	bot.parseCmd = function(data)
	{
		console.log(data.nick + ": " + data.text);

		var lowerCaseNick = data.nick.toLowerCase();

		if(data.nick == config.nick)
			return;

		if(lowerCaseNick.substr(-3) == 'bot') // Don't reply to bots
			return;

		if(this.bans.indexOf(lowerCaseNick) !== -1)
			return;

		var msg = data.text;
		if(msg[0] == "!")
		{
			var args = msg.substr(1).split(" ");
			var cmd = args[0].toLowerCase();
			var args = args.slice(1);

			if(this.commands[cmd] instanceof Function && this.commands.hasOwnProperty(cmd))
				this.commands[cmd](this, data.nick, args, data);
		}
	}

	bot.on("chat", function(data)
	{
		bot.parseCmd(data);
	});

	bot.on("info", function (data)
	{
		console.log("INFO : " + data.text);
	});

	bot.on("warn", function (data) {
		console.log("WARN : " + data.text);
	});
});
