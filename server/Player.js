/**************************************************
** PLAYER CLASS
**************************************************/
var Player = function(gameID, playerID, vehicleID, startHealth, startX, startY) {
	var gID = gameID,
		pID = playerID,
		vID = vehicleID,
		pHealth = startHealth,
		bullets = null,
		x   = startX,
		y   = startY;

	// Getters and setters
	var getGameID = function() {
		return gID;
	};
	
	var getPlayerID = function() {
		return pID;
	};

	var getVehicleID = function() {
		return vID;
	};
	
	var getBullets = function() {
		return bullets;
	};
	
	var setBullets = function(b) {
		bullets = b;
	};
	
	var getPlayerHealth = function() {
		return pHealth;
	};
	
	var setPlayerHealth = function(newHealth) {
		pHealth = newHealth;
	};
	
	var getX = function() {
		return x;
	};

	var setX = function(newX) {
		x = newX;
	};
	var getY = function() {
		return y;
	};

	var setY = function(newY) {
		y = newY;
	};

	// Define which variables and methods can be accessed
	return {
		getGameID: getGameID,
		getPlayerID: getPlayerID,
		getVehicleID: getVehicleID,
		getBullets: getBullets,
		setBullets: setBullets,
		getPlayerHealth: getPlayerHealth,
		setPlayerHealth: setPlayerHealth,
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;

//module.exports = Player;