var request = require("request");

exports.reddit = function(bot, sender, args, data)
{
    if(sender == bot.nick)
        return;

    var r = args[0] || "";
    request("http://reddit.com/r/" + r + "/.json", function(err, res, data)
    {
        if(err)
    	{
            bot.send("@" + sender + " " + err.toString());
            return;
        }

        var data = JSON.parse(data);
        var posts = data.data.children;
        var out = [];

        for(var i = 0; i < posts.length && i < 3; i++)
        {
            out.push(posts[i].data.title + " - http://redd.it/" + posts[i].data.id);
        }

        bot.send(out.join("\n"));
    });
}
