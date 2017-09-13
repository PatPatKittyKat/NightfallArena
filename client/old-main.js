// Created using Phaser API at phaser.ios

/**************************************************
** Game Map Global Variables
**************************************************/
// Creating a new game in Phaser
var game = new Phaser.Game(1280,613,Phaser.CANVAS,'gameDiv', { preload: preload, create: create, update: update, render: render });
var socket;
var map;
var ditch;
var gameover_text;
var score_event;
var findGameButton;
var leftClickpointer;
var timer;
var fogGroup,fogGroup75,fogGroup50,fogGroup25;

/**************************************************
** Game Mechanic Variables
**************************************************/
var fireButton;
var bullets, bullets2;
var bulletTime = 0;
var max_health = 10;
var velocity = 500;
var add_heart_location=29 * max_health; //for health_item picture overlap:
var shield_item_on = 0;
var shield_explosions;
var explosions;
var explosion_sound;
var shot_sound;
var powerup_sound;
var music;
var shield_on_sound;
var shield_block_sound;

var itemID;

/**************************************************
** Player1 Global Variables
**************************************************/
var box,player1, player1ID,inputKey;
var health;
var player1_life = max_health;
var p1Shield_on;
var p1Unfog;

/**************************************************
** Player2 Global Variables
**************************************************/
var remotePlayers;
var player2,player2ID,player2Bullets; //p2bullet;
var player1Bool, player2Bool;
var player2_life = max_health;
var p2Shield_on;
var p2Unfog;

/**************************************************
** Powerup Items Global Variables
**************************************************/
var health_item, speed_item, shield_item;
var player1_shield_on = 0;
var player2_shield_on = 0;

var flash;


/**************************************************
** Preload Game Images
**************************************************/
function preload (){  
	game.load.image('map',"./client/images/water_map_1280x512.png");
	game.load.image("fisher_car","./client/images/car_1.png");
	game.load.spritesheet("play-now","./client/images/play-now.png",217,58);
	//game.load.image("popo-5-0","./client/images/police-car.png");
	game.load.image("popo-5-0","./client/images/police-car52x50.png");
	game.load.image("box","./client/images/transparent_boundry.png");
	game.load.image('bullet',"./client/images/apeach.png");
	game.load.image('bullet2',"./client/images/muzi.png")
	game.load.image('bg',"./client/images/background_1.png");
	game.load.image("ditch","./client/images/transparent_boundry20x20.png");
	game.load.image("health_alive","./client/images/health_alive.png");
	game.load.image("health_dead","./client/images/health_dead.png");
	game.load.image("health_item","./client/images/health.png");
	game.load.image("speed_item","./client/images/speed_up.png");
	game.load.image("shield_item","./client/images/shield.png");
	game.load.image("unfog","./client/images/unfog_circle_200x200.png");
	game.load.spritesheet("shield_on","./client/images/shield72x72.png");
	game.load.image("light","./client/images/temp.png");
	//game.load.spritesheet('fogBlock', './client/images/fog.png', 32, 32); 	//Fog of war
	game.load.spritesheet('fogBlock', './client/images/fog16x16.png', 16, 16); 	//Fog of war
	game.load.spritesheet('explosion', './client/images/explode.png', 128, 128); // explosion - player hit
	game.load.spritesheet('explosion_shield', './client/images/explosion72px-720x144.png', 144, 144); // explosion - player hit
	game.load.audio('explosion_sound', './client/music/explosion_sound.wav');
	game.load.audio('shot_sound', './client/music/shot_sound.wav');
	game.load.audio('powerup_sound', './client/music/powerup_sound.wav');
	game.load.audio('music', './client/music/background_music_lowVol.wav');
	game.load.audio('shield_on_sound', './client/music/scfi-short-circuit.wav');
	game.load.audio('shield_block_sound', './client/music/space-electric-damage.wav');

}// End of Preload Function


/**************************************************
** Create Game Functionality
**************************************************/
function create() {
		
	socket = io.connect();
	player2Bool = false;
	player2Bool = false;

	map = game.add.tileSprite(0,101,1280,512,'map');
	// 1280: width
	// 499 : height

	
	flash = game.add.group();
	flash.enableBody = true;
	flash.create(1100,200,"light").body.immovable = true;	
	flash.create(900,200,"light").body.immovable = true;	
	flash.physicsBodyType = Phaser.Physics.ARCADE;	
	
	/*----item displacement----*/
	speed_item = game.add.group();
	speed_item.enableBody = true;
	speed_item.create(1100,200,"speed_item").body.immovable = true;	
	speed_item.create(100,200,"speed_item").body.immovable = true;
	speed_item.create(900,200,"speed_item").body.immovable = true;
	speed_item.create(700,400,"speed_item").body.immovable = true;
	speed_item.physicsBodyType = Phaser.Physics.ARCADE;	
	
	
	health_item = game.add.group();
	health_item.enableBody = true;
	health_item.create(1000,200,"health_item").body.immovable = true;
	health_item.create(900,240,"health_item").body.immovable = true;	
	health_item.physicsBodyType = Phaser.Physics.ARCADE;
	
	shield_item = game.add.group();
	shield_item.enableBody = true;
	shield_item.create(300,400,"shield_item").body.immovable = true;

	p1Shield_on = game.add.sprite(null,null,'shield_on');
	game.physics.enable(p1Shield_on, Phaser.Physics.ARCADE);
	
	p2Shield_on = game.add.sprite(null,null,'shield_on');
	game.physics.enable(p1Shield_on, Phaser.Physics.ARCADE);
	
	p1Unfog = game.add.sprite(null,null,'unfog');
	game.physics.enable(p1Unfog, Phaser.Physics.ARCADE);

	p2Unfog = game.add.sprite(null,null,'unfog');
	game.physics.enable(p2Unfog, Phaser.Physics.ARCADE);
	
	gameover_text = game.add.text(500,500,"GAME OVER",
	{fontSize:"80px", fill:"#1234F3"});
	
	gameover_text.anchor.setTo(0.5,0.5);
	gameover_text.visible=false;

	/*----score bar---*/
	score = game.add.group();
	game.create.texture('score',['C'],1280,101,0);
	game.add.sprite(0,0,'score');
  
	/*----health bar---*/
	health = game.add.group();
	health.enableBody = true;
	
	/*----Creating Fog---*/
	var fog_size = 16; //px
	fogGroup   = game.add.physicsGroup();
	
	for (var i = 0; i < 1280; i+=fog_size) { // change from i+=32 to 8
        for(var j = 100; j < 699; j+=fog_size) {
            var f100 = fogGroup.create(i, j, 'fogBlock', 0);
        }
    }
	
	// Creating Health
	for (var l = 0; l < max_health; ++l) {
		health.create(20+30*l,30,"health_alive").body.immovable = true;
		health.create(1240-30*l,30,"health_alive").body.immovable = true;
	}
	/*----Create Find Game Button---*/
	findGameButton = game.add.button(640-105, 1, 'play-now', onFindGame, this, 2, 1, 0);
	
	inputKey=game.input.keyboard.createCursorKeys();
	
	///////////////////////////////////////////////////////////////////////////
	// Ditch boundries
	ditch = game.add.group();
	ditch.enableBody = true;

	var topBar = 101;
	var ditchPX = 32;
	
	for (var i = 2; i <= 9; ++i) {
		ditch.create(((i*ditchPX)+topBar),((5*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((6*ditchPX)+topBar),"ditch").body.immovable = true;
	}
	for (var i = 2; i <= 3; ++i) {
		ditch.create(((i*ditchPX)+topBar),((7*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((8*ditchPX)+topBar),"ditch").body.immovable = true;
	}
	for (var i = 8; i <= 9; ++i) {
		ditch.create(((i*ditchPX)+topBar),((7*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((8*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((9*ditchPX)+topBar),"ditch").body.immovable = true;
	}
	for (var i = 17; i <= 18; ++i) {
		ditch.create(((i*ditchPX)+topBar),((6*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((7*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((8*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((9*ditchPX)+topBar),"ditch").body.immovable = true;
	}
	for (var i = 28; i <= 29; ++i) {
		ditch.create(((i*ditchPX)+topBar),((5*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((6*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((7*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((8*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((9*ditchPX)+topBar),"ditch").body.immovable = true;
	}
	for (var i = 17; i <= 29; ++i) {
		ditch.create(((i*ditchPX)+topBar),((10*ditchPX)+topBar),"ditch").body.immovable = true;
		ditch.create(((i*ditchPX)+topBar),((11*ditchPX)+topBar),"ditch").body.immovable = true;
	}
	// End Ditch boundries
	///////////////////////////////////////////////////////////////////////////
	
	// Map box outer boundries
	box=game.add.group();
	box.enableBody=true;
	// Top/Bottom Boundries
	for (var i = 0; i <= 40; i++){							// increase i to extend bar
		box.create(i*32,70,"box").body.immovable=true; 		// 60: upper bar 
		box.create(i*32, 613-32, "box").body.immovable=true;
	}
	// Left/Right Boundries
	for (var j = 0; j <= 16; j++) {
		box.create(-5,j*32,"box").body.immovable=true;
		box.create(1280-30,j*32,"box").body.immovable = true;			
	}
	
	gameover_text = game.add.text(600,300,"GAME OVER",
	{fontSize:"80px", fill:"#FF0000"});
	
	//gameover_text = game.add.text(game.world.centerX,game.centerY, "GAME OVER",
	//{fontSize = "80px",fill:#FFFFFF});
	gameover_text.anchor.setTo(0.5,0.5);
	gameover_text.visible=false;
	
	var score_text = game.add.text(20,0,"You",
	{fontSize:"25px", fill:"#FFB6C1"});
		var score_text = game.add.text(1145,0,"Opponent",
	{fontSize:"25px", fill:"#0066FF"});
	
	// create some enemies to lay down the law on
	remotePlayers = [];
	
     //  An explosion pool
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('explosion');
    });

    //  An explosion shield pool
    shield_explosions = game.add.group();
    shield_explosions.enableBody = true;
    shield_explosions.physicsBodyType = Phaser.Physics.ARCADE;
    shield_explosions.createMultiple(30, 'explosion_shield');
    shield_explosions.setAll('anchor.x', 0.5);
    shield_explosions.setAll('anchor.y', 0.5);
    shield_explosions.forEach( function(explosion_shield) {
        explosion_shield.animations.add('explosion_shield');
    });

    // Create sound effects
    explosion_sound = game.add.audio('explosion_sound');
    shot_sound = game.add.audio('shot_sound');
    powerup_sound = game.add.audio('powerup_sound');
    music = game.add.audio('music');
	shield_on_sound = game.add.audio('shield_on_sound');
	shield_block_sound = game.add.audio('shield_block_sound');

	
	
	// Start listening for events
	setEventHandlers();

	//game.sound.setDecodedCallback(explosion, , start, this);

}

var onFindGame = function(){
	socket.emit('find game',{
		mID:0,
		vID:1 
	});
	console.log("client ID: " + socket.id);
};

/**************************************************
** Game Event Handlers - Listen on Sockets
**************************************************/
var setEventHandlers = function () {
	// Socket connection successful
	socket.on('connect', onSocketConnected);

	// Socket disconnection
	socket.on('disconnect', onSocketDisconnect);

	// New player message received
	socket.on('new player', onNewPlayer);
	
	// Your player message received
	socket.on('your player', onYourPlayer);

	// Player move message received
	socket.on('move player', onMovePlayer);
	
	// Opponent shot bullet received
	socket.on("bullet move", onBulletMove);
	
	// Player heart helth received
	socket.on('player health', onPlayerHealth);

	// Player removed message received
	socket.on('remove player', onRemovePlayer);
	
	// Power-up Health removed message received
	socket.on('remove healthItem', onRemoveHealthItem);
	
	// Power-up Speed-up removed message received
	socket.on('remove shieldItem', onRemoveShieldItem);
	
	// Power-up Shield removed message received
	socket.on('remove speedupItem', onRemoveSpeedupItem);
	
}

/**************************************************
** Game Socket Functions
**************************************************/
// Socket connected
function onSocketConnected () {
	console.log('Connected to socket server')

	// Reset enemies on reconnect
	remotePlayers.forEach(function (enemy) {
		enemy.player.kill()
	})
	remotePlayers = []

	// Send local player data to the game server
	//socket.emit("new player", {x: player1.x, y: player1.y});
}

// Socket disconnected
function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}

// Socket disconnected
function onYourPlayer(data) {
	console.log("your player1 coord: (" + data.x + ", " + data.y + ")");
	
	// Add Your Player to Game
	player1 = game.add.sprite(data.x,data.y,"fisher_car");
	game.physics.arcade.enable(player1);
	
	// Set Your Player's ID for socket communication
	player1ID = data.pID;
	
	// Create Player1's Bullets
	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(30, 'bullet');
	bullets.setAll('anchor.x', 0.5);
	bullets.setAll('anchor.y', 1);
	bullets.setAll('outOfBoundsKill', true);
	bullets.setAll('checkWorldBounds', true)
	
	// 
	
	
	
	// Fog of war child immovable object
	player1.addChild(p1Unfog);
	p1Unfog.body.setCircle(50,-25,-25);
	p1Unfog.body.bounce.set(0);
	p1Unfog.body.immovable = true;
	//p1Unfog.mass = 100;
	
	
	// Your player boolean to prevent start of play
	player1Bool = true;
}

// New player
function onNewPlayer(data) {
	if (typeof music.loop == 'boolean'){
		music.loop = true;
	}
	else{
		music.addEventListener('ended',function(){
			this.currentTime = 0;
			this.play();
		}, false);
	}
	
	music.play();
	//console.log('New player connected:', data.id)
	console.log("new player2 coord: (" + data.x + ", " + data.y + ")");

	// Adding remote player to game
	player2 = game.add.sprite(data.x,data.y,"popo-5-0");
	game.physics.arcade.enable(player2);
	
	// Add new player to the remote players array
	remotePlayers.push(player2);
	player2ID = data.pID;
	
	// Create Player2's Bullets
	player2Bullets = game.add.group();
	player2Bullets.enableBody = true;
	player2Bullets.physicsBodyType = Phaser.Physics.ARCADE;
	player2Bullets.createMultiple(30, 'bullet2');
	player2Bullets.setAll('anchor.x', 0.5);
	player2Bullets.setAll('anchor.y', 1);
	player2Bullets.setAll('outOfBoundsKill', true);
	player2Bullets.setAll('checkWorldBounds', true);
	
	// Fog of war child immovable object
	player2.addChild(p2Unfog);
	p2Unfog.body.setCircle(50,-25,-25);
	p2Unfog.body.bounce.set(0);
	p2Unfog.body.immovable = true;
	
	// Player2 is in the game
	player2Bool = true;
	
	// Play Battle Background Music
	music.loop = true;
	music.play();

}

// Move player
function onMovePlayer(data) {
	console.log("CLIENT PLAYER MOVING");
	player2.x = data.x;
	player2.y = data.y;
};


// Remove Health Power-up Item
function onRemoveHealthItem(data) {
	console.log("Removing Health Power-up");
	pID = data.pID;
	health_item.x = data.x;
	health_item.y = data.y;	
	
};

// Remove Shield Power-up Item
function onRemoveShieldItem(data) {
	console.log("Removing Shield Power-up");
	pID = data.pID;
	shield_item.x = data.x
	shield_item.y = data.y	
	//pID: player1ID, x: shield_item.x, y: shield_item.y
};

// Remove SpeedUp Power-up Item
function onRemoveSpeedupItem(data) {
	console.log("Removing Speed-up Power-up");
	pID = data.pID;
	speed_item.x = data.x
	speed_item.y = data.y	
};

// Move player
function onPlayerHealth(data) {
	console.log("Opponent Health Decreasing: " + data.pHealth);
	player2_life = data.pHealth;
};

// Bullet Move by Player2
function onBulletMove(data) {
	console.log("Opponent Shooting");
	var p2bullet = player2Bullets.getFirstExists(false);
	console.log("player2 coord: (" + data.x + "," + data.y + ") bullet coord: (" +  data.pBulletX + "," + data.pBulletY + ")");
	p2bullet.reset(data.x, data.y);
    p2bullet.body.velocity.y = data.pVelY;
	p2bullet.body.velocity.x = data.pVelX;
    p2bullet = game.time.now + 200;
	game.physics.arcade.moveToPointer(p2bullet, 300,data.pBulletDir);
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

/**************************************************
** Update Game State - Based on Phaser Frame Rate
**************************************************/
function update() {
	
if (player1Bool && player2Bool) {

	game.physics.arcade.collide(player1,box);
	game.physics.arcade.collide(player1,ditch);
	//game.physics.arcade.collide(player1,player2);
	
	//Fog collision with players	
	game.physics.arcade.overlap(p1Unfog,fogGroup,function(p1Unfog,fogBlock){ fogBlock.kill(); });
	game.physics.arcade.overlap(p2Unfog,fogGroup,function(p2Unfog,fogBlock){ fogBlock.kill(); });
	
	// prevent bullet to go out of scroe bar
	game.physics.arcade.overlap(box,bullets,function(box,bullets){
	bullets.kill();
	},null,this);
	
	
	/*----collision between car----*/
	
	
	
	/*------shield_item----*/	
	game.physics.arcade.overlap(player1,shield_item,function(player1,shield_item){
		shield_item.kill();
		
		// Notify Item has been picked up
		socket.emit('remove shieldItem',{pID: player1ID, x: shield_item.x, y: shield_item.y});
		
		// shield starts
		player1_shield_on = 1;
		
		// Add shield image
		player1.addChild(p1Shield_on);
		shield_on_sound.play();
		p1Shield_on.x -= 11; // Relative to parent - child offset
		p1Shield_on.y -= 11; // Relative to parent - child offset
		
		// after 5 second, shield off
		setTimeout(function(){
			player1_shield_on = 0;
			
			// Remove shield image
			p1Shield_on.kill();
			
		},10000)  // was 5000 ms or 5 secs
	
	
	},null,this);

	
	game.physics.arcade.overlap(player2,shield_item,function(player2,shield_item){
		shield_item.kill();
		
		// Notify Item has been picked up
		socket.emit('remove shieldItem',{pID: player2ID, x: shield_item.x, y: shield_item.y});
		
		// shield starts
		player2_shield_on = 1;

		// Add shield image
		player2.addChild(p2Shield_on);
		shield_on_sound.play();
		p2Shield_on.x -= 11; // Relative to parent - child offset
		p2Shield_on.y -= 11; // Relative to parent - child offset
	
		// after 5 second, shield off
		setTimeout(function(){
			player2_shield_on = 0;
			
			// Remove shield image
			p2Shield_on.kill();

		},10000) // was 5000 ms or 5 secs
	
	},null,this);
		
	
	/*----health item----*/
	game.physics.arcade.overlap(player1,health_item,function(player1,health_item){
		health_item.kill();
		powerup_sound.play();
		// Notify Item has been picked up
		socket.emit('remove healthItem',{pID: player1ID, x: health_item.x, y: health_item.y});	
		if (player1_life < max_health) {
			player1_life++;
			for (var r = 0; r < player1_life; ++r){
				health.create(add_heart_location-30*r,30,"health_alive").body.immovable = true;
			}
		}	
			health_item.kill();
			if (player1_life < 5) {
				player1_life++;
				for (var r = 0; r < player1_life; ++r){
					health.create(140-30*r,30,"health_alive").body.immovable = true;
				}
			}	
	},null,this);
	
	
	/*----speed up item----*/
	game.physics.arcade.overlap(player1,speed_item,function(player1,speed_item){
		speed_item.kill();
		powerup_sound.play();
		// Notify Item has been picked up
		socket.emit('remove speedupItem',{pID: player1ID, x: player1.x, y: player1.y})
		
		// decrease speed first
		velocity = 500;		
		player1.body.velocity.setTo(100,100);
		// after 2 second (2000), run below instant function
		setTimeout(function(){
			velocity = 500;
			player1.body.velocity.setTo(100,100);
		},2000)
	
	},null,this);
	
	
	game.physics.arcade.overlap(player2,speed_item,function(player2,speed_item){
		speed_item.kill();
		powerup_sound.play();
		// Notify Item has been picked up
		socket.emit('remove speedupItem',{pID: player2ID, x: speed_item.x, y: speed_item.y})
		
		// decrease speed first
		velocity = 500;		
		player2.body.velocity.setTo(100,100);
		// after 2 second (2000), run below instant function
		setTimeout(function(){
			velocity = 500;
			player2.body.velocity.setTo(100,100);
		},2000)
	
	},null,this);
	
	
	
	
	/*----Bullet - Player1 Hit----*/
	game.physics.arcade.overlap(player1,player2Bullets,function(p1,bullet){
		bullet.kill();
	
		if (player1_shield_on == 0){
			player1_life--;	
			socket.emit('player health',{pID: player1ID, pHealth: player1_life});
			for (var q = 0; q < max_health - player1_life; ++q){
				health.create(20+30*q,30,"health_dead").body.immovable = true;
			}
			explosion_sound.play();	
	    	var explosion = explosions.getFirstExists(false);
   			explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    		explosion.body.velocity.y = player1.body.velocity.y;
    		explosion.alpha = 0.7;
    		explosion.play('explosion', 30, false, true);		
		}
		// Shield is active
		else {
			var shield_explosion = shield_explosions.getFirstExists(false);
   			shield_explosion.reset(p1.x + 25, p1.y + 25);
    		shield_explosion.body.velocity.y = player1.body.velocity.y;
    		shield_explosion.play('explosion_shield', 30, false, true);
			shield_block_sound.play();
		}
	},null,this);
	
	/*----Bullet - Player2 Hit----*/
	game.physics.arcade.overlap(player2,bullets,function(p2,bullet){
		bullet.kill();
		if (player2_shield_on == 0){
			player2_life--;
			socket.emit('player health',{pID: player2ID, pHealth: player2_life});
	
			for (var q = 0; q < max_health - player2_life; ++q){
				if (!(player2_life < 0)){
				health.create(1240-30*q,30,"health_dead").body.immovable = true;
				}
			}
			explosion_sound.play();	
    		var explosion = explosions.getFirstExists(false);
   			explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    		explosion.body.velocity.y = player1.body.velocity.y;
    		explosion.alpha = 0.7;
    		explosion.play('explosion', 30, false, true);
    	}
				// Shield is active
		else {
			var shield_explosion = shield_explosions.getFirstExists(false);
   			shield_explosion.reset(p2.x, p2.y);
    		shield_explosion.body.velocity.y = player1.body.velocity.y;
    		shield_explosion.play('explosion_shield', 30, false, true);
		}
	},null,this);
	
	if (player1_life < 1) {
		gameover_text.visible = true;
		return;
	}
	
	if (player2_life < 1) {
		gameover_text.visible = true;
		return;
	}
	
	// Mouse Pointer Input	
	if (game.input.activePointer.isDown)
    {
		leftClickpointer = game.input.activePointer.isDown;
		fireBullet();
    }

	// Player1 speed
	player1.body.velocity.setTo(0,0);
	
	// keyboard Input
	if (inputKey.left.isDown && inputKey.up.isDown) {
		player1.body.velocity.x = -velocity;
		player1.body.velocity.y = -velocity;
		socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
	}
	else if (inputKey.left.isDown && inputKey.down.isDown) {
		player1.body.velocity.x = -velocity;
		player1.body.velocity.y = +velocity;
		socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})

	}
	else if (inputKey.right.isDown && inputKey.up.isDown) {
		player1.body.velocity.x = +velocity;
		player1.body.velocity.y = -velocity;
		socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
	}
	else if (inputKey.right.isDown && inputKey.down.isDown) {
		player1.body.velocity.x = +velocity;
		player1.body.velocity.y = +velocity;
		socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
	}
	else if (inputKey.left.isDown) {
		player1.body.velocity.x = -velocity;
		socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
	}
	else if (inputKey.right.isDown) {
		player1.body.velocity.x = +velocity;
		socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
	}
	else if (inputKey.up.isDown) {
		player1.body.velocity.y = -velocity;
		socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
	}	
	else if (inputKey.down.isDown) {
		player1.body.velocity.y = +velocity;
		console.log("Down pressed: " + player1.y);
		socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
	}

}// End of if statement

}// End of Update Function


/**************************************************
** Game Helper Functions
**************************************************/

function render() { }

// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};

function fireBullet() {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
    	shot_sound.play();
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player1.x + 30, player1.y + 30);
            bullet.body.velocity.y = this.velocity.y;
			bullet.body.velocity.y = this.velocity.x;
            bulletTime = game.time.now + 200;
			game.physics.arcade.moveToPointer(bullet, 300);
			socket.emit('bullet move',{pID: player1ID, x: player1.x, y: player1.y,
									   pBulletX: bullet.x, pBulletY: bullet.y,
									   pVelY: bullet.body.velocity.y, pVelX: bullet.body.velocity.x,
									   pBulletDir: leftClickpointer});
        }
    }

}

