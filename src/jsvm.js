if(require.main === module)
{
	var vm = require("vm");

	process.on("message", function(message)
	{
		var context = message.context || {};
		context = vm.createContext(context);

		try
		{
			var out = [];
			context.out = function(text)
			{
				out.push(text);
			};

			var result = vm.runInContext(message.code, context);
			if(out.length > 0)
				out = out.join(" ");
			else
				out = (typeof result == "undefined" ? "undefined" : result).toString();

			process.send({error: false, out: out, context: context});
		}
		catch(err)
		{
			process.send({error: err, out: err.toString(), context: context});
		}
	});
}
else
{
	var childP = require("child_process");

	module.exports = function(code, context, cb, timeout)
	{
		timeout = timeout || 3000;
		var pFinished = false;

		var p = childP.fork(__filename);
		p.on("message", function(message)
		{
			pFinished = true;
			cb(message.error, message.out, message.context);
		});
		p.send({code: code, context: context});

		setTimeout(function()
		{
			p.kill();
			if(!pFinished)
				cb("terminated! Execution took too long", undefined, context);
		}, timeout);
	};
}
