var ascii = require("figlet");

var createAsciiArt = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "ascii"))
		return;

	var text = args.join(" ");

	ascii(text, function(err, data)
	{
		if(err)
		{
			bot.send("Error creating ascii art :(");
			return;
		}

		bot.send(data);
	});
}

module.exports = {ascii: createAsciiArt};
