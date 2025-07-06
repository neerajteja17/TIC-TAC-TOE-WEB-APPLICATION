const board = document.getElementById('gameBoard');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');

let currentPlayer = 'X'; // Human always starts
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleCellClick(index) {
  if (!gameActive || gameState[index] !== "") return;

  gameState[index] = currentPlayer;
  renderBoard();
  if (checkResult()) return;

  currentPlayer = 'O'; // AI's turn
  statusText.innerText = `AI's Turn`;
  setTimeout(aiMove, 500);
}

function aiMove() {
  if (!gameActive) return;

  let available = gameState.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
  if (available.length === 0) return;

  let aiChoice = available[Math.floor(Math.random() * available.length)];
  gameState[aiChoice] = 'O';
  renderBoard();

  if (checkResult()) return;

  currentPlayer = 'X';
  statusText.innerText = `Your Turn (X)`;
}

function renderBoard() {
  board.innerHTML = '';
  gameState.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.innerText = cell;
    cellDiv.addEventListener('click', () => handleCellClick(index));
    board.appendChild(cellDiv);
  });
}

function checkResult() {
  let roundWon = false;
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    showPopup(`${currentPlayer} Wins!`);
    gameActive = false;
    return true;
  }

  if (!gameState.includes("")) {
    showPopup(`It's a Draw!`);
    gameActive = false;
    return true;
  }

  return false;
}

function showPopup(message) {
  popupMessage.innerText = message;
  popup.style.display = 'flex';
}

function closePopup() {
  popup.style.display = 'none';
  resetGame();
}

function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusText.innerText = `Your Turn (X)`;
  renderBoard();
}

resetButton.addEventListener('click', resetGame);
renderBoard();
statusText.innerText = `Your Turn (X)`;