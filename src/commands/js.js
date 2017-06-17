var request = require("request");
var runCode = require("../jsvm.js");
var childPs = {};
var userContexts = {};

exports.init = function(bot)
{
	bot.on("onlineRemove", function(data)
	{
		if(typeof userContexts[data.nick] == 'object')
			delete userContexts[data.nick];
	});
};

exports.js = function(bot, sender, args)
{
	if(typeof childPs[sender] != 'undefined')
	{
		bot.send("@" + sender + " only one !js command every 3 seconds");
		return;
	}

	if(args[0] == "clear")
	{
		if(typeof userContexts[sender] != 'undefined')
			delete userContexts[sender];

		bot.send("@" + sender + " cleared context");
	}
	else if(args.length == 0 || args.join("").trim() == "" || args[0] == "help")
	{
		bot.send("Usage: !js <code>, !js pastebin <id>, !js clear, !js help");
	}
	else if(args[0] == "pastebin")
	{
		var id = args[1];
		request("http://pastebin.com/raw.php?i=" + id, function(err, res, code)
		{
			if(err || !code || res.code != 200)
			{
				bot.send("@" + sender + " " + (err || "Invalid pastebin").toString());
				return;
			}

			runWithContext(code, args.slice(2));
		});
	}
	else
	{
		runWithContext(args.join(" "), []);
	}

	function runWithContext(code, args)
	{
		var ctx = userContexts[sender] || {};
		ctx.sender = sender;
		ctx.channel = bot.channel;
		ctx.nick = bot.nick;
		ctx.args = args;

		runCode(code, ctx, function(err, out, ctx)
		{
			if(err && !out)
				return bot.send("@" + sender + " " + err);

			if(out.split("\n").length > 5)
				out = out.substring(0, out.indexOf("\n")).substr(0, 497) + "...";
			else if(out.length > 500)
				out = out.substr(0, 497) + "...";

			if(JSON.stringify(ctx).length < 10 * 1024 * 1024)
			{
				userContexts[sender] = ctx;
				bot.send("@" + sender + " Output: " + out);
			}
			else
			{
				bot.send("@" + sender + " your context is too large, please use !js clear");
			}
		});
	}
};
