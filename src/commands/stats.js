exports.init = function(bot)
{
    bot.on("info", function(data)
    {
        var split = data.text.split(" ");
        if(split[1] != "unique" || split[2] != "IPs" || split[3] != "in" || split[5] != "channels")
            return;

        bot.send(data.text);
    });
}

exports.stats = function(bot, sender, args)
{
    bot.ws.send(JSON.stringify({cmd: "stats"}));
}
