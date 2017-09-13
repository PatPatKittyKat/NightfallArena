var express = require('express');
var app     = express();
var serv    = require('http').Server(app);
var io      = require('socket.io')(serv,{});

var	port = 10025;

app.get('/',function(req,res) {
   res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

function init() {
	console.log("Game_Server started!");
	
	// Server listening on port specificed in game variables
	serv.listen(port);
	console.log("Game_Server listening on port: " + port);
};

init();