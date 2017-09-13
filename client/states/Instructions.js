var Instructions = function(game) {};

Instructions.prototype = {

  menuConfig: {
    startY: 0,
    startX: 30
  },


  init: function () {
    this.titleText = game.make.text(game.world.centerX, 75, "Instructions", {
      font: 'bold 60pt TheMinion',
      fill: '#FFFFFF',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;

    this.keypadText = game.make.text(100, 200, "- Use WASD or arrow keys to move around", {
      font: 'bold 15pt TheMinion',
      fill: '#FFFFFF',
      align: 'center'
    });
	
	this.mouseText = game.make.text(100, 250, "- Left click to shoot your opponent", {
      font: 'bold 15pt TheMinion',
      fill: '#FFFFFF',
      align: 'center'
    });
  },
  create: function () {
    // var playSound = gameOptions.playSound,
    //     playMusic = gameOptions.playMusic;

    game.add.sprite(0, 0, 'instructions-bg');
    game.add.existing(this.titleText);
    game.add.existing(this.keypadText);
	game.add.existing(this.mouseText);

    var keypad = game.add.sprite(300, 150, 'keypad');
	var mouse = game.add.sprite(800, 100, 'mouse');

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
  }
};

Phaser.Utils.mixinPrototype(Instructions.prototype, mixins);
