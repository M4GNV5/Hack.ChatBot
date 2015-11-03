var request = require("request");

exports.urban = function(bot, sender, args)
{
    if(args.join(" ").trim() == "")
    {
        bot.send("Usage: !urban <term>");
        return;
    }

    var term = encodeURIComponent(args.join(" "));

    request("http://api.urbandictionary.com/v0/define?term=" + term, function(err, res, body)
    {
        if(err)
    	{
            bot.send("@" + sender + " " + err.toString());
            return;
        }

        var data = JSON.parse(body);
        if(!data.list || data.list.length < 1)
        {
            bot.send("@" + sender + " no results found");
            return;
        }

        var defintion = data.list[0].definition.substr(0, 500);
        bot.send("@" + sender + " " + defintion + " - " + data.list[0].permalink);
    });
};
