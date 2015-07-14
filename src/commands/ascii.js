var ascii = require("figlet");

var createAsciiArt = function(bot, sender, args)
{
	if(typeof bot.permLevel[sender] == 'undefined' || bot.permLevel[sender] < 1)
	{
		bot.send("@" + sender + " you dont have the permission to use this command");
		return;
	}

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
