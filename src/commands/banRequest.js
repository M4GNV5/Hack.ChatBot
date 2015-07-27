var requests = {};

var banRequest = function(bot, sender, args)
{
    if(typeof bot.config.tripCodes[sender] == 'undefined')
    {
        bot.send("@" + sender + " you must be a verified user (!verify) to use !ban");
        return;
    }

    if(args.join("").trim() == "" || args.length > 2 || args[0] == "help")
    {
        bot.send("@" + sender + " usage: !ban list, !ban <yes|no|maybe> <name>, !ban <name>");
    }
    else if(args[0] == "list")
    {
        bot.send("Current ban requests: " + Object.keys(requests).join(", "));
    }
    else if(args[0] == "remove")
    {
        if(bot.requirePerm(sender, "banRequestManage"))
            return;

        if(typeof requests[args[1]] == "object")
        {
            delete requests[args[1]];
            bot.send("@" + sender + " removed ban request for @" + args[1]);
        }
        else
        {
            bot.send("@" + sender + " there is no ban request for @" + args[1]);
        }
    }
    else if(args.length == 1)
    {
        var yes = [];
        var no = [];
        var maybe = [];

        if(typeof requests[args[0]] == "object")
        {
            for(var name in requests[args[0]])
            {
                var vote = requests[args[0]][name];
                if(vote == "yes")
                    yes.push(name);
                else if(vote == "no")
                    no.push(name);
                else
                    maybe.push(name);
            }
        }

        var message = "Current ban status for @" + args[0];
        message += "\nYes: " + yes.length + " " + yes.join(", ");
        message += "\nNo: " + no.length + " " + no.join(", ");
        message += "\nMaybe: " + maybe.length + " " + maybe.join(", ");
        bot.send(message);
    }
    else if(args.length == 2)
    {
        var name = args[1];
        if(name[0] == "@")
            name = name.substr(1);

        requests[name] = requests[name] || {};
        var vote = args[0];
        vote = args[0] == "yes" || args[0] == "no" ? args[0] : "maybe";
        requests[name][sender] = vote;


        bot.send("@" + sender + " voted " + vote + " for banning " + name);
    }
};

module.exports = { ban: banRequest };
