var awaitingPings = {};

var init = function(bot)
{
	bot.on("chat", function(data)
	{
		if(data.nick == bot.nick && typeof awaitingPings[data.text] != 'undefined')
		{
			var now = new Date().getTime();
			var diff = now - awaitingPings[data.text];

			bot.send("Current ping is " + diff + "ms");

			delete awaitingPings[data.text];
		}
	});
}

var ping = function(bot, sender, args)
{
	var msg = Math.random().toString(36).substring(3, 7);
	msg = "Testing ping (" + msg + ")";

	awaitingPings[msg] = new Date().getTime();

	bot.send(msg);
}

module.exports = { init:init, ping: ping };
