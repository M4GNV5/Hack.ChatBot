var request = require("request");

exports.reddit = function(bot, sender, args, data)
{
    if(sender == bot.nick)
        return;

    var r = args[0] || "";

    if (r.trim() == "")
    {
        bot.send("Usage: !reddit <subreddit>");
        return;
    }

    request("http://reddit.com/r/" + r + "/.json", function(err, res, data)
    {
        if(err)
    	{
            bot.send("@" + sender + " " + err.toString());
            return;
        }

        var data = JSON.parse(data);
        if(typeof data.data == 'undefined' || typeof data.data.children == 'undefined')
        {
            bot.send("Error retrieving data! Usage: !reddit <subreddit>");
            return;
        }

        var posts = data.data.children;
        var out = [];

        for(var i = 0; i < posts.length && i < 3; i++)
        {
            out.push(posts[i].data.title + " - http://redd.it/" + posts[i].data.id);
        }

        bot.send(out.join("\n"));
    });
}
