
// Initialize Phaser! 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {

	// executed at beginning (load game assets)
	preload: function() {
		// change background of game
		game.stage.backgroundColor = '#71c5cf';

		game.load.image('finn', 'assets/finn.png');
		game.load.image('gunter', 'assets/gunter.png');

	},

	// called after the preload function
	// set up game, display sprites etc
	create: function() {
		// set physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// display finn!
		this.finn = this.game.add.sprite(100, 245, 'finn');

		// add gravity to finn
		game.physics.arcade.enable(this.finn);
		this.finn.body.gravity.y = 800;

		// call jump func when spacebar hit
		var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);



		// create group
		this.gunters = game.add.group();
		// add physics
		this.gunters.enableBody = true;
		// create 20 gunters
		this.gunters.createMultiple(20, 'gunter');

		this.timer = game.time.events.loop(1500, this.addRowOfgunters, this);

		this.score = 0;

		this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#ffffff"});

	},

	// called 60 times per second - game logic!
	update: function() {
		// if finn out of world i.e. too high/low, call restart game
		if (this.finn.inWorld === false) {
			this.restartGame();
		}


		game.physics.arcade.overlap(this.finn, this.gunters, this.restartGame, null, this);
	},

	jump: function() {
		// add vertical velocity
		this.finn.body.velocity.y = -350;
	},

	restartGame: function() {
		// restart game - start at main state
		game.state.start('main');
	},

	addOnegunter: function(x,y) {
		// get first dead gunter
		var gunter = this.gunters.getFirstDead();

		// set new position of gunter
		gunter.reset(x,y);

		// add velocity to the gunter to make it move left
		gunter.body.velocity.x = -200;

		// kill gunter if not visible
		gunter.checkWorldBounds = true;
		gunter.outOfBoundsKill = true;
	},

	addRowOfgunters: function() {

		this.score += 1;
		this.labelScore.text = this.score;
		// pick where's hole
		var hole = Math.floor(Math.random() * 5) + 1;

		// add 6 gunters!
		for (var i = 0; i < 8; i++) {
			if (i !== hole && i !== hole + 1) {
				this.addOnegunter(400, i*60+10);
			}
		}
	}

};

game.state.add('main', mainState);
game.state.start('main');
