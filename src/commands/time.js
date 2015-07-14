var time = function(bot, sender, args)
{
	console.log(args[0]);
	if(typeof bot.config.timezones[args[0]] != 'undefined')
	{
		var zone = bot.config.timezones[args[0]];
		var diff = zone[1] * 60 * 60 * 1000;
		var current = new Date();
		var offset = current.getTimezoneOffset() * 60 * 1000;

		var there = new Date(current.getTime() + offset + diff);

		bot.send(there.toLocaleTimeString() + " - " + zone[0]);
	}
	else
	{
		bot.send("Unknown time zone, try !timezones");
	}
}

module.exports =
{
	time: time
};
