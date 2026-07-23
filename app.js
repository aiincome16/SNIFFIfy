"use strict";

const STORAGE_KEYS = {
  player: "sniffify_player",
  results: "sniffify_results",
  challenge: "sniffify_challenge"
};

const CHALLENGES = {
  wave: {
    id: "wave",
    name: "Wellenritt",
    description: "Weiche, lange Kurven"
  },

  zigzag: {
    id: "zigzag",
    name: "Zickzack",
    description: "Scharfe Richtungswechsel"
  },

  snake: {
    id: "snake",
    name: "Schlangenlinie",
    description: "Viele kleine Kurven"
  },

  lightning: {
    id: "lightning",
    name: "Blitzspur",
    description: "Unruhig und kantig"
  },

  spiral: {
    id: "spiral",
    name: "Wirbelwind",
    description: "Kreise und Schleifen"
  },

  random: {
    id: "random",
    name: "Zufallsmodus",
    description: "Jede Runde eine Überraschung"
  }
};

const app = document.getElementById("app");

const state = {
  playerName: loadPlayerName(),
  selectedChallenge: loadChallenge(),
  currentChallenge: null,
  currentResult: null,
  game: null
};

function noseIcon() {
  return `
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <path
        d="
          M61 13
          C54 27 50 42 49 58
          C48 71 38 77 36 87
          C34 98 44 105 55 101
          C59 100 62 97 64 94
          C68 100 74 103 82 101
          C94 98 97 85 89 78
          C83 72 76 69 75 59
          C73 43 71 27 64 13
        "
        fill="#f1b99b"
        stroke="#18181b"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        d="
          M45 88
          C49 83 57 83 62 88
        "
        fill="none"
        stroke="#18181b"
        stroke-width="4"
        stroke-linecap="round"
      />

      <path
        d="
          M66 88
          C72 82 81 83 85 89
        "
        fill="none"
        stroke="#18181b"
        stroke-width="4"
        stroke-linecap="round"
      />

      <path
        d="
          M21 48
          C27 43 31 42 37 43
        "
        fill="none"
        stroke="#7c3aed"
        stroke-width="5"
        stroke-linecap="round"
      />

      <path
        d="
          M83 40
          C91 40 98 44 102 50
        "
        fill="none"
        stroke="#7c3aed"
        stroke-width="5"
        stroke-linecap="round"
      />

      <path
        d="M24 65 C18 68 15 73 14 78"
        fill="none"
        stroke="#ec4899"
        stroke-width="4"
        stroke-linecap="round"
      />

      <path
        d="M98 65 C104 69 107 74 108 81"
        fill="none"
        stroke="#ec4899"
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  `;
}

function trophyIcon() {
  return `
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <path
        d="
          M39 20
          H81
          V46
          C81 64 73 74 60 74
          C47 74 39 64 39 46
          Z
        "
        fill="#fde68a"
        stroke="#18181b"
        stroke-width="5"
        stroke-linejoin="round"
      />

      <path
        d="
          M39 29
          H25
          C24 48 31 57 44 59
        "
        fill="none"
        stroke="#18181b"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        d="
          M81 29
          H95
          C96 48 89 57 76 59
        "
        fill="none"
        stroke="#18181b"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        d="M60 74 V91"
        fill="none"
        stroke="#18181b"
        stroke-width="5"
        stroke-linecap="round"
      />

      <path
        d="M43 101 H77"
        fill="none"
        stroke="#18181b"
        stroke-width="8"
        stroke-linecap="round"
      />

      <path
        d="
          M60 29
          L65 39
          L76 41
          L68 49
          L70 60
          L60 55
          L50 60
          L52 49
          L44 41
          L55 39
          Z
        "
        fill="#7c3aed"
        stroke="#18181b"
        stroke-width="3"
        stroke-linejoin="round"
      />
    </svg>
  `;
}

function playIcon() {
  return `
    <span class="btn-icon">
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M13 8 L31 20 L13 32 Z"
          fill="currentColor"
          stroke="#18181b"
          stroke-width="3"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  `;
}

function rankingIcon() {
  return `
    <span class="btn-icon">
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M7 31 V22 H15 V31"
          fill="#a78bfa"
          stroke="#18181b"
          stroke-width="3"
        />

        <path
          d="M16 31 V10 H24 V31"
          fill="#7c3aed"
          stroke="#18181b"
          stroke-width="3"
        />

        <path
          d="M25 31 V17 H33 V31"
          fill="#ec4899"
          stroke="#18181b"
          stroke-width="3"
        />
      </svg>
    </span>
  `;
}

function shareIcon() {
  return `
    <span class="btn-icon">
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle
          cx="10"
          cy="20"
          r="5"
          fill="#ede9fe"
          stroke="#18181b"
          stroke-width="3"
        />

        <circle
          cx="29"
          cy="10"
          r="5"
          fill="#ede9fe"
          stroke="#18181b"
          stroke-width="3"
        />

        <circle
          cx="29"
          cy="30"
          r="5"
          fill="#ede9fe"
          stroke="#18181b"
          stroke-width="3"
        />

        <path
          d="M15 18 L24 13 M15 22 L24 27"
          fill="none"
          stroke="#18181b"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </span>
  `;
}

function challengePreview(type) {
  const paths = {
    wave: "M4 38 C20 4 35 5 45 30 C57 57 73 55 86 14",

    zigzag: "M5 40 L22 10 L39 40 L56 10 L73 40 L86 12",

    snake:
      "M5 38 C20 7 29 8 38 27 C47 46 58 47 67 26 C74 10 81 10 86 18",

    lightning:
      "M6 40 L28 8 L24 28 L48 18 L42 41 L68 13 L63 31 L86 8",

    spiral:
      "M6 38 C17 11 55 7 73 23 C89 37 70 50 51 43 C34 37 37 20 53 19 C65 19 69 27 65 34"
  };

  const path =
    paths[type] || paths.wave;

  return `
    <svg
      class="challenge-preview"
      viewBox="0 0 92 52"
      aria-hidden="true"
    >
      <path d="${path}" />
    </svg>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadPlayerName() {
  try {
    return localStorage.getItem(
      STORAGE_KEYS.player
    ) || "";
  } catch {
    return "";
  }
}

function savePlayerName(name) {
  state.playerName = name
    .trim()
    .slice(0, 24);

  try {
    localStorage.setItem(
      STORAGE_KEYS.player,
      state.playerName
    );
  } catch {
    // Die App funktioniert auch ohne lokale Speicherung.
  }
}

function loadChallenge() {
  try {
    const saved = localStorage.getItem(
      STORAGE_KEYS.challenge
    );

    return CHALLENGES[saved]
      ? saved
      : "random";
  } catch {
    return "random";
  }
}

function saveChallenge(challengeId) {
  state.selectedChallenge =
    CHALLENGES[challengeId]
      ? challengeId
      : "random";

  try {
    localStorage.setItem(
      STORAGE_KEYS.challenge,
      state.selectedChallenge
    );
  } catch {
    // Keine weitere Aktion notwendig.
  }
}

function loadResults() {
  try {
    const raw = localStorage.getItem(
      STORAGE_KEYS.results
    );

    const parsed = raw
      ? JSON.parse(raw)
      : [];

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function saveResult(result) {
  const results = loadResults();

  results.push(result);

  results.sort(
    (a, b) => b.score - a.score
  );

  try {
    localStorage.setItem(
      STORAGE_KEYS.results,
      JSON.stringify(
        results.slice(0, 50)
      )
    );
  } catch {
    // Ergebnis wird trotzdem angezeigt.
  }
}

function clearResults() {
  try {
    localStorage.removeItem(
      STORAGE_KEYS.results
    );
  } catch {
    // Keine weitere Aktion notwendig.
  }
}

function formatNumber(
  value,
  digits = 2
) {
  return Number(value).toLocaleString(
    "de-DE",
    {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }
  );
}

function resolveCurrentChallenge() {
  if (
    state.selectedChallenge !==
    "random"
  ) {
    state.currentChallenge =
      state.selectedChallenge;

    return;
  }

  const available = [
    "wave",
    "zigzag",
    "snake",
    "lightning",
    "spiral"
  ];

  state.currentChallenge =
    available[
      Math.floor(
        Math.random() *
        available.length
      )
    ];
}

function renderHome() {
  stopActiveGame();
  removeConfetti();

  const challengeButtons = [
    "wave",
    "zigzag",
    "snake",
    "lightning",
    "spiral",
    "random"
  ]
    .map((id) => {
      const challenge =
        CHALLENGES[id];

      const selected =
        state.selectedChallenge === id
          ? " selected"
          : "";

      const preview =
        id === "random"
          ? `
            <div
              class="challenge-preview"
              aria-hidden="true"
              style="
                display:grid;
                place-items:center;
                font-size:38px;
              "
            >
              ?
            </div>
          `
          : challengePreview(id);

      const randomClass =
        id === "random"
          ? " challenge-random"
          : "";

      return `
        <button
          class="challenge-option${selected}${randomClass}"
          type="button"
          data-challenge="${id}"
        >
          ${preview}

          <strong>
            ${escapeHtml(
              challenge.name
            )}
          </strong>

          <span>
            ${escapeHtml(
              challenge.description
            )}
          </span>
        </button>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="screen">

      <header class="brand">

        <div class="brand-mark">
          ${noseIcon()}
        </div>

        <h1>
          SNIFF<span>Ify</span>
        </h1>

        <p class="subtitle">
          Die vollkommen unseriöse
          Nasen-Challenge
        </p>

      </header>

      <div class="card">

        <label
          class="field-label"
          for="playerName"
        >
          Dein Spielername
        </label>

        <input
          id="playerName"
          class="text-input"
          type="text"
          maxlength="24"
          autocomplete="nickname"
          placeholder="Zum Beispiel Baby Minka"
          value="${escapeHtml(
            state.playerName
          )}"
        >

      </div>

      <div class="card">

        <h2 class="challenge-section-title">
          Welche Linie möchtest du?
        </h2>

        <div class="challenge-grid">
          ${challengeButtons}
        </div>

      </div>

      <div class="button-stack">

        <button
          id="startGameButton"
          class="btn btn-primary"
          type="button"
        >
          ${playIcon()}
          Challenge starten
        </button>

        <button
          id="leaderboardButton"
          class="btn btn-secondary"
          type="button"
        >
          ${rankingIcon()}
          Bestenliste ansehen
        </button>

      </div>

      <div class="notice">
        Setze den Finger auf den violetten
        Startpunkt und ziehe die Linie bis
        zum pinken Ziel nach.
      </div>

      <p class="disclaimer">
        Reine Satire und Unterhaltung.
        Alle Mengen und Ergebnisse sind
        simuliert und frei erfunden.
      </p>

    </section>
  `;

  const nameInput =
    document.getElementById(
      "playerName"
    );

  document
    .querySelectorAll(
      "[data-challenge]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          saveChallenge(
            button.dataset.challenge
          );

          document
            .querySelectorAll(
              "[data-challenge]"
            )
            .forEach((option) => {
              option.classList.toggle(
                "selected",
                option.dataset.challenge ===
                state.selectedChallenge
              );
            });
        }
      );
    });

  document
    .getElementById(
      "startGameButton"
    )
    .addEventListener(
      "click",
      () => {
        const name =
          nameInput.value.trim();

        if (!name) {
          nameInput.focus();

          nameInput.setAttribute(
            "aria-invalid",
            "true"
          );

          return;
        }

        nameInput.removeAttribute(
          "aria-invalid"
        );

        savePlayerName(name);
        resolveCurrentChallenge();
        renderGame();
      }
    );

  document
    .getElementById(
      "leaderboardButton"
    )
    .addEventListener(
      "click",
      renderLeaderboard
    );
}

function renderGame() {
  stopActiveGame();
  removeConfetti();

  if (!state.currentChallenge) {
    resolveCurrentChallenge();
  }

  const challenge =
    CHALLENGES[
      state.currentChallenge
    ];

  app.innerHTML = `
    <section class="screen">

      <div class="topbar">

        <button
          id="backButton"
          class="btn btn-small"
          type="button"
        >
          ← Zurück
        </button>

        <div class="topbar-title">

          <h2>Challenge</h2>

          <p>
            ${escapeHtml(
              state.playerName
            )}
          </p>

        </div>

      </div>

      <div class="card game-card">

        <p class="challenge-label">
          ${escapeHtml(
            challenge.name
          )}
          ·
          ${escapeHtml(
            challenge.description
          )}
        </p>

        <div class="game-meta">

          <div class="meta-box">

            <strong id="timeValue">
              0,00
            </strong>

            <span>Sekunden</span>

          </div>

          <div class="meta-box">

            <strong id="accuracyValue">
              100
            </strong>

            <span>Genauigkeit %</span>

          </div>

          <div class="meta-box">

            <strong id="progressValue">
              0
            </strong>

            <span>Fortschritt %</span>

          </div>

        </div>

        <div class="canvas-wrap">

          <canvas
            id="gameCanvas"
            aria-label="Virtuelle Spur zum Nachzeichnen"
          ></canvas>

          <div
            id="countdownOverlay"
            class="countdown-overlay hidden"
            aria-hidden="true"
          ></div>

         