var GameMenu = function() {};

GameMenu.prototype = {

  menuConfig: {
    startY: 200,
    startX: 500
  },

  // MENU TITLE
  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Nightfall Arena", {
      font: 'bold 60pt TheMinion',
      fill: '#FFFFFF',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  // MUSIC STUFF -> we can change this
  create: function () {

    // if (music.name !== "dangerous" && playMusic) {
    //   music.stop();
    //   music = game.add.audio('dangerous');
    //   music.loop = true;
    //   music.play();
    // }
    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);

    // ADD CLICKABLE STATES IN THE MAIN MENU
	this.addMenuOption('Select Vehicle', function () {
      game.state.start("Vehicles");
    });
    this.addMenuOption('Instructions', function () {
      game.state.start("Instructions");
    });
    this.addMenuOption('Power-Ups', function () {
      game.state.start("Options");
    });
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
