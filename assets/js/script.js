/*
let container = document.querySelector("#board-container");
let cell = document.querySelector("[data-cell]");

let boardState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
*/

/*=======
variables 
=======*/
const orangeClass = "orange";
const blueClass = "blue";
const winCombinations = [
  // horizontals //
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // verticals //
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals //
  [0, 4, 8],
  [2, 4, 6],
];
const boardCells = document.querySelectorAll("[data-cell]");
const boardContainer = document.querySelector("#board-container");
const winTextContainer = document.querySelector("[data-win-text-container]");
const winContainer = document.querySelector("#win-container");
const restartButton = document.querySelector("#restart-button");

let boardState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let boardHistory = [];
let historyClone = boardHistory;
let orangeTurn;

/*========================
function for starting game
========================*/
function startGame() {
  /*==============================
  event listener for clicking cell 
  ==============================*/
  orangeTurn = false;
  boardCells.forEach((cell) => {
    cell.classList.remove(orangeClass);
    cell.classList.remove(blueClass);
    cell.classList.remove("end-game");
    cell.removeEventListener("click", clickOnce);
    // resets the board when restart button is clicked //

    cell.addEventListener("click", clickOnce, { once: true });
    // once : true --> cell can only be clicked once //
  });
  showCurrentClassHoverStyles();
  winContainer.classList.remove("show");
}

function clickOnce(e) {
  /*=================
  place player's move 
  =================*/
  const cell = e.target;
  const currentClass = orangeTurn ? orangeClass : blueClass;
  // if orangeTurn = true, currentClass = orangeClass, else, = blueClass //
  placePlayerMove(cell, currentClass);
  updateBoardState(cell);
  updateHistory();
  console.log(boardState);
  console.log(boardHistory);

  if (checkWin(currentClass)) {
    /*===========
    check for win 
    ===========*/
    endGame(false);
    boardCells.forEach((cell) => {
      cell.classList.add("end-game");
    });

    /*============
    check for draw 
    ============*/
  } else if (checkDraw()) {
    endGame(true);
    boardCells.forEach((cell) => {
      cell.classList.add("end-game");
    });

    /*==========
    switch turns 
    ==========*/
  } else {
    switchTurns();
    showCurrentClassHoverStyles();
  }
}

/*======================
functions for game logic 
======================*/
function placePlayerMove(cell, currentClass) {
  cell.classList.add(currentClass);
}

function switchTurns() {
  orangeTurn = !orangeTurn;
}

function showCurrentClassHoverStyles() {
  boardContainer.classList.remove(blueClass);
  boardContainer.classList.remove(orangeClass);

  if (orangeTurn) {
    boardContainer.classList.add(orangeClass);
  } else {
    boardContainer.classList.add(blueClass);
  }
}

function checkWin(currentClass) {
  return winCombinations.some((combinations) => {
    return combinations.every((index) => {
      return boardCells[index].classList.contains(currentClass);
    });
  });
}

function endGame(draw) {
  if (draw) {
    winTextContainer.innerText = `Draw!`;
  } else {
    winTextContainer.innerText = `${orangeTurn ? "Orange" : "Blue"} wins!`;
  }
  winContainer.classList.add("show");
}

function checkDraw() {
  return [...boardCells].every((cell) => {
    return (
      cell.classList.contains(orangeClass) || cell.classList.contains(blueClass)
    );
  });
}

/*==========================
functions for history states 
==========================*/
function updateBoardState(a) {
  let index = [...boardCells].indexOf(a);
  let y = Math.floor(index / 3);
  let x = index % 3;
  if (orangeTurn) {
    boardState[y][x] = orangeClass;
  } else {
    boardState[y][x] = blueClass;
  }
  return boardState;
}

function updateHistory() {
  boardHistory.push(JSON.parse(JSON.stringify(boardState)));
}

startGame();
restartButton.addEventListener("click", startGame);
