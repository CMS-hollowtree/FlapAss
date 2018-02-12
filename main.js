// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds

        // load bird sprite
        game.load.image('bird', 'assets/bird.png');

        // load pipes
        game.load.image('pipe', 'assets/pipe.png');

        // load background
        game.load.image('mountains-back', 'assets/mountains-back.png');
        game.load.image('mountains-mid1', 'assets/mountains-mid1.png');
        game.load.image('mountains-mid2', 'assets/mountains-mid2.png');
    },

    create: function() { 
        // This function is called after the preload function     
        // score
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });   
        // Here we set up the game, display sprites, etc.  
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // background color
        game.stage.backgroundColor = '#697e96';

        mountainsBack = game.add.tileSprite(0,
            game.height - game.cache.getImage('mountains-back').height+200,
            game.width,
            game.cache.getImage('mountains-back').height,
            'mountains-back'
        );

        mountainsMid1 = game.add.tileSprite(0,
            game.height - game.cache.getImage('mountains-mid1').height+200,
            game.width,
            game.cache.getImage('mountains-mid1').height,
            'mountains-mid1'
        );

        mountainsMid2 = game.add.tileSprite(0,
            game.height - game.cache.getImage('mountains-mid2').height+200,
            game.width,
            game.cache.getImage('mountains-mid2').height,
            'mountains-mid2'
        );

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // gravity 
        this.bird.body.gravity.y = 1000;

        // jump when spacebar
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        // pipes group
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 

    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic 
        if(this.game.input.activePointer.isDown){
            this.jump();
        }
        //scroll the background
        mountainsBack.tilePosition.x -= 0.05;
        mountainsMid1.tilePosition.x -= 0.3;
        mountainsMid2.tilePosition.x -= 0.75;

        // if bird is out of view restart game
        if(this.bird.y < 0 || this.bird.y > 490) {
            this.restartGame();
        } 
        // if collision restart 
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);

    },

// extra functions

    jump: function(){
        this.bird.body.velocity.y = -350;
    },

    addOnePipe: function(x,y) {
        // create pipe at x,y
        var pipe = game.add.sprite(x,y,'pipe');
        // add to pipe group
        this.pipes.add(pipe);
        // enable physics
        game.physics.arcade.enable(pipe);
        // move pipe left
        pipe.body.velocity.x = -200;
        // kill pipe when not visable
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;

    },

    addRowOfPipes: function() {
        // ran num 1-5 for hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        this.score += 1;
        this.labelScore.text = this.score;  

        // add 6 pipes
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);
    },

    restartGame: function(){
        game.state.start('main');
    }
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');