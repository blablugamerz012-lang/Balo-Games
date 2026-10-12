/*
  EVO-GAMES HUB
  Game list
*/

const games = [

  {
    id: "my-gun-life",
    title: "My Gun Life",
    icon: "⚡",
    category: "action",
    path: "games/my-gun-life/index.html"
  },

  {
    id: "tik-tak-toe",
    title: "TIK TAK TOE",
    icon: "❌⭕",
    desc: "Classic Tic Tac Toe",
    category: "arcade",
    path: "games/tik-tak-toe/index.html"
  },

  {
    id: "evo-eater",
    title: "Evo-Eater",
    icon: "🦅"
    category: "action",
    path: "games/evoeater/index.html"
  },

  {
    id: "coming-soon-adventure",
    title: "Coming Soon",
    icon: "🗺️",
    desc: "New adventure game coming soon",
    category: "adventure",
    path: "#"
  },

  {
    id: "coming-soon-arcade",
    title: "Coming Soon",
    icon: "🕹️",
    desc: "New arcade game coming soon",
    category: "arcade",
    path: "#"
  }

];


/* =========================
   ELEMENTS
========================= */

const grid =
  document.getElementById("gameGrid");

const gameOverlay =
  document.getElementById("gameOverlay");

const gameFrame =
  document.getElementById("gameFrame");

const logoBtn =
  document.getElementById("logoBtn");

const gameCloseBtn =
  document.getElementById("gameCloseBtn");

const confirmBackdrop =
  document.getElementById("confirmBackdrop");

const confirmYesBtn =
  document.getElementById("confirmYesBtn");

const confirmNoBtn =
  document.getElementById("confirmNoBtn");

const confirmCloseBtn =
  document.getElementById("confirmCloseBtn");


/* =========================
   CHECK GAME
========================= */

function isGameOpen() {

  return gameOverlay.classList.contains("open");

}


/* =========================
   SHOW GAMES
========================= */

function showGames(list) {

  grid.innerHTML = "";

  list.forEach(game => {

    const card =
      document.createElement("div");

    card.className = "game-card";

 card.innerHTML = `

      <a href="${game.path}" class="game-link">

        <div class="game-image">
          ${game.icon}
        </div>

        <div class="game-info">

          <h3>
            ${game.title}
          </h3>

          <p>
            ${game.desc}
          </p>

        </div>

      </a>

    `;
    card.addEventListener("click", () => {

      openGame(game.path);

    });

    grid.appendChild(card);

  });

}


/* =========================
   OPEN GAME
========================= */

function openGame(path) {

  if (!path || path === "#") {
    return;
  }

  gameFrame.src = path;

  gameOverlay.classList.add("open");

  document.body.style.overflow = "hidden";

}


/* =========================
   CLOSE GAME
========================= */

function closeGame() {

  gameOverlay.classList.remove("open");

  gameFrame.src = "";

  confirmBackdrop.classList.remove("open");

  document.body.style.overflow = "";

}


/* =========================
   CONFIRM BOX
========================= */

function showConfirm() {

  confirmBackdrop.classList.add("open");

}

function hideConfirm() {

  confirmBackdrop.classList.remove("open");

}


/* =========================
   LOGO BUTTON
========================= */

logoBtn.addEventListener("click", () => {

  if (isGameOpen()) {

    showConfirm();

  } else {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

});


/* =========================
   CLOSE GAME BUTTON
========================= */

gameCloseBtn.addEventListener("click", () => {

  showConfirm();

});


/* =========================
   YES
========================= */

confirmYesBtn.addEventListener("click", () => {

  closeGame();

});


/* =========================
   NO
========================= */

confirmNoBtn.addEventListener("click", () => {

  hideConfirm();

});


/* =========================
   X BUTTON
========================= */

confirmCloseBtn.addEventListener("click", () => {

  hideConfirm();

});


/* =========================
   OUTSIDE MODAL
========================= */

confirmBackdrop.addEventListener("click", (event) => {

  if (event.target === confirmBackdrop) {

    hideConfirm();

  }

});


/* =========================
   CATEGORY FILTER
========================= */

function filterGames(category) {

  if (category === "all") {

    showGames(games);

    return;

  }

  const filteredGames =
    games.filter(game => {

      return game.category === category;

    });

  showGames(filteredGames);

}


/* =========================
   START
========================= */

showGames(games);
