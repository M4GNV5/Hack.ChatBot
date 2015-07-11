var timeZones = require("./timezones.json");
var sortedZones = {};

for(var i = 0; i < timeZones.length; i++)
{
	var zone = timeZones[i];

	if(typeof sortedZones[zone.abbr] == 'undefined')
		sortedZones[zone.abbr] = zone;
}

var time = function(send, args)
{
	console.log(args[0]);
	if(typeof sortedZones[args[0]] != 'undefined')
	{
		var zone = sortedZones[args[0]];
		var diff = zone.offset * 60 * 60 * 1000;
		var current = new Date();
		var offset = current.getTimezoneOffset() * 60 * 1000;

		var there = new Date(current.getTime() + offset + diff);

		send(there.toLocaleTimeString() + " - " + zone.value);
	}
	else
	{
		send("Unknown time zone");
	}
}

module.exports =
{
	time: time
};
