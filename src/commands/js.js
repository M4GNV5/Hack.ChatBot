if(require.main === module)
{
	var vm = require("vm");

	process.on("message", function(message)
	{
		try
		{
			var context = message.context || {};
			context = vm.createContext(context);

			var _out = [];
			var out = function(s)
			{
				_out.push(s);
			};
			context.out = out;

			for(var name in message.args)
			{
				context[name] = message.args[name];
			}

			var result = vm.runInContext(message.code, context);
			if(_out.length > 0)
				process.send({out: _out.join(" "), context: context});
			else
				process.send({out: (result || "undefined").toString(), context: context});
		}
		catch(e)
		{
			process.send({out: (e.message || "unknown error")});
		}
	});
}
else
{
	var childP = require("child_process");
	var request = require("request");
	var pastebin = require("pastebin");
	var childPs = {};
	var userContexts = {};

	var init = function(bot)
	{
		bot.on("onlineRemove", function(data)
		{
			if(typeof userContexts[data.nick] == 'object')
				delete userContexts[data.nick];
		});
	}

	var jsCommand = function(bot, sender, args)
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
				if(err)
				{
					bot.send("@" + sender + " " + err.toString());
					return;
				}

				runCode(code, args.slice(2));
			});
		}
		else
		{
			runCode(args.join(" "));
		}

		function runCode(code, args)
		{
			var _args = {};
			_args.sender = sender;
			_args.channel = bot.channel;
			_args.self = bot.nick;
			_args.args = args;



			var pFinished = false;

			var p = childP.fork("./src/commands/js.js");
			childPs[sender] = p;
			p.on("message", function(message)
			{
				if(message.out.length < 500 && message.out.split("\n").length < 5)
				{
					bot.send("@" + sender + " Output: " + message.out);
				}
				else if(typeof bot.config.js.devKey == 'string' && bot.config.js.devKey.trim() != "")
				{
					var postName = sender + "'s !js output";
					var expire = bot.config.js.expire || "N";
					var _pastebin = pastebin(bot.config.js.devKey);
					_pastebin.new({title: postName, content: message.out, expire: expire}, function (err, ret)
					{
						if(err)
							bot.send("@" + sender + " Error: " + err.toString());
						else
							bot.send("@" + sender + " Output: " + ret);
					});
				}
				else
				{
					bot.send("@" + sender + " Output too long! Not showing anything");
				}

				userContexts[sender] = message.context;

				pFinished = true;
			});
			p.send({args: _args, code: code, context: userContexts[sender]});

			setTimeout(function()
			{
				p.kill();
				delete childPs[sender];
				if(!pFinished)
					bot.send("@" + sender + " terminated! Execution took too long");
			}, 3000);
		}
	}

	module.exports = {js: jsCommand, init: init};
}
