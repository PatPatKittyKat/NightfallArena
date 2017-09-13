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
var ditch
var health;
var mainState = {
	preload:function(){      
		//game.load.tilemap('map', "./images/background_1.png", null, Phaser.Tilemap.TILED_JSON);
		game.load.image('map',"./images/background_1.png");
		game.load.image("player1","./images/car_1.png");
		game.load.image("box","./images/water.png");
		game.load.image('bullet',"./images/apeach.png");
		game.load.image('bg',"./images/background_1.png");
		game.load.image("ditch","./images/water.png");
		game.load.image("health_alive","./images/health_alive.png");
		game.load.image("health_dead","./images/health_dead.png");
	},

	create:function(){
		
		
	
		map = game.add.tileSprite(0,101,1280,499,'map');
		// 1280: width
		// 499 : height

		/*----score bar---*/
		score = game.add.group();
		game.create.texture('score',['C'],1280,80,0);
		game.add.sprite(0,0,'score');
	  
		/*----health bar---*/
		health = game.add.group();
		health.enableBody = true;
		for (var l = 0; l < 5; ++l) {
			health.create(40+45*l,5,"health_alive").body.immovable = true;
			health.create(1200-45*l,5,"health_alive").body.immovable = true;
		}
		
		player1 = game.add.sprite(60,120,"player1");
		
		game.physics.arcade.enable(player1);
		inputKey=game.input.keyboard.createCursorKeys();
		
		// temp - fire button
		//fireButton = game.input.activePointer.addKey(Phaser.Keyboard.SPACEBAR);
		
		// bullet attribute
		
		ditch = game.add.group();
		ditch.enableBody = true;
	
		for (var k = 0;  k< 7;++k) {
			ditch.create(200,200+(k*20),"ditch").body.immovable = true;
			ditch.create(500,200+(k*20),"ditch").body.immovable = true;
			ditch.create(40+20*k,320,"ditch").body.immovable = true;
		}
		for (k = 0; k < 15; ++k) {
			ditch.create(200+(k*20),200,"ditch").body.immovable = true;
		}
		
		ditch.create(700,200,"ditch").body.immovable = true;
		ditch.create(720,200,"ditch").body.immovable = true;
		ditch.create(740,200,"ditch").body.immovable = true;
		
		
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
		
		// tile position (like wall)
		
		
   },

   update:function(){
	
	// immovable box 
		game.physics.arcade.collide(player1,box);
		game.physics.arcade.collide(player1,ditch);
	// prevent bullet to go out of scroe bar
		game.physics.arcade.overlap(box,bullets,function(box,bullets){
		bullets.kill();
		},null,this);
	/*
		game.physics.arcade.overlap(box,bullets,function(ditch,bullets){
		ditch.kill();
		},null,this);
	*/
		
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









game.state.add('mainState',mainState);

game.state.start('mainState');
