var Wiki = require("wikijs");
var wiki = new Wiki();

var wikiCallback = function(bot, sender, args)
{
	var input = args.join(" ");

	wiki.search(input).then(function(result)
	{
		var page = result.results[0];

		if(typeof page == 'undefined')
		{
			bot.send("No results found!");
			return;
		}

		wiki.page(page).then(function(page)
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
	});
};

module.exports = { wiki: wikiCallback };

