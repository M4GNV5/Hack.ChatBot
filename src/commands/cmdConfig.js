var fs = require("fs");
var path = require("path");

var init = function(bot)
{
	bot.config = {};

	fs.readdir("./src/data", function(err, files)
	{
		if(err)
			throw err;

		for(var i = 0; i < files.length; i++)
		{
			if(path.extname(files[i]) == ".json")
			{
				var data = require("./../data/" + files[i]);

				var name = path.basename("./../data/" + files[i], ".json")

				bot.config[name] = data;
			}
		}

		bot.emit("config");
	});
};

var configCmd = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "config"))
		return;

	args[0] = args[0] || "";

	if(args[0] == "set" && typeof args[1] != 'undefined' && typeof args[2] != 'undefined')
	{
		var name = args[1] || "undefined";
		console.log(args.slice(2).join(" "))
		var value = JSON.parse(args.slice(2).join(" ")) || "";

		var split = name.split(".");
		var obj = bot.config;

		for(var i = 0; i < split.length - 1; i++)
		{
			if(typeof obj[split[i]] == 'undefined')
			{
				bot.send("@" + sender + " " + split[i - 1] + " has no property " + split[i]);
				return;
			}

			obj = obj[split[i]];
		}
		obj[split[split.length - 1]] = value;
	}
	else if(args[0] == "get")
	{
		var split = (args[1] || "").split(".");
		var out = bot.config;
		for(var i = 0; i < split.length; i++)
		{
			if(typeof out[split[i]] == 'undefined')
			{
				bot.send("@" + sender + " could not read property " + split[i]);
				return;
			}
			else
			{
				out = out[split[i]];
			}
		}

		try
		{
			bot.send(JSON.stringify(out, undefined, 2));
		}
		catch(e)
		{
			bot.send("@" + sender + " error parsing json (maybe circular object?)");
		}
	}
	else if(args[0] == "save")
	{
		saveFiles(bot, sender);
	}
}

var lastFgtSave = 0;
var fgtSave = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "fgtSave"))
		return;

	var now = Date.now();
	if(now - lastFgtSave < 60 * 60 * 1000)
		bot.send("@" + sender + " You are a faggot. Try again in 1 hour");
	else
		saveFiles(bot, sender);

	lastFgtSave = now;
}

function saveFiles(bot, sender)
{
	bot.send("@" + sender + " Saving configs...");
	for(var key in bot.config)
	{
		if(!bot.config.hasOwnProperty(key))
			continue;

		fs.writeFile("./src/data/" + key + ".json", JSON.stringify(bot.config[key], undefined, 4), function(err)
		{
			if(err)
				throw err;
		});
	}
}

module.exports = { init: init, config: configCmd, fgtsave: fgtSave };
