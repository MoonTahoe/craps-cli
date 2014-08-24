/* global Die */

/**
 * A set of dice
 * @example
 *
 *      var d = new Dice();   // Creates a set of 2 six sided dice
 *      var d3 = new Dice(3)  // Creates a set of 3 six sided dice
 *
 * @class Dice
 * @param count {number} the amount of d
 * @constructor
 *
 */
function Dice(count) {
    var i;

    count = count || 2;

    /**
     * An array of die in this current dice set
     * @property die
     * @type {Array}
     */
    this.die = [];

    /**
     * The history of rolls with this dice set
     * @property
     * @type {Array}
     */
    this.history = [];

    for (i = 0; i < count; i++) {
        this.die.push(new Die());
    }
}

/**
 * Rolls the current set of dice
 * @method roll
 * @returns {{total: number, rolls: Array}} An info object that contains the total and value of each die
 */
Dice.prototype.roll = function () {
    var results = {
        total: null,
        rolls: []
    };

    this.die.forEach(function (die) {
        results.rolls.push(die.roll());
    });

    results.total = results.rolls.reduce(function (prev, next) {
        return prev + next;
    });

    this.history.push(results);

    return results;
};

/**
 * A single die
 * @param faces {number} the number of faces that the the die has
 * @class Die
 * @constructor
 */
function Die(faces) {
    /**
     * The number of sides that this die contains
     * @property
     * @type {number}
     */
    this.faces = faces || 6;
}

/**
 * Rolls the single die and returns the result
 * @method roll
 * @returns {number} the result from rolling this die
 */
Die.prototype.roll = function () {
    return Math.ceil(Math.random() * this.faces);
};

/**
 * A module that contains classes for managing dice
 * @module Dice
 */
exports.Dice = Dice;
exports.Die = Die;