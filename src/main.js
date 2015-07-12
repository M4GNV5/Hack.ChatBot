var fs = require("fs");
var path = require("path");

var ChatConnection = require("./connection.js");
var config = require("./config.json");

fs.readdir("./src/commands", function(err, files)
{
	if(err)
		throw err;

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

	bot.on("chat", function(data)
	{
		console.log(bot.channel + " | " + data.nick + ": " + data.text);

		if(bot.bans.indexOf(data.nick) !== -1)
			return;

		var msg = data.text;
		if(msg[0] == "!")
		{
			var cmd = msg.substr(1).split(" ")[0];
			var args = msg.substr(2 + cmd.length).split(" ");
			
			if(typeof bot.commands[cmd] == 'function' && bot.commands.hasOwnProperty(cmd))
				bot.commands[cmd](bot, data.nick, args);
			else
				bot.send("Unknown Command: " + cmd);
		}
	});

	bot.on("info", function(data)
	{
		console.log(bot.channel + " | INFO : " + data.text);
	});

	bot.on("warn", function(data)
	{
		console.log(bot.channel + " | WARN : " + data.text);
	});
});
