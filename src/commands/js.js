if(require.main === module)
{
	var vm = require("vm");

	var _out = [];
	var out = function(s)
	{
		_out.push(s);
	}
	var context = {out: out};
	vm.createContext(context);

	process.on("message", function(message)
	{
		try
		{
			context.sender = message.sender;
			context.channel = message.channel;
			context.self = message.self;

			var result = vm.runInContext(message.code, context);
			if(_out.length > 0)
				process.send({out: _out.join(" ")});
			else
				process.send({out: (result || "undefined").toString()});
		}
		catch(e)
		{
			process.send({out: e.toString()});
		}
	});
}
else
{
	var childP = require("child_process");
	var childPs = {};

	var jsCommand = function(bot, sender, args)
	{
		if(typeof childPs[sender] != 'undefined')
		{
			bot.send("@" + sender + " only one !js command every 3 seconds");
			return;
		}

		var code = args.join(" ");
		var pFinished = false;

		var p = childP.fork("./src/commands/js.js");
		childPs[sender] = p;
		p.on("message", function(message)
		{
			if(message.out.length < 200)
				bot.send("@" + sender + " Output: " + message.out);
			else
				bot.send("@" + sender + " Output too long! Not showing anything");

			pFinished = true;
		});
		p.send({sender: sender, channel: bot.channel, self: bot.nick, code: code});

		setTimeout(function()
		{
			p.kill();
			delete childPs[sender];
			if(!pFinished)
				bot.send("@" + sender + " terminated! Execution took too long");
		}, 3000);
	}

	module.exports = {js: jsCommand};
}
