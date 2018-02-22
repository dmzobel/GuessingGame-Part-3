function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
  return Math.floor((Math.random() * 100) + 1);
}

function newGame() {
  return new Game;
}

function shuffle(array) {
  var m = array.length;
  var t;
  var i;
  // While there remain elements to shuffle...
  while (m) {
    // Pick a remaining element...
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

Game.prototype.playersGuessSubmission = function(num) {
  if (num < 1 || num > 100 || typeof num !== 'number') {
    throw 'That is an invalid guess.';
  }
  this.playersGuess = num;
  return this.checkGuess.call(this);
}

Game.prototype.checkGuess = function() {
  if (this.pastGuesses.includes(this.playersGuess)) {
    return 'You have already guessed that number.';
  }
  else {
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);

    if (this.playersGuess === this.winningNumber) {
      $('#submit, #hint').prop('disabled', true);
      $('#subtitle').text('Congratulations!');
      return 'You Win!';
    }
    else if (this.pastGuesses.length === 5) {
      $('#submit, #hint').prop('disabled', true);
      $('#subtitle').text('Click the Reset button to try again!');
      return 'You Lose.';
    }
    else {
      if (this.isLower()) {
        $('#subtitle').text('Guess Higher!');
      } else {
        $('#subtitle').text('Guess Lower!');
      }

      if (this.difference() < 10) {
        return 'You\'re burning up!';
      } else if (this.difference() < 25) {
        return 'You\'re lukewarm.';
      } else if (this.difference() < 50) {
        return 'You\'re a bit chilly.';
      } else {
        return 'You\'re ice cold!';
      }
    }
  }
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.provideHint = function() {
  var hintArr = [];
  hintArr.push(this.winningNumber, generateWinningNumber(), generateWinningNumber());
  return shuffle(hintArr);
}

function makeAGuess(game) {
  var guess = +$('#player-input').val();
  $('#player-input').val('');
  var returnVal = game.playersGuessSubmission(guess);
  $('#title').text(returnVal);
}

$(document).ready(function() {
  var game = new Game;

  $('#submit').click(function() {
    makeAGuess(game);
  });

  $('#player-input').keypress(function(event) {
    if (event.which == 13) { // if the player presses 'enter' instead of clicking 'Go!'
      makeAGuess(game);
    }
  });

  $('#hint').click(function() {
    var hints = game.provideHint()
    $('#title').text('The winning number is one of the following:');
    $('#subtitle').text(hints);
  });

  $('#reset').click(function() {
    game = newGame();
    $('#title').text('Guessing Game');
    $('#subtitle').text('Guess a number between 1 and 100!')
    $('.guess').text('-');
    $('#submit, #hint').prop('disabled', false);
  });
});