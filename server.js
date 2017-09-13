/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/

var express = require('express');
var app     = express();
var serv    = require('http').Server(app);
var io      = require('socket.io')(serv,{});
var Game    = require("./server/Game").Game;			// Game Class
var Player  = require("./server/Player").Player;		// Player class

app.get('/',function(req,res) {
   res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));


/**************************************************
** GAME VARIABLES
**************************************************/
var	port = 10009;		// Server listening port
var games = new Map();	// Map of active games (gameID,Game Object)
var	players = [];		// Array of connected players
var gameIDs = 0;		// Counter to create new game ID's
var pCount = 0;
var pStartHealth = 10;

// Arrays of powerup coordinates
var powerupLoc0 = [{x:1100, y:200}, {x:100, y:200}, {x:900, y:200},{x:700, y:400},{x:1000, y:200},{x:900, y:240},{x:300, y:400}];
var powerupLoc1 = [{x:591, y:412}, {x:409, y:279}, {x:565, y:223}, {x:900, y:110}, {x:1196, y:102}, {x:168, y:377}, {x:819, y:287}];
var powerupLoc2 = [{x:28, y:530}, {x:774, y:473}, {x:565, y:223}, {x:824, y:371}, {x:282, y:313}, {x:577, y:126}, {x:535, y:364}];
var powerupLoc3 = [{x:300, y:400}, {x:900, y:240}, {x:1000, y:200}, {x:700, y:400}, {x:900, y:200}, {x:100, y:200}, {x:1100, y:200}];

var p1vID, p2vID;


/**************************************************
** GAME INITIALIZATION
**************************************************/
function init() {
	console.log("Game_Server started!");
	
	// Server listening on port specificed in game variables
	serv.listen(port);
	console.log("Game_Server listening on port: " + port);

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	io.sockets.on('connection', onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	console.log("New player has connected: " + client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for find game message - Expecting only mapID and vehicleID
	client.on("find game", onFindGame);

	// Listen for move player message
	client.on("move player", onMovePlayer);
	
	// Listen for bullet move message
	client.on("bullet move", onBulletMove);
	
	// Listen for player health message
	client.on("player health", onPlayerHealth);
	
	// Listen for Power-up Health removed message received
	client.on('remove healthItem', onRemoveHealthItem);
	
	// Listen for Power-up Speed-up removed message received
	client.on('remove shieldItem', onRemoveShieldItem);
	
	// Listen for Power-up Shield removed message received
	client.on('remove speedupItem', onRemoveSpeedupItem);
	
	// Listen for Add Heart to Player 2's health message received
	client.on('add 1toHealth', onAddHeartHealth);

};


// Socket client has disconnected
function onClientDisconnect() {
	console.log("Player has disconnected: " + this.pID);

	var removePlayer = playerById(this.pID);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: " + this.pID);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.pID});
};

// Find Game for New Player to join
function onFindGame(data) {
	
	//TODO: Figure out how to use multiple maps and based on that determine position

	// Broadcast new player to connected socket clients
	//TODO: Need to change to iterate through map and look for non full games
	
	// No players in a game
	if (pCount%2 == 0) {
		// Create a new player
		++pCount;
		var p1 = new Player(gameIDs, this.id, data.vID, pStartHealth, 500, 500);
		p1vID = p1.getVehicleID();
		var newGame = new Game();
		p1.setX(50);
		p1.setY(110);
		newGame.setMapID(data.mID);
		newGame.AddPlayer(p1);
		games[gameIDs] = newGame;
		console.log("YOUR player: (" + p1.getX() + ", " + p1.getY() + ")" + " - " + p1.getVehicleID());
		// Send to only sender client only
		this.emit("your player", {pID: this.id, x: p1.getX(), y: p1.getY(), vID: data.vID});
	}
	// One Player in existing game
	else {
		p2vID = data.vID;
		console.log("In else - " + data.vID);
		var p2 = new Player(gameIDs, this.id, data.vID, pStartHealth, 500, 500);
		var game = games[gameIDs];
		var p1 = game.getP1();
		p2.setX(1180);
		p2.setY(500);
		game.AddPlayer(p2);
		
		// Randomly choose number for powerup locations array
		var powerupArrayNum = (Math.floor((Math.random() * 40)+ 1))%4;
		console.log("Random#: " + powerupArrayNum);
		var sendPowerupLoc;
		if (powerupArrayNum == 0) {
			sendPowerupLoc = powerupLoc0;
		}
		else if (powerupArrayNum == 1) {
			sendPowerupLoc = powerupLoc1;
		}
		else if (powerupArrayNum == 2){
			sendPowerupLoc = powerupLoc2;
		}
		else {
			sendPowerupLoc = powerupLoc3;
		}
		
		console.log("your player: (" + p2.getX() + ", " + p2.getY() + ")");
		// Send P2 coord to P2
		this.emit("your player", {pID: this.id, x: p2.getX(), y: p2.getY(), vID: data.vID});
		
		console.log("player1: " + p1.getPlayerID() + game.getMapID() + p1.getVehicleID() + p1.getX() + p1.getY());
		// Send P1 coord to P2
		this.emit("new player", {pID: p1.getPlayerID(), mID: game.getMapID(), vID: p1vID, x: p1.getX(), y: p1.getY(), pArray: sendPowerupLoc});
		
		// Send P2 coord to P1
		this.broadcast.emit("new player", {pID: p2.getPlayerID(), mID: game.getMapID(), vID: p2vID, x: p2.getX(), y: p2.getY(), pArray: sendPowerupLoc});
		gameIDs++;
		++pCount;
	}
};

// Player has moved
function onMovePlayer(data) {
	var movePlayer;
	//console.log("\nGame Length: " + gameIDs);
	for (var i = 0; i < gameIDs; i++) {
		var game = games[i];
		//console.log("i: " + i);
		//console.log("dataID: " + data.pID);
		var findPlayer = game.findPlayerID(data.pID);
		//console.log("Game[" + i + "]: " + findPlayer.getPlayerID());
		if (findPlayer != 1) {
			movePlayer = findPlayer;
			//console.log("in if");
		}
	}
	//var game = games[gameIDs];
	//movePlayer = game.findPlayerID(data.pID);
	
	console.log( movePlayer.getPlayerID() + " player: (" + movePlayer.getX() + ", " + movePlayer.getY() + ")");
	// Find player in array
	//var movePlayer = playerById(this.pID);

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {pID: movePlayer.pID, x: movePlayer.getX(), y: movePlayer.getY()});
};

// Player has shot bullet
function onBulletMove(data) {
	console.log("In bullet move");
	
	var playerShooting;
	for (var i = 0; i < gameIDs; i++) {
		var game = games[i];
		var findPlayer = game.findPlayerID(data.pID);
		if (findPlayer != 1) {
			playerShooting = findPlayer;
		}
	}
	
	//var game = games[gameIDs];
	//var playerShooting = game.findPlayerID(data.pID);
	console.log( playerShooting.getPlayerID() + " shooting!!");

	// Update player bullet group
	//playerShooting.setBullets(data.pBullet);

	// Broadcast updated bullet group to connected socket clients
	this.broadcast.emit("bullet move", {pID: playerShooting.pID, x: data.x, y: data.y, pBulletX: data.pBulletX, pBulletY: data.pBulletY, pVelY: data.pVelY, pVelX: data.pVelX, pBulletDir: data.pBulletDir});
	//this.broadcast.emit("bullet move", {pID: playerShooting.pID, pBulletsX: data.pBulletsX, pBulletsY: data.pBulletsY });
};

// Player has shot bullet
function onPlayerHealth(data) {
	
	var playerHealth;
	for (var i = 0; i < gameIDs; i++) {
		var game = games[i];
		var findPlayer = game.findPlayerID(data.pID);
		if (findPlayer != 1) {
			playerHealth = findPlayer;
		}
	}
	//var game = games[gameIDs];
	//var playerHealth = game.findPlayerID(data.pID);
	console.log( playerHealth.getPlayerID() + " current health: " + playerHealth.getPlayerHealth());
	console.log( playerHealth.getPlayerID() + " new health: " + data.pHealth);

	// Update player bullet group
	playerHealth.setPlayerHealth(data.pHealth);

	// Broadcast updated player health to connected socket clients
	this.broadcast.emit("player health", {pID: playerHealth.pID, pHealth: playerHealth.getPlayerHealth()});
};

// Remove Health Power-up Item
function onRemoveHealthItem(data) {
	console.log("Removing Health Power-up");
	this.broadcast.emit("remove health item", {pID: data.pID, x: data.x, y: data.y});
};

/***************************************************************************************************************/
// Remove Shield Power-up Item
function onRemoveShieldItem(data) {
	console.log("Removing Shield Power-up");
	this.broadcast.emit("remove shield item", {pID: data.pID, x: data.x, y: data.y});
};

// Remove SpeedUp Power-up Item
function onRemoveSpeedupItem(data) {
	console.log("Removing Speed-up Power-up");
	this.broadcast.emit("player speed-up item", {pID: data.pID, x: data.x, y: data.y});
};

// Add Heart Health
function onAddHeartHealth(data) {
	console.log("Adding Heart Health");
	this.broadcast.emit("add 1toHealth", {pID: data.pID});
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].pID == id)
			return players[i];
	};
	
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();
