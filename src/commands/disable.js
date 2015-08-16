var disabled = false;
var oldParseCmd;
var ignored = 0;

exports.disable = function(bot, sender, args)
{
    if(bot.requirePerm(sender, "disable"))
		return;

    oldParseCmd = bot.parseCmd;
    bot.parseCmd = function(data)
    {
        if(data.text.split(" ")[0] == "!enable")
        {
            oldParseCmd.call(bot, data);
        }
		else if(data.text[0] == "!")
        {
            ignored++;
        }
    }
}

exports.enable = function(bot, sender, args)
{
    if(bot.requirePerm(sender, "disable", true))
		return;

    if(typeof oldParseCmd != 'undefined')
    {

    }

    bot.send("@" + sender + " ignored " + ignored + " commands");
    bot.parseCmd = oldParseCmd;
    oldParseCmd = undefined;
    ignored = 0;
}
