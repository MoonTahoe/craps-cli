var Craps = require('./craps').Craps,
    readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function start(game) {

    console.log('Cash $' + game.pot);
    rl.question('Bet: $', function(bet) {

        try {
            bet = parseInt(bet);
        } catch (err) {
            console.log(err);
            console.log('Whoops... your bet must be a number');
            start(game);
            return;
        }

        game.bet(bet);

    });

}

var game = new Craps(100, 1000);

game.on('error', function(message) {

    console.log('Whoops... ' + message);
    start(this);

});

game.on('come out', function(roll) {
    console.log('come out!!!');
    this.emit('roll', roll);
});

game.on('roll', function(roll) {
    console.log('roll: ' + roll.total + " | " + roll.rolls[0] + 'x' + roll.rolls[1]);
});

game.on('win', function() {
    console.log("YOU WIN!!!");
    start(game);
});

game.on('loose', function() {
    console.log("YOU LOOSE!!!");

    if (game.pot <= 0) {
        process.exit();
    } else {
        start(game);
    }

});

start(game);

console.log("Welcome to the craps table!");