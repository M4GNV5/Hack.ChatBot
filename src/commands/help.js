var help = function(send, args)
{
	send("Chat.hack bot by M4GNV5. Commands:\n" +
		"!g, !google - returns first 3 google results\n" +
		"!time <timezone> - gives to current time in specified timezone\n" + 
		"!h, !help - show this help");
}

module.exports =
{
	h: help,
	help: help
};