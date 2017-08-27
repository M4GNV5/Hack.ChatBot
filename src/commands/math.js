if(require.main === module)
{
	var math = require("mathjs");

	process.on("message", function(message)
	{
		try
		{
			var result = math.eval(message.expression);

			if(typeof result == 'function')
			{
				process.send({
					error: true,
					result: "Cannot output function. Try " + message.expression + "; " + result.name + "(...)"
				});
			}
			else
			{
				process.send({
					error: false,
					result: result.toString()
				});
			}
		}
		catch(e)
		{
			process.send({
				error: true,
				result: e.toString()
			});
		}
	});
}
else
{
	var childP = require("child_process");

	exports.math = function(bot, sender, args)
	{
		var p = childP.fork(__filename);
		var timer = setTimeout(function()
		{
			p.kill();
			bot.send("@" + sender + " terminated! Execution took too long");
		}, 3000);

		p.on("message", function(message)
		{
			clearTimeout(timer);
			bot.send("@" + sender + " " + message.result);
		});
		p.send({expression: args.join(" ")});
	};
}
