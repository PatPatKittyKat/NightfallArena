/**************************************************
** GAME CLASS
**************************************************/
var Game = function() {
   var p1  = null,
       p2  = null,
	   mID = -1;
	   fogLayer = [],
       p1Playing = false,
       p2Playing = false;

   // Getters and Setters
   var isGameFull = function(){
       if (p1Playing && p2Playing) {
		   return true;
	   }
	   return false;
   };
   
   var AddPlayer = function(player){
      if (p1Playing && p2Playing) {
         return null;
      }
      else {
         if (!p1Playing) {
            p1 = player;
			p1Playing = true;
         }
         else {
            p2 = player;
			p2Playing = true;
         }
      }
   };
   
   var findPlayerID = function(playerID) {
	   var player;
	   console.log("Player1: " + p1.getPlayerID());
	   console.log("Player2: " + p2.getPlayerID());
	   if (p1.getPlayerID() == playerID) {
		   player = p1;
	   }
	   else if (p2.getPlayerID() == playerID){
		   player = p2;
	   }
	   else {
		   player == 1;
		   console.log("Player Not Found!");
	   }
	   return player;
   };
   
   var setMapID = function(map){
      mID = map;  
   };
   
   var getMapID = function(){
      return mID;
   };
   
   var getP1 = function(){
      return p1;
   };

   var getP2 = function(){
      return p2
   };
   
   return {
	   isGameFull: isGameFull,
	   AddPlayer: AddPlayer,
	   getMapID: getMapID,
	   findPlayerID: findPlayerID,
	   setMapID: setMapID,
	   getP1: getP1,
	   getP2: getP2
   }

};

// Export the Game class so you can use it in
// other files by using require("Game").Game
exports.Game = Game;
