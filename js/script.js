"use strict";

var params = {
  roundsNumber: null,
  roundsPlayed: 0,
  gameActive: true,
  computerWins: 0,
  playerWins: 0,
  progress: [],
  playerName: "You"
};

// providing game's output
var output = document.getElementById("output");
function displayText(text) {
  output.innerHTML = text + "<br>";
}
// providing game's result
var result = document.getElementById("result");
var displayResult = function() {
  result.innerHTML =
    "<p>" +
    params.playerName +
    " vs. Computer</p><p><strong>" +
    params.playerWins +
    "</strong> - <strong>" +
    params.computerWins +
    "</strong></p>";
};
displayResult();

// when game is no longer active
function inactiveGameDisplay() {
  displayText("Game over, please press the new game button!");
}

// Buttons allowing player to chose a move
var playerMoves = document.querySelectorAll(".player-move");
for (var i = 0; i < playerMoves.length; i++) {
  playerMoves[i].addEventListener("click", function() {
    var playerMoveChoice = this.getAttribute("data-move");
    if (params.gameActive) {
      // invoking playerMove function with a payer's choice parameter
      playerMove(playerMoveChoice);
    } else {
      inactiveGameDisplay();
    }
  });
}

// Computer move function randomizing the move
function computerMove() {
  var computerMoveRandom = Math.floor(Math.random() * 5) + 1;
  switch (computerMoveRandom) {
    case 1:
      return "rock";
    case 2:
      return "paper";
    case 3:
      return "scissors";
    case 4:
      return "spock";
    case 5:
      return "lizard";
  }
}

// determining who won the round
function determiningWinner(playerMoveChosen, computerMoveChoice) {
  if (playerMoveChosen === computerMoveChoice) {
    return "Noone";
  } else if (
    (playerMoveChosen === "paper" && computerMoveChoice === "rock") ||
    (playerMoveChosen === "rock" && computerMoveChoice === "scissors") ||
    (playerMoveChosen === "scissors" && computerMoveChoice === "paper") ||
    (playerMoveChosen === "rock" && computerMoveChoice === "lizard") ||
    (playerMoveChosen === "lizard" && computerMoveChoice === "spock") ||
    (playerMoveChosen === "spock" && computerMoveChoice === "scissors") ||
    (playerMoveChosen === "scissors" && computerMoveChoice === "lizard") ||
    (playerMoveChosen === "lizard" && computerMoveChoice === "paper") ||
    (playerMoveChosen === "paper" && computerMoveChoice === "spock") ||
    (playerMoveChosen === "spock" && computerMoveChoice === "rock")
  ) {
    params.playerWins++;
    return params.playerName;
  } else {
    params.computerWins++;
    return "Computer";
  }
}
//
function createProgressTable() {
  var progressTableContent = "";
  for (var i = 0; i < params.progress.length; i++) {
    progressTableContent +=
      "<tr><td>" +
      params.progress[i].round +
      "</td><td>" +
      params.progress[i].winner +
      "</td><td>" +
      params.progress[i].playerMove +
      "</td><td>" +
      params.progress[i].computerMove +
      "</td><td>" +
      params.progress[i].roundResult +
      "</td></tr>";
  }

  var progressTableHeading =
    "<table><tr><th>Round</th><th>Winner</th><th>Player Move</th><th>Computer Move</th><th>Round Result</th></tr>";
  var progressTable = progressTableHeading + progressTableContent + "</table>";
  return progressTable;
}
// game mechanics invoked after player's choice
function playerMove(playerMoveChosen) {
  var computerMoveChoice = computerMove();
  var gameResult = determiningWinner(playerMoveChosen, computerMoveChoice);
  displayResult();
  params.roundsPlayed++;
  var roundResultProgress = {
    round: params.roundsPlayed,
    winner: gameResult,
    playerMove: playerMoveChosen,
    computerMove: computerMoveChoice,
    roundResult: params.playerWins + " : " + params.computerWins
  };
  params.progress.push(roundResultProgress);

  var gameResultText =
    " Round " +
    params.roundsPlayed +
    ": <strong>" +
    gameResult +
    "</strong> won." +
    params.playerName +
    " played <strong>" +
    playerMoveChosen +
    "</strong>, computer played <strong>" +
    computerMoveChoice +
    "</strong> ";
  if (
    params.playerWins === params.roundsNumber ||
    params.computerWins === params.roundsNumber
  ) {
    var progressTable = createProgressTable();
    var winner = gameResult.toUpperCase();
    var modalContent =
      "<p>" + winner + " WON THE ENTIRE GAME!!!</p>" + progressTable;
    var modalToBeDisplayed = "#modal-game-over";
    addModalContent(modalToBeDisplayed, modalContent);
    showModal(modalToBeDisplayed);
    params.gameActive = false;
    displayText(gameResultText);
  } else {
    displayText(gameResultText);
  }
}

// new game button starting a game consisting of a number of game provided by player
var newGame = document.getElementById("newGame"),
  rounds = document.getElementById("rounds");

newGame.addEventListener("click", function() {
  params.playerWins = 0;
  params.computerWins = 0;
  params.roundsPlayed = 0;
  params.progress = [];
  displayResult();
  displayText(
    "Here you will see the results of each play against the computer."
  );
  showModal("#modal-new-game");
});

// getting new game params
var submitNewGame = document.getElementById("submit-new-game");

submitNewGame.addEventListener("click", function() {
  event.preventDefault();
  hideModal(event);
  //get player name
  var playerInputName = document.getElementById("inputName").value;

  if (playerInputName === null || playerInputName === "") {
    params.playerName = "You";
  } else {
    params.playerName = playerInputName;
    displayResult();
  }

  // get rounds number
  var roundsInput = document.getElementById("inputRounds").value;
  if (roundsInput === null || roundsInput === "") {
    rounds.innerHTML = "You didn't provide a value";
  } else if (isNaN(roundsInput)) {
    rounds.innerHTML = "The value you provided is not a number";
  } else if (parseInt(roundsInput) <= 0) {
    rounds.innerHTML =
      "The value you provided is not a possible number of rounds";
  } else {
    params.gameActive = true;
    params.roundsNumber = parseInt(roundsInput);

    rounds.innerHTML =
      "The game will end after <strong>" +
      params.roundsNumber +
      "</strong> wins";
  }
});

// remove "show" class from all modals
function hideAllModals() {
  for (var i = 0; i < modals.length; i++) {
    modals[i].classList.remove("show");
  }
}

// function adding modal content
var addModalContent = function(modalId, modalContentToBeAdded) {
  var modalChanged = document.querySelector(modalId);
  modalChanged.querySelector(".content").innerHTML = modalContentToBeAdded;
};

// function opening modal
var showModal = function(modalToBeShown) {
  hideAllModals();
  document.querySelector(modalToBeShown).classList.add("show");
  document.querySelector("#modal-overlay").classList.add("show");
};

// closing modals removing overlay display
var hideModal = function(event) {
  event.preventDefault();
  document.querySelector("#modal-overlay").classList.remove("show");
};

var closeButtons = document.querySelectorAll(".modal .close");

for (var i = 0; i < closeButtons.length; i++) {
  closeButtons[i].addEventListener("click", hideModal);
}

// closing by clicking overlay
document.querySelector("#modal-overlay").addEventListener("click", hideModal);

// stopping propagation in overlay
var modals = document.querySelectorAll(".modal");

for (var i = 0; i < modals.length; i++) {
  modals[i].addEventListener("click", function(event) {
    event.stopPropagation();
  });
}
