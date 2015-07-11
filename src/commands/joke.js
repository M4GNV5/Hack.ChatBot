var reddit = require("redwrap");

var jokes = [];
reddit.r("jokes", function(err, data, res)
{
	if(err)
		throw err;

	var posts = data.data.children;

	for(var i = 0; i < posts.length; i++)
	{
		if(posts[i].data.domain != "self.Jokes" || posts[i].data.selftext.split("\n").length > 10)
			continue;

		var text = posts[i].data.title + "\n" + posts[i].data.selftext + " - http://redd.it/" + posts[i].data.id;
		jokes.push(text);
	}
});

var joke = function(bot, sender, args)
{
	var selected = Math.round(Math.random() * (jokes.length - 1));

	bot.send(jokes[selected]);
};

module.exports = { joke: joke };