(function dbx() {
	console.log("============================================================");
	console.log("======Step 1: Create an application and dbox object=========");

	var open = require("open");
	var dbox = require("dbox");
	var app = dbox.app({
		"app_key": "zvo0dxkzxz9vu5d",
		"app_secret": "xwwirfqfa9yj1hi"
	});
	console.log(dbox);
	console.log(app);

	console.log("============================================================");
	console.log("======Step 2:Authorization->Get request token===============");

	app.requesttoken(function(status, request_token) {
		console.log(request_token);
		var auth_url = request_token['authorize_url'];
		console.log("============================================================");
		console.log("============Step 3:User authenticate your app===============");
		var browser = open(auth_url);
		setTimeout(function() {
			console.log("*****success authenticate*****");
			console.log("============================================================");
			console.log("==========Step 4:Authorization->Get access token============");
			app.accesstoken(request_token, function(status, access_token) {
				console.log(access_token);
				var client = app.client(access_token);
				//console.log(client);
				client.account(function(status, reply) {
					console.log(reply)
				});
			});
		}, 10000)
		// timeout of access token
	});


})();