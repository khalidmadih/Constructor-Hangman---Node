// Function to check if the letter exists in the random word

function checkForLetter(letter, word){
  if(word.indexOf(letter) != -1){
    return true;
  }
  else{
    return false;
  }

}

// Exporting the function
module.exports = checkForLetter;