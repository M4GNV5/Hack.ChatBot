var WebSocket = require("ws");
var ws = false;

exports.ptrs = function(bot, sender, args)
{
	if(ws)
		return bot.send("@" + sender + " only one command every 3 seconds");
	else if(bot.requirePerm(sender, "ptrs"))
		return;


	var out = [];
	var ws = new WebSocket("ws://localhost:8004");

	ws.on("open", function()
	{
		ws.send(args.join(" "));
	});
	ws.on("message", function(msg)
	{
		if(msg == "running")
		{
			//ignore
		}
		else if(msg == "ready")
		{
			ws.close();
			ws = false;

			out = out.join("\n");
			if(out.split("\n").length > 5)
				out = out.split("\n").slice(0, 5).join("\n").substr(0, 497) + "...";
			else if(out.length > 500)
				out = out.substr(0, 497) + "...";

			bot.send("@" + sender + " " + out);
		}
		else
		{
			out.push(msg);
		}
	});
	ws.on("error", function(msg)
	{
		bot.send("@" + sender + " " + msg);
	});

	setTimeout(function()
	{
		if(ws)
		{
			ws.close();
			ws = false;
		}
	}, 3000);
}
