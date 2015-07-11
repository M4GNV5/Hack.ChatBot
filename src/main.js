var fs = require("fs");
var path = require("path");

var WebSocket = require("ws");
var config = require("./config.json");

fs.readdir("./src/commands", function(err, files)
{
	if(err)
		throw err;

	var commands = {};
	for(var i = 0; i < files.length; i++)
	{
		if(path.extname(files[i]) == ".js")
		{
			var cmds = require("./commands/" + files[i]);

			if(typeof cmds != 'object')
				throw "Invalid command " + files[i];

			for(var key in cmds)
			{
				if(typeof cmds[key] != 'function')
					throw "Invalid command " + files[i];

				commands[key] = cmds[key];
			}
		}
	}

	var ws = new WebSocket(config.url);

	var bot = {};
	bot.commands = commands;
	bot.send = function(text)
	{
		var msgData = JSON.stringify({cmd: "chat", text: text});
		ws.send(msgData);
	};
	bot.socket = ws;
	bot.bans = [];
	bot.permLevel = {};

	ws.on("open", function()
	{
		console.log("connected");
		var joinData = {cmd: "join", nick: config.nick, channel: config.channel};
		ws.send(JSON.stringify(joinData));
	});

	ws.on("message", function(data, flags)
	{
		var _data = JSON.parse(data);

		if(_data.cmd == "chat")
		{
			console.log(_data.nick + ": " + _data.text);

			if(bot.bans.indexOf(_data.nick) !== -1)
				return;

			var msg = _data.text;
			if(msg[0] == "!")
			{
				var cmd = msg.substr(1).split(" ")[0];
				var args = msg.substr(2 + cmd.length).split(" ");
				
				if(typeof commands[cmd] == 'function' && commands.hasOwnProperty(cmd))
					commands[cmd](bot, _data.nick, args);
				else
					bot.send("Unknown Command: " + cmd);
			}
		}
	});

	ws.on("close", function()
	{
		console.log("disconnected");
		process.exit(0);
	});
});
