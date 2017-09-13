// Created using Phaser API at phaser.io

// Creating a new game in Phaser
var game = new Phaser.Game(1280,600,Phaser.CANVAS,'gameDiv');

// TODO: Change to list of maps
var map;

var box,player1,inputKey;

var fireButton;
var bullets;
var bulletTime = 0;

var score_event;

var mainState = {
	preload:function(){      
		game.load.image('map',"./public/images/map_3.1.png");
		game.load.image("player1","./public/images/car_1.png");
		game.load.image("box","./public/images/water.png");
		game.load.image('bullet',"./public/images/apeach.png");
		//game.load.image('map',"./public/images/background_1.png")
	},

	create:function(){
		map = game.add.tileSprite(0,101,1280,499,'map');
		
		//score bar
		score = game.add.group();
		game.create.texture('score',['C'],1280,80,0);
		game.add.sprite(0,0,'score');
	  
	  
		player1 = game.add.sprite(200,200,"player1");
		game.physics.arcade.enable(player1);
		inputKey=game.input.keyboard.createCursorKeys();
		
		// temp - fire button
		//fireButton = game.input.activePointer.addKey(Phaser.Keyboard.SPACEBAR);
		
		// bullet attribute
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
		
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
		
		// var startX = Math.round(Math.random()*(canvas.width-5)),
		// startY = Math.round(Math.random()*(canvas.height-5));
		
		// Initialise the local player
		//localPlayer = new Player(startX, startY);
		socket = io.connect("http://compute.cs.tamu.edu:10001");
		
		// Initialise remote players array
		remotePlayers = [];
		
		// Start listening for events
		setEventHandlers();
		
   },

   update:function(){
	
	// immovable box 
		game.physics.arcade.collide(player1,box);
	
	// prevent bullet to go out of scroe bar
		game.physics.arcade.overlap(box,bullets,function(box,bullets){
		bullets.kill();
		},null,this);
	
		game.physics.arcade.overlap(player1,bullets,function(player1,bullets){
		bullets.kill();
		},null,this);
	
	//player1.rotation = game.physics.arcade.angleToPointer(player1);
	
	// bullet calls fire function(below)	
		if (game.input.activePointer.isDown)
		{
			fireBullet();
		}

		
		// velocity 
		var velocity=1000; // -_-;....	
		
		player1.body.velocity.setTo(0,0);
		
		// keyboard
		if (inputKey.left.isDown && inputKey.up.isDown) {
			player1.body.velocity.x = -velocity;
			player1.body.velocity.y = -velocity;
		}
		else if (inputKey.left.isDown && inputKey.down.isDown) {
			player1.body.velocity.x = -velocity;
			player1.body.velocity.y = +velocity;
		}
		else if (inputKey.right.isDown && inputKey.up.isDown) {
			player1.body.velocity.x = +velocity;
			player1.body.velocity.y = -velocity;
		}
		else if (inputKey.right.isDown && inputKey.down.isDown) {
			player1.body.velocity.x = +velocity;
			player1.body.velocity.y = +velocity;
		}
		else if (inputKey.left.isDown) {
			player1.body.velocity.x = -velocity;
		}
		else if (inputKey.right.isDown) {
			player1.body.velocity.x = +velocity;
		}
		else if (inputKey.up.isDown) {
			player1.body.velocity.y = -velocity;
		}	
		else if (inputKey.down.isDown) {
			player1.body.velocity.y = +velocity;
		}	
	}
}




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
        }
    }

}
/*
function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}
*/

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

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
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
** GAME UPDATE
**************************************************/
function update() {
	// Update local player and check for change
	if (localPlayer.update(keys)) {
		// Send local player data to the game server
		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};
};

/**************************************************
** GAME DRAW
**************************************************/
/* function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the local player
	localPlayer.draw(ctx);

	// Draw the remote players
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].draw(ctx);
	};
}; */

/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};

game.state.add('mainState',mainState);

game.state.start('mainState');
