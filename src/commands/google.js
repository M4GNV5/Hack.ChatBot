var google = require("google");
google.resultsPerPage = 3;

var googleCallback = function(bot, sender, args)
{
	var search = args.join(" ");

	google(search, function(err, next, links)
	{
		if(err)
		{
			bot.send("Error processing google search: " + err);
			return;
		}

		if(links.length == 0)
			bot.send("No results found!");

		for(var i = 0; i < links.length; i++)
		{
			bot.send(links[i].title + " - " + links[i].href);
		}
	});
};

module.exports =
{
	g: googleCallback,
	google: googleCallback
};
