"use strict";

const cells = [...document.querySelectorAll(".cell")];
const statusText = document.querySelector("#status");
const turnMark = document.querySelector("#turn-mark");
const hint = document.querySelector("#hint");
const roundLabel = document.querySelector("#round");
const xCard = document.querySelector("#x-card");
const oCard = document.querySelector("#o-card");
const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let board = Array(9).fill(null);
let currentPlayer = "X";
let finished = false;
let round = 1;
const scores = { X: 0, O: 0, draw: 0 };

function updateScores() {
  document.querySelector("#x-score").textContent = scores.X;
  document.querySelector("#o-score").textContent = scores.O;
  document.querySelector("#draw-score").textContent = scores.draw;
}

function updateTurn() {
  statusText.textContent = `Player ${currentPlayer}’s turn`;
  turnMark.className = `small-mark ${currentPlayer.toLowerCase()}-mark`;
  turnMark.style.color = currentPlayer === "O" ? "var(--orange)" : "var(--ink)";
  xCard.classList.toggle("active", currentPlayer === "X");
  oCard.classList.toggle("active", currentPlayer === "O");
}

function play(index) {
  if (finished || board[index]) return;
  board[index] = currentPlayer;
  const cell = cells[index];
  const mark = document.createElement("span");
  mark.className = `mark ${currentPlayer.toLowerCase()}-mark`;
  mark.setAttribute("aria-hidden", "true");
  cell.append(mark);
  cell.classList.add(`${currentPlayer.toLowerCase()}-cell`);
  cell.disabled = true;
  cell.setAttribute(
    "aria-label",
    `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, ${currentPlayer}`,
  );

  const wins = winningLines.filter((line) =>
    line.every((position) => board[position] === currentPlayer),
  );
  if (wins.length) {
    finished = true;
    scores[currentPlayer] += 1;
    wins.flat().forEach((position) => cells[position].classList.add("winner"));
    statusText.textContent = `Player ${currentPlayer} wins!`;
    hint.textContent = "Three in a row. Nicely played! Ready for a rematch?";
  } else if (board.every(Boolean)) {
    finished = true;
    scores.draw += 1;
    statusText.textContent = "It’s a draw!";
    turnMark.className = "small-mark";
    hint.textContent = "Great minds think alike. Let’s try that again.";
  }
  if (finished) {
    cells.forEach((square) => {
      square.disabled = true;
    });
    xCard.classList.remove("active");
    oCard.classList.remove("active");
    updateScores();
    document.querySelector("#new-round").focus({ preventScroll: true });
    return;
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurn();
}

function startRound(reset = false) {
  round = reset ? 1 : round + 1;
  board = Array(9).fill(null);
  currentPlayer = "X";
  finished = false;
  cells.forEach((cell, index) => {
    cell.replaceChildren();
    cell.className = "cell";
    cell.disabled = false;
    cell.setAttribute(
      "aria-label",
      `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, empty`,
    );
  });
  roundLabel.textContent = String(round).padStart(2, "0");
  hint.textContent = "Pick a square. Make your mark.";
  updateTurn();
}

cells.forEach((cell, index) =>
  cell.addEventListener("click", () => play(index)),
);
document
  .querySelector("#new-round")
  .addEventListener("click", () => startRound());
document
  .querySelector("#help-button")
  .addEventListener("click", () =>
    document.querySelector("#help-dialog").showModal(),
  );
document
  .querySelector("#reset-button")
  .addEventListener("click", () =>
    document.querySelector("#reset-dialog").showModal(),
  );
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () =>
    document.getElementById(button.dataset.close).close(),
  );
});
document.querySelector("#confirm-reset").addEventListener("click", () => {
  scores.X = 0;
  scores.O = 0;
  scores.draw = 0;
  updateScores();
  startRound(true);
  document.querySelector("#reset-dialog").close();
});
