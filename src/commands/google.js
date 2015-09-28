var google = require('googleapis');
var customsearch = google.customsearch('v1');

var googleCallback = function(bot, sender, args)
{
	var search = args.join(" ").trim();

	if(search == "")
		return bot.send("Syntax is !google [Search term]");

	var apikey = bot.config.google.apiKey;
	var cx = bot.config.google.customsearchId;

	customsearch.cse.list({ cx: cx, q: search, auth: apikey }, function(err, resp)
	{
		if (err)
			return bot.send(err.toString());

		require("fs").writeFileSync("dump.json", JSON.stringify(resp, undefined, 4));
		if (resp.items && resp.items.length > 0)
		{
			var result = [];

			for(var i = 0; i < resp.items.length && i < 3; i++)
			{
				result.push(resp.items[i].title + " - " + resp.items[i].link);
			}

			bot.send(result.join("\n"));
		}
		else
		{
			bot.send("No reults found! Syntax is !google [Search term]");
		}
	});
};

module.exports =
{
	g: googleCallback,
	google: googleCallback
};
