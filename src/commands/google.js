var google = require("google");
google.resultsPerPage = 5;

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
		{
			bot.send("Syntax is !google [Search term]");
			return;
		}

		var result = [];

		var max = 3;
		for(var i = 0; i < links.length && i < max; i++) 
		{
			if(typeof links[i].href == 'undefined' || !links[i].href)
			{
				max++;
				continue;
			}
			result.push(links[i].title + " - " + links[i].href);
		}

		bot.send(result.join("\n"));
	});
};

module.exports = 
{
	g: googleCallback,
	google: googleCallback
};
