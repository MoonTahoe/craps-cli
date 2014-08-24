var emitter = require('events').EventEmitter,
    Dice = require('./dice').Dice;

/**
 * A Game of Craps
 * @example
 *
 *      var game = new Craps(100, 1000);  // Creates a new craps game with $100 and a delay of 1 second
 *
 *      // Add Event handler for a win
 *      game.on('win', function(result) {
 *           console.log('YOU WIN!!! ' + result);
 *       });
 *
 *      // Add Event handler for a loose
 *      game.on('loose', function(result) {
 *          console.log('YOU Loose!!! ' + result);
 *      });
 *
 *      game.bet(20);                    // Bets $20 and starts the game
 *
 * @class Craps
 * @extends {events.EventEmitter}
 * @param pot {number} The initial amount of money that a player has
 * @param delay {number} The amount of milliseconds to wait between rolls
 * @constructor
 */
function Craps(pot, delay) {

    /**
     * The current amount of money that the player has
     * @property pot
     * @type {number}
     */
    this.pot = pot || 100;

    /**
     * The current game delay in milliseconds
     * @property delay
     * @type {number}
     */
    this.delay = delay || 1000;

    /**
     * The amount betted on the curren round
     * @property currentBet
     * @type {number}
     */
    this.currentBet = 0;

    /**
     * The game dice
     * @property dice
     * @type {Dice}
     */
    this.dice = new Dice();
}

Craps.prototype = new emitter();

/**
 * Places a bet and starts the game play
 * @method
 * @param amount {number} The amount of money to bet on the current round
 */
Craps.prototype.bet = function (amount) {

    if (typeof amount !== 'number') {
        this.emit('error', 'bet not valid');
        return;
    } else if (amount > this.pot) {
        this.emit('error', 'bet cannot bet more than $' + this.pot);
        return;
    } else if (amount < 0) {
        this.emit('error', 'you have to bet some amount');
        return;
    }

    this.pot -= amount;
    this.currentBet = amount;

    this.comeOut();
};

/**
 * The first roll of the game
 * @mothod
 */
Craps.prototype.comeOut = function () {

    var natural = [7, 11],
        crappingOut = [2, 3, 12],
        win,
        loose,
        self = this;

    if (this.currentBet <= 0) {

        /**
         * Fired when a error occurs
         * @event error
         * @param message {String} the error message
         */
        this.emit('error', 'cannot start game until a bet has been made');
        return;
    }

    this.lastRoll = this.dice.roll();

    /**
     * Fired when the come out roll had been made
     * @event error
     * @param results {{total: number, rolls: Array}} An info object that contains the total and value of each die
     */
    this.emit('come out', this.lastRoll);

    win = natural.filter(function (num) {
        return num === self.lastRoll.total;
    });

    if (win.length > 0) {
       this.end(true, 'natural win');
    } else {

        loose = crappingOut.filter(function (num) {
            return num === self.lastRoll.total;
        });

        if (loose.length > 0) {
            this.end(false, 'crapped out');
        } else {
            this.point = this.lastRoll;
            setTimeout(function() {
                self.play();
            }, this.delay);
        }

    }

};

/**
 * Any additional roll after the comeOut roll is handled by this function
 * @method
 */
Craps.prototype.play = function () {

    var self = this;

    this.lastRoll = this.dice.roll();

    /**
     * Fired when a roll occurs
     * @event roll
     * @param results {{total: number, rolls: Array}} An info object that contains the total and value of each die
     */
    this.emit('roll', this.lastRoll);

    if (this.lastRoll.total === 7) {
        this.end(false, 'crapped out');
    } else if (this.lastRoll.total === this.point.total) {
        this.end(true, 'hit point');
    } else {
        setTimeout(function() {
            self.play();
        }, this.delay);
    }

};

/**
 * Handles the end of the game
 * @param win {Boolean} weather or not the user has won the game
 * @param how {String} A message representing how the game was won or loss
 */
Craps.prototype.end = function (win, how) {

    if (win) {
        this.pot += this.currentBet * 2;

        /**
         * Fired when the user wins the round
         * @event win
         * @param how {String} A message about how the game was won
         */
        this.emit('win', how);

    } else {

        /**
         * Fired when the user looses the round
         * @event loose
         * @param how {String} A message about how the game was loss
         */
        this.emit('loose', how);

    }

    this.currentBet = null;
    this.point = null;
    this.lastRoll = null;

};

/**
 * A module that contains the code necessary for a craps game
 * @module Craps
 * @type {Craps}
 */
exports.Craps = Craps;
