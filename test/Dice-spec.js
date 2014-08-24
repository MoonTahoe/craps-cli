var Die = require('../lib/Dice').Die,
    Dice = require('../lib/Dice').Dice,
    should = require('should');

var die, dice;

describe('Die', function() {

    it('should be created', function() {

        die = new Die();
        die.faces.should.equal(6);

        die = new Die(8);
        die.faces.should.equal(8);

    });

    it('should be able to roll', function() {

        die = new Die();
        die.roll().should.be.below(7);

    });

});

describe('Dice', function() {

    it('should be created', function() {

        dice = new Dice();
        dice.die.length.should.equal(2);

        dice = new Dice(3);
        dice.die.length.should.equal(3);

    });

    it('should be able to roll', function() {

        dice = new Dice(3);
        dice.roll().total.should.be.below(18);

    });

    it('should save a roll history', function() {

        dice = new Dice(3);
        dice.roll();
        dice.roll();
        dice.roll();

        dice.history.length.should.equal(3);

    });

});