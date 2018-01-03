var Main = function(game){

};

Main.prototype = {

	create: function() {
		var me = this;

		// Get tile dimensions
		me.tileWidth = me.game.cache.getImage('tile').width;
		me.tileHeight = me.game.cache.getImage('tile').height;

		// Set up background
		me.game.stage.backgroundColor = '479cde';

		// Enable physics
		me.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Add platforms
		me.platforms = me.game.add.group();
		me.platforms.enableBody = true;
		me.platforms.createMultiple(250, 'tile');

		// Timer to add platforms
		me.timer = game.time.events.loop(2000, me.addPlatform, me);
	},

	update: function() {

	},

	gameOver: function() {
		this.game.state.start('GameOver');
	},

	addTile: function(x, y) {
		var me = this;

		// Get a tile not on screen
		var tile = me.platforms.getFirstDead();

		// Reinitialize the tile
		tile.reset(x, y);
		tile.body.velocity.y = 160;
		tile.body.immovable = true;

		// Kill offscreen tiles
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
	},

	addPlatform: function(y) {
		var me = this;

		// If no y, render it offscreen
		if (typeof(y) == "undefined") {
			y = -me.tileHeight;
		}

		// Number of tiles needed, and math for the hole to jump thru
		var tilesNeeded = Math.ceil(me.game.world.width / me.tileWidth);
		var hole = Math.floor(Math.random() * (tilesNeeded - 3)) + 1;

		// Add tiles horizontally, leaving space for hole
		for (var i = 0; i < tilesNeeded; i++) {
	        if (i != hole && i != hole + 1){
	            this.addTile(i * me.tileWidth, y);
	        }          
	    }
	}

};