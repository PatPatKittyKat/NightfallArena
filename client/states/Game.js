var Game = function(game, vehicle_string) {};

// Created using Phaser API at phaser.ios

/**************************************************
** Game Map Global Variables
**************************************************/
var socket;
var map;
var ditch;
var gameover_text;
var score_event;
//var findGameButton;
var leftClickpointer;
var timer;
var fogGroup;
var wait_opp_text;

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
var bullet_speed = 300;
var hearts;
var itemID;
var youLose;
var youWin;
var gameover;
var frameCount = 0;

/**************************************************
** Player1 Global Variables
**************************************************/
var box,player1, player1ID,inputKey;
var health;
var player1_life = max_health;
var p1Shield_on;
var p1Unfog;
var player1Won;

/**************************************************
** Player2 Global Variables
**************************************************/
var remotePlayers;
var player2,player2ID,player2Bullets; //p2bullet;
var player1Bool, player2Bool;
var player2_life = max_health;
var p2Shield_on;
var p2Unfog;
var player2Won;

/**************************************************
** Powerup Items Global Variables
**************************************************/
var health_item, speed_item, shield_item;
var player1_shield_on = 0;
var player2_shield_on = 0;

Game.prototype = {

  preload: function () {
    this.optionCount = 1;

  game.load.image('map',"./client/images/water_map_1280x512.png");
  game.load.image("fisher_car","./client/images/car_1.png");
  game.load.spritesheet("play-now","./client/images/play-now.png",217,58);
  game.load.image("popo-5-0","./client/images/police-car52x50.png");
  game.load.image("box","./client/images/transparent_boundry.png");
  game.load.image('bullet',"./client/images/apeach.png");
  game.load.image('heart',"./client/images/heart_30x30.png");
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
  game.load.image("light","./client/images/light.png");
  game.load.spritesheet('fogBlock', './client/images/fog.png', 32, 32);   //Fog of war
  game.load.spritesheet('explosion', './client/images/explode.png', 128, 128); // explosion - player hit
  game.load.spritesheet('explosion_shield', './client/images/explosion72px-720x144.png', 144, 144); // explosion - player hit
  game.load.audio('explosion_sound', './client/music/explosion_sound.wav');
  game.load.audio('shot_sound', './client/music/shot_sound.wav');
  game.load.audio('powerup_sound', './client/music/powerup_sound.wav');
  game.load.audio('music', './client/music/background_music_lowVol.wav');
  game.load.audio('shield_on_sound', './client/music/scfi-short-circuit.wav');
  game.load.audio('shield_block_sound', './client/music/space-electric-damage.wav');
  game.load.audio('youLose', './client/music/you-lose.wav');
  game.load.audio('youWin', './client/music/you-win.wav');
  game.load.audio('gameover', './client/music/gameover.wav');
  
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 60) + 200, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;


  },

create: function () {
	this.stage.disableVisibilityChange = false;
	game.add.sprite(0, 0, 'stars');

	socket = io.connect();
	player2Bool = false;
	player2Bool = false;

	map = game.add.tileSprite(0,101,1280,512,'map');
	// 1280: width
	// 699 : height
	
	/*----item placement initialization----*/
	speed_item = game.add.group();
	speed_item.enableBody = true;
	speed_item.physicsBodyType = Phaser.Physics.ARCADE; 
  
  	health_item = game.add.group();
	health_item.enableBody = true;
	health_item.physicsBodyType = Phaser.Physics.ARCADE;
  
	shield_item = game.add.group();
	shield_item.enableBody = true;

	p1Unfog = game.add.sprite(null,null,'unfog');
	game.physics.enable(p1Unfog, Phaser.Physics.ARCADE);

	p2Unfog = game.add.sprite(null,null,'unfog');
	game.physics.enable(p2Unfog, Phaser.Physics.ARCADE);
  
  
	/*----score bar---*/
	score = game.add.group();
	game.create.texture('score',['C'],1280,101,0);
	game.add.sprite(0,0,'score');
  
	/*----health bar---*/
	health = game.add.group();
	health.enableBody = true;
  
	/*----Creating Fog---*/
	var fog_size = 32; //px
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
	inputKey=game.input.keyboard.createCursorKeys();
	
	// Adding keys for WASD controls
	game.input.keyboard.addKey(Phaser.Keyboard.W);
	game.input.keyboard.addKey(Phaser.Keyboard.A);
	game.input.keyboard.addKey(Phaser.Keyboard.S);
	game.input.keyboard.addKey(Phaser.Keyboard.D);
  
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
	for (var i = 0; i <= 40; i++){
		box.create(i*32,70,"box").body.immovable=true;
		box.create(i*32, 613-32, "box").body.immovable=true;
	}
	// Left/Right Boundries
	for (var j = 0; j <= 16; j++) {
		box.create(-5,j*32,"box").body.immovable=true;
		box.create(1280-30,j*32,"box").body.immovable = true;     
	}
	
	// Create Waiting for Opponent Text
	wait_opp_text = game.add.text(650,300,"Waiting for opponent...",
		{fontSize:"80px", fill:"#FFFFFF"});
	wait_opp_text.anchor.setTo(0.5,0.5);
	wait_opp_text.visible=true;
  
	// Create Gameover Text
	gameover_text = game.add.text(600,300,"GAME OVER",
		{fontSize:"80px", fill:"#FF0000"});
	gameover_text.anchor.setTo(0.5,0.5);
	gameover_text.visible=false;
 
	// Create Score Bar Text for Players 
	var score_text = game.add.text(20,0,"You",
		{fontSize:"25px", fill:"#FFB6C1"});
	var score_text = game.add.text(1145,0,"Opponent",
		{fontSize:"25px", fill:"#0066FF"});
  
	// Player1 Won Text
	player1Won = game.add.text(600,400,"YOU WON!!!",
		{fontSize:"80px", fill:"#1234F3"});
	player1Won.anchor.setTo(0.5,0.5);
	player1Won.visible=false;
  
	// Player2 Won Text
	player2Won = game.add.text(600,400,"YOU LOST!!!",
		{fontSize:"80px", fill:"#1234F3"});
	player2Won.anchor.setTo(0.5,0.5);
	player2Won.visible=false;
  
	// create some enemies to lay down the law on
	remotePlayers = [];
	
	// Create hearts for health pickup
	hearts = game.add.group();
	hearts.enableBody = true;
	hearts.physicsBodyType = Phaser.Physics.ARCADE;
	hearts.createMultiple(30, 'heart');
	hearts.setAll('anchor.x', 0.5);
	hearts.setAll('anchor.y', 1);
	hearts.setAll('checkWorldBounds', true)
  
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

    // Create game sound effects
    explosion_sound = game.add.audio('explosion_sound');
    shot_sound = game.add.audio('shot_sound');
    powerup_sound = game.add.audio('powerup_sound');
    music = game.add.audio('music');
	shield_on_sound = game.add.audio('shield_on_sound');
	shield_block_sound = game.add.audio('shield_block_sound');
	youLose = game.add.audio('you-lose');
	youWin = game.add.audio('you-win');
	gameover = game.add.audio('gameover');

	// Start listening for events
	setEventHandlers();

	socket.emit('find game',{
      mID:0,
      vID:vehicle_string
    });
    console.log("client ID: " + socket.id);
	
}, 

update: function () {

  if (player1Bool && player2Bool) {
	
	// Overlay a flashing light on powerup items (Frame Rate 60fps)
	++frameCount;
	if (frameCount%30 == 0) { flash.visible = false; }
	if (frameCount%240 == 0) { flash.visible = true; }
	
	// Player1 cannot go out of bounds
	game.physics.arcade.collide(player1,box);
	game.physics.arcade.collide(player1,ditch);
  
	//Fog collision with players  
	game.physics.arcade.overlap(p1Unfog,fogGroup,function(p1Unfog,fogBlock){ fogBlock.kill(); });
	game.physics.arcade.overlap(p2Unfog,fogGroup,function(p2Unfog,fogBlock){ fogBlock.kill(); });
  
	// prevent bullet to go out of scroe bar
	game.physics.arcade.overlap(box,bullets,function(box,bullets){
		bullets.kill();
	},null,this);
  
   
	game.physics.arcade.overlap(player1,flash,function(player1,flash){ flash.kill(); },null,this);
	game.physics.arcade.overlap(player2,flash,function(player2,flash){ flash.kill(); },null,this);
  
	/*------shield_item----*/ 
	// Player 1 picked up shield item
	game.physics.arcade.overlap(player1,shield_item,function(player1,shield_item){
		shield_item.kill();
    
		// Notify Item has been picked up
		socket.emit('remove shieldItem',{pID: player1ID, x: shield_item.x, y: shield_item.y});
    
		p1Shield_on = game.add.sprite(null,null,'shield_on');
		game.physics.enable(p1Shield_on, Phaser.Physics.ARCADE);
	
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
      
		},5000)  // 5000 ms or 5 secs
		
	},null,this);

  // Player 2 picked up shield item
  game.physics.arcade.overlap(player2,shield_item,function(player2,shield_item){
    shield_item.kill();
    
    // Notify Item has been picked up
    socket.emit('remove shieldItem',{pID: player2ID, x: shield_item.x, y: shield_item.y});
    
	p2Shield_on = game.add.sprite(null,null,'shield_on');
	game.physics.enable(p2Shield_on, Phaser.Physics.ARCADE);
	
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

    },5000) // 5000 ms or 5 secs
  
  },null,this);
    
  
  /*----health item----*/
  // Player 1 picked up health item
  game.physics.arcade.overlap(player1,health_item,function(player1,health_item){
	powerup_sound.play();
	
	var heart = hearts.getFirstExists(false);
	heart.reset(health_item.x, health_item.y);
    heart.body.velocity.y = -300;
    
	health_item.kill();

    // Notify Item has been picked up
    socket.emit('remove healthItem',{pID: player1ID, x: health_item.x, y: health_item.y});
	socket.emit('add 1toHealth',{pID: player1ID});
	
    if (player1_life < max_health) {
      player1_life++;
      for (var r = 0; r < player1_life; ++r){
        health.create(add_heart_location-30*r,30,"health_alive").body.immovable = true;
      }
    }
	
  },null,this);
  
   // Player 2 picked up health item
  game.physics.arcade.overlap(player2,health_item,function(player2,health_item){
	powerup_sound.play();
	
	var heart = hearts.getFirstExists(false);
	heart.reset(health_item.x, health_item.y);
    heart.body.velocity.y = -300;
    
	health_item.kill();

    // Notify Item has been picked up
    socket.emit('remove healthItem',{pID: player2ID, x: health_item.x, y: health_item.y});  
    if (player2_life < max_health) {
      player2_life++;
      for (var r = 0; r < player2_life; ++r){
        health.create(add_heart_location-30*r,30,"health_alive").body.immovable = true;
      }
    }
	
  },null,this);
  
  
  /*----speed up item----*/
  // Player 1 picked up speed up item
  game.physics.arcade.overlap(player1,speed_item,function(player1,speed_item){
    flash.visible = false;
	
	speed_item.kill();
    powerup_sound.play();
    // Notify Item has been picked up
    socket.emit('remove speedupItem',{pID: player1ID, x: player1.x, y: player1.y})
    
    // increase speed
    velocity = 1000;   
    // decrease speed after 2 seconds (2000 ms)
    setTimeout(function(){
      velocity = 500;
    },2000)
  
  },null,this);
  
  // Player 2 picked up speed up item
  game.physics.arcade.overlap(player2,speed_item,function(player2,speed_item){
    speed_item.kill();
    powerup_sound.play();
    // Notify Item has been picked up
    socket.emit('remove speedupItem',{pID: player2ID, x: speed_item.x, y: speed_item.y})
    
	//increase speed
    velocity = 1000;   
    // decrease speed after 2 seconds (2000 ms)
    setTimeout(function(){
      velocity = 500;
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
	//youLose.play();
    gameover_text.visible = true;
	gameover.play();
	player2Won.visible=true;
	setTimeout(function myTimer() { game.state.start("GameMenu");},5000);
    return;
  }
  
  if (player2_life < 1) {
	//youWin.play();
    gameover_text.visible = true;
	gameover.play();
	player1Won.visible=true;
	setTimeout(function myTimer() { game.state.start("GameMenu");},5000);
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
  var speed = 4;
  
  //defining WASD keys for player movement:
  
  
  // keyboard Input
  if ((inputKey.left.isDown && inputKey.up.isDown) || (game.input.keyboard.isDown(Phaser.Keyboard.A) 
	  && game.input.keyboard.isDown(Phaser.Keyboard.W))) {
    player1.body.velocity.x = -velocity;
    player1.body.velocity.y = -velocity;
	player1.x = Math.round(player1.x);
    player1.y = Math.round(player1.y);
    socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
  }
  else if ((inputKey.left.isDown && inputKey.down.isDown) || (game.input.keyboard.isDown(Phaser.Keyboard.S) 
	  && game.input.keyboard.isDown(Phaser.Keyboard.A))) {
    player1.body.velocity.x = -velocity;
    player1.body.velocity.y = +velocity;
	player1.x = Math.round(player1.x);
    player1.y = Math.round(player1.y);
    socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})

  }
  else if ((inputKey.right.isDown && inputKey.up.isDown) || (game.input.keyboard.isDown(Phaser.Keyboard.W) 
	  && game.input.keyboard.isDown(Phaser.Keyboard.D))) {
    player1.body.velocity.x = +velocity;
    player1.body.velocity.y = -velocity;
	player1.x = Math.round(player1.x);
    player1.y = Math.round(player1.y);
    socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
  }
  else if ((inputKey.right.isDown && inputKey.down.isDown) || (game.input.keyboard.isDown(Phaser.Keyboard.S) 
	  && game.input.keyboard.isDown(Phaser.Keyboard.D))) {
    player1.body.velocity.x = +velocity;
    player1.body.velocity.y = +velocity;
	player1.x = Math.round(player1.x);
    player1.y = Math.round(player1.y);
    socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
  }
  else if (inputKey.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
    player1.body.velocity.x = -velocity;
  	player1.x = Math.round(player1.x);
	player1.y = Math.round(player1.y);
    socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
  }
  else if (inputKey.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
    player1.body.velocity.x = +velocity;
	player1.x = Math.round(player1.x);
	player1.y = Math.round(player1.y);
    socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
  }
  else if (inputKey.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
    player1.body.velocity.y = -velocity;
	player1.x = Math.round(player1.x);
    player1.y = Math.round(player1.y);
    socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
  } 
  else if (inputKey.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
    player1.body.velocity.y = +velocity;
    player1.x = Math.round(player1.x);
    player1.y = Math.round(player1.y);
    socket.emit('move player',{pID: player1ID, x: player1.x, y: player1.y})
  }

}// End of if statement
  }
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
  
  // Health item picked up add 1 heart ot player 2's health
  socket.on('add 1toHealth', onAddHeartHealth);
  
  
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

}

// Socket disconnected
function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}

// Socket disconnected
function onYourPlayer(data) {
  console.log("your player1 coord: (" + data.x + ", " + data.y + ")" + data.vID);
  
  // Add Your Player to Game
  player1 = game.add.sprite(data.x,data.y,data.vID);
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
  bullets.setAll('checkWorldBounds', true);
  
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
  player1.addChild(p1Unfog);
  p1Unfog.body.setCircle(50,-25,-25);
  p1Unfog.body.bounce.set(0);
  p1Unfog.body.immovable = true;
  
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
  
  console.log("NEW player2 coord: (" + data.x + ", " + data.y + ") - " + data.vID);

  // Adding remote player to game
  player2 = game.add.sprite(data.x,data.y,data.vID);
  game.physics.arcade.enable(player2);
  
  // Add new player to the remote players array
  remotePlayers.push(player2);
  player2ID = data.pID;
  
  /*----item placement----*/
  var pUpArray = data.pArray;
  for (var i = 0; i < pUpArray.length; i++) {
	// Create 3 speed powerup items
	if (i < 3) {
		speed_item.create(pUpArray[i].x,pUpArray[i].y,"speed_item").body.immovable = true;
	}
	// Create 2 Health powerup items
	else if (i >=3 && i < 5) {
		health_item.create(pUpArray[i].x,pUpArray[i].y,"health_item").body.immovable = true;
	}
	// Create 2 Shield powerup items
	else {
		shield_item.create(pUpArray[i].x,pUpArray[i].y,"shield_item").body.immovable = true; 
	}
  }

  // flash item (need to be here: add layer later -> top layer)
  flash = game.add.group();
  flash.enableBody = true;
  for (var i = 0; i <  pUpArray.length; i++) {
	flash.create(pUpArray[i].x,pUpArray[i].y,"light").body.immovable = true;	
  }
	
  flash.physicsBodyType = Phaser.Physics.ARCADE;
  flash.visible = false;

  // Fog of war child immovable object
  player2.addChild(p2Unfog);
  p2Unfog.body.setCircle(50,-25,-25);
  p2Unfog.body.bounce.set(0);
  p2Unfog.body.immovable = true;
  
  // Player2 is in the game
  player2Bool = true;
  
  // Play Battle Background Music
  music.loop = true;
  wait_opp_text.visible=false;
  music.play();

}

// Move player
function onMovePlayer(data) {
  console.log("CLIENT PLAYER MOVING");
  //console.log("P2 Coord: (" + data.x + ", " + data.y + ")");
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
  if (player2ID == data.pID) {
	player2_life = data.pHealth;
  }
};

// Bullet Move by Player2
function onBulletMove(data) {
	console.log("Opponent Shooting");
	var p2bullet = player2Bullets.getFirstExists(false);
	console.log("player2 coord: (" + data.x + "," + data.y + ") bullet coord: (" +  data.pBulletX + "," + data.pBulletY + ")");
	p2bullet.reset(data.x + 30, data.y + 30);
    p2bullet.body.velocity.y = data.pVelY;
	p2bullet.body.velocity.x = data.pVelX;
    p2bullet = game.time.now + 200;
	game.physics.arcade.moveToPointer(p2bullet, bullet_speed,data.pBulletDir);
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

// Add Heart to player 2's health
function onAddHeartHealth(data) {
  console.log("Opponent Health Increasing by 1");
  
  if (player2_life < max_health) {
	console.log("P2 Health: " + player2_life);
    player2_life++;
    for (var r = 0; r < player2_life; ++r){
	  health.create(970+30*r,30,"health_alive").body.immovable = true;
    }
  }
};


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
			game.physics.arcade.moveToPointer(bullet, bullet_speed);
			socket.emit('bullet move',{pID: player1ID, x: player1.x, y: player1.y,
									   pBulletX: bullet.x, pBulletY: bullet.y,
									   pVelY: bullet.body.velocity.y, pVelX: bullet.body.velocity.x,
									   pBulletDir: leftClickpointer});
        }
    }

}

