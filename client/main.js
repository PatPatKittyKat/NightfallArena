// Global Variables
var
  game = new Phaser.Game(1280,613,Phaser.CANVAS,'game'),
  Main = function () {},
  gameOptions = {
    playSound: true,
    playMusic: true
  },
  musicPlayer,
  vehicle_string;

Main.prototype = {

  preload: function () {
    game.load.image('stars',    './client/menu/images/stars.jpg');
    game.load.image('loading',  './client/menu/images/loading.png');
    game.load.image('brand',    './client/menu/images/tamu.png');
    game.load.script('polyfill',   './client/lib/polyfill.js');
    game.load.script('utils',   './client/lib/utils.js');
    game.load.script('splash',  './client/states/Splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');
