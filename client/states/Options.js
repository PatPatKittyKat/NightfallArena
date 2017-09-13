var Options = function(game) {};

Options.prototype = {

  menuConfig: {
    startY: 0,
    startX: 30
  },


  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Power-Ups!", {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;

    //this.damageText = game.make.text(200, 200, "Inflict double the damage to your opponent!", {
    //  font: 'bold 20pt TheMinion',
    //  fill: '#FDFFB5',
    //  align: 'center'
    //});

    this.healthText = game.make.text(200, 200, "Replenish your TOTAL heart count!", {
      font: 'bold 20pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });

    this.shieldText = game.make.text(200, 300, "Become invincible for 5 seconds!", {
      font: 'bold 20pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });

    this.speedUpText = game.make.text(200, 400, "Increase your speed to collect power-ups or dodge attacks!", {
      font: 'bold 20pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
  },
  create: function () {
    // var playSound = gameOptions.playSound,
    //     playMusic = gameOptions.playMusic;

    game.add.sprite(0, 0, 'powerups-bg');
    game.add.existing(this.titleText);
    //game.add.existing(this.damageText);
    game.add.existing(this.healthText);
    game.add.existing(this.shieldText);
    game.add.existing(this.speedUpText);

    //var damage = game.add.sprite(50, 150, 'damage');
    var health = game.add.sprite(50, 150, 'health');
    var shield = game.add.sprite(50, 250, 'shield');
    var speed = game.add.sprite(50, 350, 'speed-up');

    //damage.scale.setTo(.15, .15);
    health.scale.setTo(.15, .15);
    shield.scale.setTo(.15, .15);
    speed.scale.setTo(.15, .15);

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

Phaser.Utils.mixinPrototype(Options.prototype, mixins);
