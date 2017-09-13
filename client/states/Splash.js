var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', './client/lib/style.js');
    game.load.script('mixins', './client/lib/mixins.js');
    game.load.script('WebFont', './client/vendor/webfontloader.js');
    game.load.script('GameMenu','./client/states/GameMenu.js');
    game.load.script('game', './client/states/Game.js');
    game.load.script('gameover','./client/states/GameOver.js');
    game.load.script('options', './client/states/Options.js');
    game.load.script('Instructions', './client/states/Instructions.js');
	game.load.script('Vehicles', './client/states/Vehicles.js');
  },

  loadBgm: function () {
    // thanks Kevin Macleod at http://incompetech.com/
    //game.load.audio('dangerous', './client/menu/bgm/Dangerous.mp3');
    //game.load.audio('exit', './client/menu/bgm/Exit the Premises.mp3');
  },
  // varios freebies found from google image search
  loadImages: function () {
    // BACKGROUND IMAGES FOR DIFFERENT MENUS
    game.load.image('menu-bg', './client/menu/images/wallhaven-455480.jpg');
    game.load.image('nasa', './client/menu/images/nasa.jpg');
    game.load.image('gameover-bg', './client/menu/images/gameover-bg.jpg');
    game.load.image('powerups-bg', './client/menu/images/blue-stars.png');
    game.load.image('instructions-bg', './client/menu/images/gray.jpg');

    // POWER-UPS IMAGES FOR POWER-UPS MENU
    game.load.image('damage', './client/menu/images/damage.png');
    game.load.image('health', './client/menu/images/health.png');
    game.load.image('shield', './client/menu/images/shield.png');
    game.load.image('speed-up', './client/menu/images/speed_up.png');
	
	game.load.image('keypad', './client/menu/images/keypad.png');
	game.load.image('mouse', './client/menu/images/mouse.png');
	
	// VEHICLES TO CHOOSE FROM ON MENU
	game.load.image('arrow', './client/images/arrow.png');
	game.load.image('fp-menu', './client/images/fp-menu.PNG');
	game.load.image('saucer', './client/images/flying-saucer.png');
	game.load.image('police-menu', './client/images/big/police-car.png');
	
	// VEHICLES TO PLAY
	game.load.image('fisher-price', './client/images/car_1.png');
	game.load.image('police', './client/images/police-car52x50.png');
	game.load.image('f-saucer', './client/images/flying-saucer9.png');
	
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion'],
        urls: ['./client/menu/style/theminion.css']
      }
    }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.logo, this.status]);
  },

  preload: function () {
    game.add.sprite(0, 0, 'stars');
	game.add.sprite(800, 0, 'stars');
    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    game.state.add("GameMenu",GameMenu);
    game.state.add("Game",Game);
    game.state.add("GameOver",GameOver);
    game.state.add("Options",Options);
    game.state.add("Instructions",Instructions);
	game.state.add("Vehicles",Vehicles);
  },

  addGameMusic: function () {
    music = game.add.audio('dangerous');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};
