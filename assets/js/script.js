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

const chooseQuestion = document.querySelector("#h2");
const chooseContainer = document.querySelector("#choose-container");
const chooseBlue = document.querySelector("[data-choose-blue]");
const chooseOrange = document.querySelector("[data-choose-orange]");

const boardCells = document.querySelectorAll("[data-cell]");
const boardContainer = document.querySelector("#board-container");

const winTextContainer = document.querySelector("[data-win-text-container]");
const winContainer = document.querySelector("#win-container");

const restartButton = document.querySelector("#restart-button");
const undoButton = document.querySelector("#undo-button");
const redoButton = document.querySelector("#redo-button");

let boardState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let boardHistory = [];
let historyClone = boardHistory;

let orangeTurn;

/*=============
event listeners 
=============*/

chooseBlue.addEventListener("click", () => {
  orangeTurn = false;
  showBoard();
  startGame();
});

chooseOrange.addEventListener("click", () => {
  orangeTurn = true;
  showBoard();
  startGame();
});

undoButton.addEventListener("click", () => {
  if (boardHistory[boardHistory.length - 1] === historyClone[0]) {
    alert("pee");
    return;
  }

  reOrder(boardHistory, boardHistory.length - 1, 0);
  boardState = boardHistory[boardHistory.length - 1];

  changeState();
});

redoButton.addEventListener("click", () => {
  if (
    boardHistory[boardHistory.length - 1] ===
    historyClone[historyClone.length - 1]
  ) {
    alert("pee");
    return;
  }

  reOrder(boardHistory, 0, boardHistory.length - 1);
  boardState = boardHistory[boardHistory.length - 1];
  changeState();
});

restartButton.addEventListener("click", hideBoard);

/*==================================
function for choosing starting color
==================================*/
function showBoard() {
  chooseContainer.classList.add("opacity-toggle");
  chooseQuestion.classList.add("opacity-toggle");
  chooseContainer.classList.remove("remove-opacity-toggle");
  chooseQuestion.classList.remove("remove-opacity-toggle");
  setTimeout(() => chooseContainer.classList.add("hide-toggle"), 500);
  setTimeout(() => chooseQuestion.classList.add("hide-toggle"), 500);

  boardContainer.classList.add("show-board");
  boardContainer.classList.remove("remove-opacity-board");
  setTimeout(() => boardContainer.classList.add("opacity-board"), 500);
}

/*================================================
function for going back to choosing starting color
================================================*/
function hideBoard() {
  boardContainer.classList.add("remove-opacity-board");
  boardContainer.classList.remove("opacity-board");
  setTimeout(() => boardContainer.classList.remove("show-board"), 500);

  winContainer.classList.add("remove-opacity-win");
  winContainer.classList.remove("opacity-win");
  setTimeout(() => winContainer.classList.remove("show-win"), 500);

  setTimeout(() => chooseContainer.classList.remove("opacity-toggle"), 600);
  setTimeout(() => chooseQuestion.classList.remove("opacity-toggle"), 600);
  setTimeout(() => chooseContainer.classList.add("remove-opacity-toggle"), 600);
  setTimeout(() => chooseQuestion.classList.add("remove-opacity-toggle"), 600);
  setTimeout(() => chooseContainer.classList.remove("hide-toggle"), 500);
  setTimeout(() => chooseQuestion.classList.remove("hide-toggle"), 500);
}

/*========================
function for starting game
========================*/
function startGame() {
  /*==============================
  event listener for clicking cell 
  ==============================*/
  boardCells.forEach((cell) => {
    boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    boardHistory = [];
    changeState();

    cell.classList.remove(orangeClass);
    cell.classList.remove(blueClass);
    cell.classList.remove("end-game");
    cell.removeEventListener("click", clickOnce);
    // resets the board when restart button is clicked //

    cell.addEventListener("click", clickOnce, { once: true });
    // once : true --> cell can only be clicked once //
  });
  showCurrentClassHoverStyles();
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
  winContainer.classList.add("show-win");
  winContainer.classList.remove("remove-opacity-win");
  setTimeout(() => winContainer.classList.add("opacity-win"), 1);
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
  historyClone = [...boardHistory];
}

function changeState() {
  boardCells.forEach((cell) => {
    cell.classList.remove(orangeClass);
    cell.classList.remove(blueClass);

    let index = [...boardCells].indexOf(cell);
    let y = Math.floor(index / 3);
    let x = index % 3;

    if (boardState[y][x] != "") {
      cell.classList.add(boardState[y][x]);
    }
  });
}

function reOrder(arr, from, to) {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
}
