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

	bot.parseCmd = function(data)
	{
		console.log(data.nick + ": " + data.text);

		if(data.nick == config.nick)
			return;

		var msg = data.text;
		if(msg[0] == "!")
		{
            if(this.bans.indexOf(data.nick.toLowerCase()) !== -1)
                this.send("@" + data.nick + " you are banned from using this bot.");
            else
            {
			 var cmd = msg.substr(1).split(" ")[0];
			 var args = msg.substr(2 + cmd.length).split(" ");
    
    			if(typeof this.commands[cmd] == 'function' && this.commands.hasOwnProperty(cmd))
    				this.commands[cmd](this, data.nick, args, data);
    			else
    				this.send("Unknown Command: " + cmd);
            }
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
