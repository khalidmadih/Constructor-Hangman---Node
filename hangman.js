// Linking packages and files
var inquirer = require('inquirer');

// Link the filr with the list of actor names
var guessWordList = require('./words.js');

// Link the function to test if the letter exists
var checkForLetter = require('./check.js');

// Link the function that displays the letters
var lettersToDisplay = require('./letters.js');


// Declaring some global variables
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var lettersAlreadyGuessed = [];
var lettersCorrectlyGuessed = [];
var displayHangman;


// Creating the game object
var game = {

    wordBank: guessWordList, // import the list of words
    guessesRemaining: 12, // Number of guesses
    currentWrd: null, // Current word variable


    startGame: function() {
        // make sure the user has 12 guesses
        this.guessesRemaining = 12;

        // assigning a random word from the array to 'currentWrd' variable
        var j = Math.floor(Math.random() * this.wordBank.length);
        this.currentWrd = this.wordBank[j];

        // Inform User game has begun
        console.log("Let's test your knowledge of the actors of the Game of Thrones");

        // Replacing the word to be guessed letters by "_"
        displayHangman = new lettersToDisplay(this.currentWrd);
        displayHangman.parseDisplay();
        console.log('Number of tries Left: ' + game.guessesRemaining);

        // prompt for a letter
        keepPromptingUser();
    }

};


function keepPromptingUser() {

    // Always make a gap between inputs
    console.log('');

    // If enough guesses left, then prompt for new letter
    if (game.guessesRemaining > 0) {
        inquirer.prompt([{
            type: "value",
            name: "letter",
            message: "Guess a Letter: "
        }]).then(function(userInput) {

            // Collect Letter Input
            var inputLetter = userInput.letter.toLowerCase();

            // Validate the input
            if (alphabet.indexOf(inputLetter) == -1) {

                // Tell user they did not guess a letter
                console.log('Try again, "' + inputLetter + '" is not a letter.');
                console.log('Guesses Left: ' + game.guessesRemaining);
                console.log('Letters already guessed: ' + lettersAlreadyGuessed);
                keepPromptingUser();

            } else if (alphabet.indexOf(inputLetter) != -1 && lettersAlreadyGuessed.indexOf(inputLetter) != -1) {

                // Tell user they already guessed that letter
                console.log('Nope! You already guessed "' + inputLetter + '". Try another letter!');
                console.log('Guesses Left: ' + game.guessesRemaining);
                console.log('Letters already guessed: ' + lettersAlreadyGuessed);
                keepPromptingUser();

            } else {

                // Remove the entry from the list of possible inputs
                lettersAlreadyGuessed.push(inputLetter);


                // Check for the letter in the word
                var letterInWord = checkForLetter(inputLetter, game.currentWrd);

                // If the letter is in the word, update the letter object
                if (letterInWord) {

                    // Add to correct letters list
                    lettersCorrectlyGuessed.push(inputLetter);

                    // Show the empty letters ( _ _ _ _ ) and guesses, etc.
                    displayHangman = new lettersToDisplay(game.currentWrd, lettersCorrectlyGuessed);
                    displayHangman.parseDisplay();


                    // Test if the user has won
                    if (displayHangman.winner) {
                        console.log('You won! Congratulations, you are a Game of Thrones expert!');
                        return;
                    }
                    // Not a win yet, so ask for another input and decrement guesses
                    else {
                        console.log('Guesses Left: ' + game.guessesRemaining);
                        console.log('Letters already guessed: ' + lettersAlreadyGuessed);
                        keepPromptingUser();
                    }

                }
                // Otherwise, decrement guesses and re-prompt the old hangman object
                else {
                    game.guessesRemaining--;

                    displayHangman.parseDisplay();
                    console.log('Guesses Left: ' + game.guessesRemaining);
                    console.log('Letters already guessed: ' + lettersAlreadyGuessed);
                    keepPromptingUser();
                }

            }

        });

    }
    // If not enough guesses left, then user losses
    else {
        console.log('----------------------"END"------------------------');
        console.log('Sorry. I guess you\'re no expert of Game of Thrones');
        console.log('FYI. The actor we were looking for was "' + game.currentWrd + '".');
        console.log('---------------------------------------------------');
    }

}

// Create a new game object using the constructor and begin playing
game.startGame();