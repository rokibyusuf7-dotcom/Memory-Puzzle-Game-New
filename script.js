let level = parseInt(localStorage.getItem("level")) || 1;
let moves = 0;
let timer = 0;
let timerInterval;
let soundEnabled = JSON.parse(localStorage.getItem("sound")) || false;
let timerEnabled = JSON.parse(localStorage.getItem("timer")) || false;
let theme = localStorage.getItem("theme") || "Light";
let musicEnabled = JSON.parse(localStorage.getItem("music")) || false;
let playerName = localStorage.getItem("playerName") || "";

const emojis = ["😀","😎","😍","🤖","🐱","🐶","🍕","⚽","👽","👻","🌟","🔥","🎮","❤️"];
let cards = [];
let firstCard, secondCard;
let lock = false;

document.body.className = theme === "Dark" ? "dark" : "";

const bgMusic = document.getElementById("bgMusic");
if (musicEnabled) bgMusic.play();

function askPlayerName() {
  if (!playerName) {
    playerName = prompt("Enter your player name:");
    localStorage.setItem("playerName", playerName);
  }
  document.getElementById("playerNameDisplay").textContent = "Player: " + playerName;
}

function generateCards() {
  const pairs = Math.min(level + 2, emojis.length);
  cards = [];
  for (let i = 0; i < pairs; i++) {
    cards.push(emojis[i], emojis[i]);
  }
  cards.sort(() => Math.random() - 0.5);
}

function startGame() {
  const game = document.getElementById("game");
  game.innerHTML = "";
  generateCards();
  moves = 0;
  updateHUD();
  if (timerEnabled) startTimer();

  cards.forEach(emoji => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.addEventListener("click", flipCard);
    game.appendChild(card);
  });
}

function flipCard() {
  if (lock || this === firstCard) return;
  this.textContent = this.dataset.emoji;
  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    moves++;
    checkMatch();
  }
}

function checkMatch() {
  lock = true;
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard = null;
    secondCard = null;
    lock = false;
    checkWin();
  } else {
    setTimeout(() => {
      firstCard.textContent = "";
      secondCard.textContent = "";
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      firstCard = null;
      secondCard = null;
      lock = false;
    }, 800);
  }
}

function checkWin() {
  if ([...document.querySelectorAll(".card")].every(c => c.textContent)) {
    clearInterval(timerInterval);
    document.getElementById("results").textContent = 
      `Player: ${playerName} | Time: ${timer}s | Moves: ${moves}`;
    document.getElementById("winOverlay").style.display = "flex";
    level = Math.min(level + 1, 100);
    localStorage.setItem("level", level);
  }
}

function updateHUD() {
  document.getElementById("level").textContent = "Level: " + level;
  document.getElementById("moves").textContent = "Moves: " + moves;
  document.getElementById("time").textContent = "Time: " + timer + "s";
}

function startTimer() {
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    updateHUD();
  }, 1000);
}

document.getElementById("nextLevelBtn").onclick = () => {
  document.getElementById("winOverlay").style.display = "none";
  startGame();
};

document.getElementById("settingsBtn").onclick = () => {
  document.getElementById("settingsPopup").style.display = "flex";
};

document.getElementById("saveSettings").onclick = () => {
  timerEnabled = document.getElementById("timerToggle").checked;
  soundEnabled = document.getElementById("soundToggle").checked;
  musicEnabled = document.getElementById("musicToggle").checked;
  theme = document.getElementById("theme").value;

  localStorage.setItem("timer", timerEnabled);
  localStorage.setItem("sound", soundEnabled);
  localStorage.setItem("music", musicEnabled);
  localStorage.setItem("theme", theme);

  document.body.className = theme === "Dark" ? "dark" : "";
  document.getElementById("settingsPopup").style.display = "none";

  if (musicEnabled) bgMusic.play();
  else bgMusic.pause();
};

askPlayerName();
startGame();
