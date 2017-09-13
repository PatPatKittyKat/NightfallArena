var Vehicles = function(game) {};
//var text;

var vehicles;
var police;
var fisherprice;
var saucer;
var arrow;
var count = 1;

Vehicles.prototype = {

  menuConfig: {
    startY: 400,
    startX: 30
  },


  init: function () {
    this.titleText = game.make.text(game.world.centerX, 75, "Select vehicle", {
      font: 'bold 60pt TheMinion',
      fill: '#FFFFFF',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;

    this.policeText = game.make.text(500, 200, "Five-Oh", {
      font: 'bold 30pt TheMinion',
      fill: '#FFFFFF',
      align: 'center'
    });
	
	this.fisherText = game.make.text(500, 300, "The XMAS Present You Never Got", {
      font: 'bold 30pt TheMinion',
      fill: '#FFFFFF',
      align: 'center'
    });
	
	this.saucerText = game.make.text(500, 400, "Millenium Falcon", {
      font: 'bold 30pt TheMinion',
      fill: '#FFFFFF',
      align: 'center'
    });
  },
  create: function () {
    // var playSound = gameOptions.playSound,
    //     playMusic = gameOptions.playMusic;

    game.add.sprite(0, 0, 'instructions-bg');
    game.add.existing(this.titleText);
    game.add.existing(this.policeText);
	game.add.existing(this.fisherText);
	game.add.existing(this.saucerText);
	
    police = game.add.sprite(300, 150, 'police-menu');
	fisherprice = game.add.sprite(300, 250, 'fp-menu');
	saucer = game.add.sprite(300, 350, 'saucer');
	
	vehicles = game.add.group();
	vehicles.add(police);
	vehicles.add(fisherprice);
	vehicles.add(saucer);
	
	console.log("GROUP LENGTH " + vehicles.children.length);
	
	police.inputEnabled = true;
	fisherprice.inputEnabled = true;
	saucer.inputEnabled = true;
	
	police.events.onInputDown.add(listener, police);
	fisherprice.events.onInputDown.add(listener, fisherprice);
	saucer.events.onInputDown.add(listener, saucer);
	
	//text = game.add.text(10, 100, '', { fill: '#ffffff' });
	
	arrow = game.add.sprite(175, 165, 'arrow');

    //arrow.anchor.setTo(0.5, 0.5);
    arrow.alpha = 0;
	
	game.add.tween(arrow).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
	vehicle_string = "police";
	
    //keypad.scale.setTo(.15, .15);

    // this.addMenuOption(playMusic ? 'Mute Music' : 'Play Music', function (target) {
    //   playMusic = !playMusic;
    //   target.text = playMusic ? 'Mute Music' : 'Play Music';
    //   musicPlayer.volume = playMusic ? 1 : 0;
    // });
    // this.addMenuOption(playSound ? 'Mute Sound' : 'Play Sound', function (target) {
    //   playSound = !playSound;
    //   target.text = playSound ? 'Mute Sound' : 'Play Sound';
    // });
    this.addMenuOption('<- Back', function () {
      game.state.start("GameMenu");
    });
	
	this.addMenuOption('Start Death Match->', function () {
      game.state.start("Game");
    });
  }
};

function listener (vehicle) {

	//police.tint = Math.random() * 0xffffff;
	//text.destroy();
	//text = game.add.text(10, 100, '', { fill: '#ffffff' });
	
	arrow.destroy();
	// count++;
	// if(count > 2) {
		// arrow.destroy();
	// }
	
    // for(var i = 0; i < vehicles.children.length; i++) {
		// //vehicles.children[i].alpha = 1.0;
		// vehicles.children[i].tint = 0xFFFFFF;
	// }
	
	if (vehicles.children[0] == vehicle) {
		//text = game.add.text(10, 100, '', { fill: '#ffffff' });
		//text.text = "Vehicle chosen: Five-Oh";
		console.log("CLICKED ON POLICE");
        vehicle_string = "police";
		arrow = game.add.sprite(175, 165, 'arrow');
		arrow.alpha = 0;
		game.add.tween(arrow).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
		
		//game.add.tween(arrow).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		//vehicle.tint = 0xffff00;
		//vehicle.alpha = 0.4;
    } else if (vehicles.children[1] == vehicle) {
		//text = game.add.text(10, 100, '', { fill: '#ffffff' });
		//text.text = "Vehicle chosen: Fisher-Price";
		console.log("CLICKED ON FISHER PRICE");
		vehicle_string = "fisher-price";
		arrow = game.add.sprite(175, 260, 'arrow');
		arrow.alpha = 0;
		game.add.tween(arrow).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
		
		//game.add.tween(arrow).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		//vehicle.tint = 0xffff00;
		//vehicle.alpha = 0.4;
	}
	else if (vehicles.children[2] == vehicle) {
		//text = game.add.text(10, 100, '', { fill: '#ffffff' });
		//text.text = "Vehicle chosen: Saucer";
		console.log("CLICKED ON SAUCER");
		vehicle_string = "f-saucer";
		arrow = game.add.sprite(175, 365, 'arrow');
		arrow.alpha = 0;
		game.add.tween(arrow).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
		//game.add.tween(arrow).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		//vehicle.tint = Math.random() * 0xffffff;
		//vehicle.alpha = 0.4;
	}

}

Phaser.Utils.mixinPrototype(Vehicles.prototype, mixins);
