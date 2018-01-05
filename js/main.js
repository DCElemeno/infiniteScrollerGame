var Main = function(game) {};

Main.prototype = {

	create: function() {
		var me = this;

		// Get tile dimensions
		me.tileWidth = me.game.cache.getImage('tile').width;
		me.tileHeight = me.game.cache.getImage('tile').height;

		// Set up background
		me.game.stage.backgroundColor = '479cde';
		var bg = me.game.add.sprite(0, 0, 'sky');
		bg.width = me.game.width;
		bg.height = me.game.height;

		// Enable physics
		me.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Add platforms
		me.platforms = me.game.add.group();
		me.platforms.enableBody = true;
		me.platforms.createMultiple(250, 'tile');

		// Add player
		me.createPlayer();

		// Add cursor controls
		me.cursors = me.game.input.keyboard.createCursorKeys();
		me.pauseKey = me.game.input.keyboard.addKey(Phaser.Keyboard.SPACE);

		// Add score
		me.score = 0;
		me.createScore();

		// Add pause text
		me.pauseText = me.game.add.text(
			window.innerWidth/2 - 25, 
			window.innerHeight/2, '', 
			{ fontSize: '64px', fill: '#FFF' });

		// Create initial platforms
		me.spacing = 300;
		me.initPlatforms();

		// Timer to add platforms
		me.addPlatform();
		me.timer = game.time.events.loop(2000, me.addPlatform, me);

		// Pause listener
		me.cursors.down.onDown.add(unPause, self);
		function unPause() {
			if (me.game.paused) {
				me.pauseText.text = '';
				me.game.paused = false;
			}	
		}
	},

	update: function() {
		var me = this;

		// Add sprite collision
		me.game.physics.arcade.collide(me.player, me.platforms);

		// Check if touching bottom
		if (me.player.body.position.y >= me.game.world.height - me.player.body.height) {
	        me.gameOver();
	    }

	    // UP (jump)
		if (me.cursors.up.isDown && me.player.body.wasTouching.down) {
		    me.player.body.velocity.y = -1400;
		}
		// LEFT
		else if (me.cursors.left.isDown) {
		    me.player.body.velocity.x += -30;
		}
		// RIGHT
		else if (me.cursors.right.isDown) {
		    me.player.body.velocity.x += 30;
		}
		// PAUSE
		else if (me.cursors.down.isDown) {
			me.pauseText.text = 'PAUSE';
			game.paused = true;
		}
		// PAUSE
		else if (me.pauseKey.isDown) {
			console.info("got here");
			me.pauseText.text = 'PAUSE';
			game.paused = true;
		}
		// Reduce velocity
		else {
			me.player.body.velocity.x = me.player.body.velocity.x * 0.9;
		}
	},

	gameOver: function() {
		this.game.state.start('Main');
	},

	addTile: function(x, y) {
		var me = this;

		// Get a tile not on screen
		var tile = me.platforms.getFirstDead();

		// Reinitialize the tile
		tile.reset(x, y);
		tile.body.velocity.y = 120;
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

			// Increment Score
			me.incrementScore();
		}

		// Number of tiles needed, and math for the hole to jump thru
		var tilesNeeded = Math.ceil(me.game.world.width / me.tileWidth);
		var hole = Math.floor(Math.random() * (tilesNeeded - 3)) + 1;

		// Add tiles horizontally, leaving space for hole
		for (var i = 0; i < tilesNeeded; i++) {
	        
	        // version with small holes
	        if (i != hole && i != hole + 1){
	            this.addTile(i * me.tileWidth, y);
	        }

			// version with small platforms	
	        /*if (i == hole || i == hole + 1){
	            this.addTile(i * me.tileWidth, y);
	        }*/          
	    }
	},

	initPlatforms: function() {
		var me = this,
        	bottom = me.game.world.height - me.tileHeight,
        	top = me.tileHeight;

		// Populate the screen with platforms
		for (var y = bottom; y > top - me.tileHeight; y = y - me.spacing) {
	        me.addPlatform(y);
	    }
	},

	createPlayer: function() {
		var me = this;

		// Add player
		me.player = me.game.add.sprite(
			me.game.world.centerX, 
			me.game.world.height - (me.spacing * 2 + (3 * me.tileHeight)), 'player');

		// Set player's anchor point
		me.player.anchor.setTo(0.5, 1.0);

		// Add physics
		me.game.physics.arcade.enable(me.player);

		// Add gravity
		me.player.body.gravity.y = 2000;

		// Add collision
		me.player.body.collideWorldBounds = true;

		// Add bounce
		me.player.body.bounce.y = 0.1;
	},

	createScore: function() {
	    var me = this;
	    var scoreFont = "100px Arial";
	 
	 	// Add Score text
	    me.scoreLabel = me.game.add.text((me.game.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"});
	    me.scoreLabel.anchor.setTo(0.5, 0.5);
	    me.scoreLabel.align = 'center';
	},
	 
	incrementScore: function() {
	    var me = this;
	    me.score += 1;  
	    me.scoreLabel.text = me.score;     
	}

};