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
				if(typeof cmds[key] == 'function')
					bot.commands[key] = cmds[key];
			}
		}
	}

	bot.parseCmd = function(data)
	{
		console.log(data.nick + ": " + data.text);

		if(data.nick == bot.nick)
			return;

		if(this.bans.indexOf(data.nick.toLowerCase()) !== -1)
			return;

		var msg = data.text;
		if(msg[0] == config.cmdPrefix)
		{
			var args = msg.substr(1).split(" ");
			var cmd = args[0].toLowerCase();
			var args = args.slice(1);

			if(typeof this.commands[cmd] == 'function' && this.commands.hasOwnProperty(cmd))
				this.commands[cmd](this, data.nick, args, data);
		}
	}

	bot.on("chat", function(data)
	{
		try
		{
			bot.parseCmd(data);
		}
		catch(e)
		{
			console.error(e);
		}
	});

	bot.on("info", function (data)
	{
		console.log("INFO : " + data.text);
	});

	bot.on("warn", function (data) {
		if(data.text == "Nickname taken")
		{
			var nick = Math.random().toString(36).substring(3, 7) + "_" + config.nick;
			bot.nick = nick.split("#")[0];
			bot.ws.send(JSON.stringify({cmd: "join", nick: nick, channel: config.channel}));
		}

		console.log("WARN : " + data.text);
	});
});
