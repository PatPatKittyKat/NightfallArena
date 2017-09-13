// Created using Phaser API at phaser.ios

// Creating a new game in Phaser
var game = new Phaser.Game(1280,600,Phaser.CANVAS,'gameDiv', { preload: preload, create: create, update: update, render: render });

var socket;

// TODO: Change to list of maps
var map;

var ditch;
var health;

var box,player1, player1ID,inputKey;

var gameover_text;

var fireButton;
var bullets;
var bulletTime = 0;

var score_event;


var health_item, speed_item, shield_item;
// Initialise remote players array
var remotePlayers;

var player2,player2ID,player2Bullets,p2bullet;
var player1Bool, player2Bool;



var player1_shield_on = 0;
var player2_shield_on = 0;

var findGameButton;

var leftClickpointer;


var max_health = 10;
var player1_life = max_health;
var player2_life = max_health;
//for health_item picture overlap:
var add_heart_location=29 * max_health;

var shield_item_on = 0;

var velocity=500;

var timer;

//Fog of war
var fogGroup;

function preload (){  
	//game.load.tilemap('map', "./images/background_1.png", null, Phaser.Tilemap.TILED_JSON);
	game.load.image('map',"./client/images/background_1.png");
	game.load.image("fisher_car","./client/images/car_1.png");
	game.load.spritesheet("play-now","./client/images/play-now.png",217,58);
	game.load.image("popo-5-0","./client/images/police-car.png");
	game.load.image("box","./client/images/water.png");
	game.load.image('bullet',"./client/images/apeach.png");
	game.load.image('bg',"./client/images/background_1.png");
	game.load.image("ditch","./client/images/water.png");
	game.load.image("health_alive","./client/images/health_alive.png");
	game.load.image("health_dead","./client/images/health_dead.png");
	game.load.image("health_item","./client/images/health.png");
	game.load.image("speed_item","./client/images/speed_up.png");
	game.load.image("shield_item","./client/images/shield.png");

	
	//Fog of war
	game.load.spritesheet('fogBlock', './client/images/fog.png', 32, 32);


}

function create() {
		
	socket = io.connect();
	player2Bool = false;
	player2Bool = false;

	map = game.add.tileSprite(0,101,1280,499,'map');
	// 1280: width
	// 499 : height


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
	
	
	gameover_text = game.add.text(500,500,"GAME OVER",
	{fontSize:"80px", fill:"#1234F3"});
	
	//gameover_text = game.add.text(game.world.centerX,game.centerY, "GAME OVER",
	//{fontSize = "80px",fill:#FFFFFF});
	gameover_text.anchor.setTo(0.5,0.5);
	gameover_text.visible=false;

	/*----score bar---*/
	score = game.add.group();
	game.create.texture('score',['C'],1280,80,0);
	game.add.sprite(0,0,'score');
  
	/*----health bar---*/
	health = game.add.group();
	health.enableBody = true;
	
	/*----Creating Fog---*/
	fogGroup = game.add.physicsGroup();
	for (var i = 0; i < 1280; i+=32) {
        for(var j = 100; j < 699; j+=32) {
            var c = fogGroup.create(i, j, 'fogBlock', 0);
        }
    }
	
	// Creating Health
	for (var l = 0; l < max_health; ++l) {
		health.create(20+30*l,30,"health_alive").body.immovable = true;
		health.create(1240-30*l,30,"health_alive").body.immovable = true;
	}
	/*----Create Find Game Button---*/
	findGameButton = game.add.button(640-105, 1, 'play-now', onFindGame, this, 2, 1, 0);
	//player2 = game.add.sprite(100,150,"popo-5-0");
	//player1 = game.add.sprite(60,120,"player1");  //moving to onYourPlayer
	//game.physics.arcade.enable(player1);
	
	inputKey=game.input.keyboard.createCursorKeys();
	
	// temp - fire button
	//fireButton = game.input.activePointer.addKey(Phaser.Keyboard.SPACEBAR);
	
	// bullet attribute
	
	
	///////////////////////////////////////////////////////////////////////////
	//creating walls:
	ditch = game.add.group();
	ditch.enableBody = true;
	
	for (var k = 0; k < 15; ++k) {
		if (k < 7) {
			ditch.create(200,200+(k*20),"ditch").body.immovable = true;
			ditch.create(500,200+(k*20),"ditch").body.immovable = true;
			//reversed
			ditch.create(1240-200,500-200+(k*20),"ditch").body.immovable = true;
			ditch.create(1240-500,500-200+(k*20),"ditch").body.immovable = true;
		}
		ditch.create(200+(k*20),200,"ditch").body.immovable = true;
		//reversed
		ditch.create(1240-(200+(k*20)),620-200,"ditch").body.immovable = true;
		
	}
	
	
	
	//end of walls (map borders defined below)
	//////////////////////////////////////////////////////////////////////////
	
	// box(outline)
	box=game.add.group();
	box.enableBody=true;
	
	for (var i =0; i < 32; i++){							// increase i to extend bar
		box.create(i*40,60,"box").body.immovable=true; 		// 60: upper bar 
		box.create(i*40, 600-40, "box").body.immovable=true;
	}
	for (var j =2; j < 20; j++) {
		box.create(0,j*40,"box").body.immovable=true;
	
		box.create(1280-40,j*40,"box").body.immovable = true;			
	}
	
	// tile position (like wall)
	
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
	
	// Start listening for events
	setEventHandlers();

}

var onFindGame = function(){
	socket.emit('find game',{
		mID:0,
		vID:1 
	});
	console.log("client ID: " + socket.id);
};

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
	
}

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
	
	// Your player boolean to prevent start of play
	player1Bool = true;
}

// New player
function onNewPlayer(data) {
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
	player2Bullets.createMultiple(30, 'bullet');
	player2Bullets.setAll('anchor.x', 0.5);
	player2Bullets.setAll('anchor.y', 1);
	player2Bullets.setAll('outOfBoundsKill', true);
	player2Bullets.setAll('checkWorldBounds', true);
	
	player2Bool = true;
}

// Move player
function onMovePlayer(data) {
	console.log("CLIENT PLAYER MOVING");
	player2.x = data.x;
	player2.y = data.y;
};

// Move player
function onPlayerHealth(data) {
	console.log("Opponent Health Decreasing: " + data.pHealth);
	player2_life = data.pHealth;
};

// Bullet Move by Player2
function onBulletMove(data) {
	console.log("Opponent Shooting");

	p2bullet = player2Bullets.getFirstExists(false);
	console.log("player2 coord: (" + data.x + "," + data.y + ") bullet coord: (" +  data.pBulletX + "," + data.pBulletY + ")");
	p2bullet.reset(data.x, data.y);
    p2bullet.body.velocity.y = -400;
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

function update() {
	
if (player1Bool && player2Bool) {

	game.physics.arcade.collide(player1,box);
	game.physics.arcade.collide(player1,ditch);
	game.physics.arcade.collide(player1,player2);
	
	//Fog collision with players	
	game.physics.arcade.collide(player1,fogGroup,collisionFogHandler);
	game.physics.arcade.collide(player2,fogGroup,collisionFogHandler);
	
	// prevent bullet to go out of scroe bar
	game.physics.arcade.overlap(box,bullets,function(box,bullets){
	bullets.kill();
	},null,this);
	
	
	/*----collision betweetn car----*/
	
	
	
	/*----shield_item----*/	
	game.physics.arcade.overlap(player1,shield_item,function(player1,shield_item){
	shield_item.kill();
		// shield starts
	player1_shield_on = 1;
		// after 5 second, shield off
	setTimeout(function(){
		player1_shield_on = 0;
	},5000)
	//socket.emit('player health',{pID: player1ID, pHealth: player1_life});
	
	},null,this);
	
	game.physics.arcade.overlap(player2,shield_item,function(player2,shield_item){
	shield_item.kill();
		// shield starts
	player2_shield_on = 1;
		// after 5 second, shield off
	setTimeout(function(){
		player2_shield_on = 0;
	},5000)
	//socket.emit('player health',{pID: player1ID, pHealth: player1_life});
	
	},null,this);
		
	
	/*----health item----*/
	game.physics.arcade.overlap(player1,health_item,function(player1,health_item){
	health_item.kill();
	if (player1_life < max_health) {
		player1_life++;
		for (var r = 0; r < player1_life; ++r){
			//140 is where to add back hearts if max_health = 5;
			//health.create(140-30*r,30,"health_alive").body.immovable = true;
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
		// decrease speed first
		velocity = 2500;		
		player1.body.velocity.setTo(100,100);
		// after 2 second (2000), run below instant function
		setTimeout(function(){
			velocity = 500;
			player1.body.velocity.setTo(100,100);
		},2000)
	
	},null,this);
	
	/*
	//setInterval(func_timer(velocity,player1),2000);	
	//timer = game.time.events.add(Phaser.Timer.SECOND * 2 , speed_increase(), this);	
	//game.time.events.remove(timer);
	velocity = 300;	
	player1.body.velocity.setTo(0,0);
	 timer = game.time.events.add(Phaser.Timer.SECOND * 2 , speed_increase, this);	
	game.time.events.remove(timer);
	//velocity = 1000;
	//player1.body.velocity.setTo(0,0);
	//game.time.events.add(Phaser.Timer.SECOND * 2, speed_increase, this);
	//game.time.events.add(0, speed_increase, this);
	//speed_item.create(1100,200,"speed_item").body.immovable = true;
	//
	//game.time.events.add(Phaser.Timer.SECOND * 3, speed_increase,this);
	//velocity = 1000;	
	//player1.body.velocity.setTo(0,0);
	*/
	
	//velocity = 1000;		
	//player1.body.velocity.setTo(100,100);

	
	
	
	
	/*
	velocity = 100;
	while(2second){
	time out
	}
	*/
	
	
	game.physics.arcade.overlap(player1,bullets,function(player1,bullets){
	bullets.kill();
	
	if (player1_shield_on == 0){
	player1_life--;	
	socket.emit('player health',{pID: player1ID, pHealth: player1_life});
	for (var q = 0; q < max_health - player1_life; ++q){
		health.create(20+30*q,30,"health_dead").body.immovable = true;
	}
	}
	},null,this);
	
	// ----------------------------------------------------------------------
	game.physics.arcade.overlap(player2,bullets,function(player2,bullets){ //Changed
	bullets.kill();
	player2_life--;
	if (player2_shield_on == 0){
	
	socket.emit('player health',{pID: player2ID, pHealth: player2_life});
	
	for (var q = 0; q < max_health - player2_life; ++q){
		health.create(1240-30*q,30,"health_dead").body.immovable = true;
	}
	}
	},null,this);
	
	
	/* health = game.add.group();
	health.enableBody = true;
	for (var l = 0; l < 5; ++l) {
		health.create(20+30*l,30,"health_alive").body.immovable = true;
		health.create(1240-30*l,30,"health_alive").body.immovable = true;
	} */
	
	if (player1_life < 1) {
		gameover_text.visible = true;
		return;
	}
	
	if (player2_life < 1) {
		gameover_text.visible = true;
		return;
	}
	
	//player1.rotation = game.physics.arcade.angleToPointer(player1);
	
	// bullet calls fire function(below)	
	if (game.input.activePointer.isDown)
    {
		leftClickpointer = game.input.activePointer.isDown;
		fireBullet();
    }

	// velocity 
 // -_-;....	
	
	player1.body.velocity.setTo(0,0);
	
	// keyboard
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
	/*
	for (var i = 0; i < bullets.length; i++) {
		console.log("bullet: (" + bullets[i].x + "," + bullets[i].y + ")");
	}*/
	
	//socket.emit("bullet move",{pID: player1ID, pBullets: bullets});  // Changed
}// if statement

}

function func_timer() {
//velocity = 200;
velocity = 200;		
player1.body.velocity.setTo(100,100);
	//console.log("hihi");

}
function speed_increase(){
	//player1.kill();
	/*
	velocity = 1000;		
	player1.body.velocity.setTo(0,0);
	*/
	helper;
}

function helper(){
velocity = 1000;		
	player1.body.velocity.setTo(0,0);
}

function render () { }

// Find player by ID
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player1.x, player1.y);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
			game.physics.arcade.moveToPointer(bullet, 300);
			socket.emit('bullet move',{pID: player1ID, x: player1.x, y: player1.y, pBulletX: bullet.x, pBulletY: bullet.y, pBulletDir: leftClickpointer});
        }
    }

}

function speed_increase(){
	// change velocity
}

function collisionHandler (bullet, player1) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
 
    //  Increase the score
   /*
	score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.resetirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }
*/
}

// Check if player1 vehicle collides with fog block
function collisionFogHandler(player, fogBlock) {
    if (fogBlock.frame == 0) {
		// Remove block from map
        fogBlock.kill();
    }
}
