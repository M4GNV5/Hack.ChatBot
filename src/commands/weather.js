var weather = require("weather-js");

var weatherCommand = function(bot, sender, args)
{
	var degree = args[0] || "C";
	var location = args.slice(1).join(" ");

	weather.find({search: location, degreeType: degree}, function(err, result)
	{
		if(err)
		{
			bot.send("Error retrieving weather. Usage: !weather <degreeType> <location ...>");
			return;
		}

		result = result[0];
		var degree = "°" + result.location.degreetype;

		var message = "Showing weather for " + result.location.name + "\n" +
			"Current: " + result.current.temperature + degree + " - " + result.current.skytext + "\n";

		for(var i = 0; i < 3 && i < result.forecast.length; i++)
		{
			var data = result.forecast[i];
			message += data.day + ": " + data.low + degree + " to " + data.high + degree + " - " + data.skytextday + "\n";
		}

		bot.send(message);
	});
};

module.exports = {weather: weatherCommand};
