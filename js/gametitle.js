var GameTitle = function(game){};

GameTitle.prototype = {

	create: function(){
		var me = this;
		var bg;

		// Title screen background
		me.game.stage.backgroundColor = '479cde';
		bg = me.game.add.sprite(0, 0, 'sky');
		bg.width = me.game.width;
		bg.height = me.game.height;

		// Title screen text
		me.game.add.text(150,  150, 
			'Jumper\n\n'+
			'Controls: LEFT, UP, RIGHT\n'+
			'Pause:     DOWN\n\n'+
			'[Press any key to start]', 
			{ fontSize: '64px', fill: '#FFF' });

		// Add a key to start
		// TODO: fix so that there isnt allways a global watch on this
		me.game.input.keyboard.onDownCallback = function() {
			if (me.game.state.current == "GameTitle") {
				me.game.state.start("Main");
			}
		};
	}
}
