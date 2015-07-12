var Wiki = require("wikijs");
var wiki = new Wiki();

var wikiCallback = function(bot, sender, args)
{
	var mode = args[0];
	var input = args.slice(1).join(" ");

	if(mode == "search")
	{
		wiki.search(input).then(function(result)
		{
			var results = result.results;

			var msg = "Page results: " + results.slice(0, 5).join(", ");
			bot.send(msg);
		});
	}
	else if(mode == "page")
	{
		wiki.page(input).then(function(page)
		{
			page.summary().then(function(summary)
			{
				if(summary.length > 500)
				{
					summary = summary.substring(0, 500) + "...";
				}
				summary += " - " + page.fullurl;

				bot.send(summary);
			});
		});
	}
	else if(mode == "quick")
	{
		wiki.search(input).then(function(result)
		{
			var page = result.results[0];

			wikiCallback(bot, sender, ["page", page]);
		});
	}
	else
	{
		bot.send("Wiki usage: !wiki search|page|quick ...");
	}
};

module.exports = { wiki: wikiCallback };

