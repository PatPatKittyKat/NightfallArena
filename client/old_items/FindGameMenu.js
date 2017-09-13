var FindGameMenu = {
	var yourplayer, newplayer;
	
	var socket;
	
	preload: function(){
		yourplayer = null;
		newplayer = null;
		socket = io.connect();
	},
	
	create: function(){
		setEventHandlers();
	},
	
	update: function(){
		if (newplayer != null){
			this.state.start('main');
		}
	}
	
var setEventHandlers = function () {
	// Socket connection successful
	socket.on('connect', onSocketConnected)
	
	// Your player message received
	socket.on('your player', onYourPlayer);
	
	// New player message received
	socket.on('new player', onNewPlayer);
}

function onSocketConnected () {
	console.log('Connected to socket server');
}	

function onYourPlayer(data) {
	yourplayer = new Player(data.pID,data.vID,data.x,data.y);
	console.log("your player coord: (" + data.x + ", " + data.y + ")");
}

function onNewPlayer(data) {
	newplayer = new Player(data.pID,data.vID,data.x,data.y);
	console.log("new player coord: (" + data.x + ", " + data.y + ")");
}
	
};