var math = require("mathjs");

var mathCommand = function(bot, sender, args)
{
	try
	{
		var arg = args.join(" ");
		var result = math.eval(arg);

		if(typeof result == 'function')
		{
			bot.send("Cannot output function. Try " + arg + "; " + result.name + "(...)");
			return;
		}

		bot.send("Result: " + result.toString());
	}
	catch(e)
	{
		bot.send(e.toString());
	}
};

module.exports = {math: mathCommand};
