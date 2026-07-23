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

          <div
            id="gameMessage"
            class="game-message"
          >

            <div class="game-message-inner">

              <div class="game-message-icon">
                ${noseIcon()}
              </div>

              <h3>Bereit?</h3>

              <p>
                Starte unten am violetten
                Kreis und folge der Spur
                bis zum pinken Ziel.
              </p>

              <button
                id="prepareButton"
                class="btn btn-primary"
                type="button"
              >
                ${playIcon()}
                Countdown starten
              </button>

            </div>

          </div>

        </div>

        <div
          class="progress-track"
          aria-hidden="true"
        >
          <div
            id="progressFill"
            class="progress-fill"
          ></div>
        </div>

      </div>

    </section>
  `;

  document
    .getElementById("backButton")
    .addEventListener(
      "click",
      renderHome
    );

  document
    .getElementById(
      "prepareButton"
    )
    .addEventListener(
      "click",
      beginCountdown
    );

  setupGameCanvas();
}

function setupGameCanvas() {
  const canvas =
    document.getElementById(
      "gameCanvas"
    );

  const rect =
    canvas.getBoundingClientRect();

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  canvas.width = Math.round(
    rect.width * dpr
  );

  canvas.height = Math.round(
    rect.height * dpr
  );

  const context =
    canvas.getContext("2d");

  context.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  const width = rect.width;
  const height = rect.height;

  const pathPoints =
    createPath(
      width,
      height,
      state.currentChallenge
    );

  state.game = {
    canvas,
    context,
    width,
    height,
    pathPoints,

    running: false,
    finished: false,
    pointerActive: false,

    startTime: null,
    elapsed: 0,

    progressIndex: 0,

    totalSamples: 0,
    goodSamples: 0,

    userTrail: [],

    animationFrame: null,
    countdownTimer: null,

    markerPhase: 0
  };

  drawGame();

  canvas.addEventListener(
    "pointerdown",
    handlePointerDown
  );

  canvas.addEventListener(
    "pointermove",
    handlePointerMove
  );

  canvas.addEventListener(
    "pointerup",
    handlePointerUp
  );

  canvas.addEventListener(
    "pointercancel",
    handlePointerUp
  );

  animateMarkers();
}

function createPath(
  width,
  height,
  type
) {
  const generators = {
    wave: createWavePath,
    zigzag: createZigzagPath,
    snake: createSnakePath,
    lightning: createLightningPath,
    spiral: createSpiralPath
  };

  const generator =
    generators[type] ||
    createWavePath;

  return generator(width, height);
}

function getPathBounds(width, height) {
  return {
    centerX: width / 2,
    startY: height - 42,
    endY: 42,
    minX: 40,
    maxX: width - 40
  };
}

function clampX(value, bounds) {
  return Math.max(
    bounds.minX,
    Math.min(
      bounds.maxX,
      value
    )
  );
}

function createWavePath(
  width,
  height
) {
  const bounds =
    getPathBounds(width, height);

  const points = [];
  const steps = 180;

  const offset =
    Math.random() *
    Math.PI *
    2;

  for (
    let i = 0;
    i <= steps;
    i += 1
  ) {
    const t = i / steps;

    const y =
      bounds.startY +
      (
        bounds.endY -
        bounds.startY
      ) *
      t;

    const x =
      bounds.centerX +
      Math.sin(
        t * Math.PI * 3.25 +
        offset
      ) *
      width *
      0.23 +
      Math.sin(
        t * Math.PI * 7.4
      ) *
      width *
      0.035;

    points.push({
      x: clampX(x, bounds),
      y
    });
  }

  return points;
}

function createSnakePath(
  width,
  height
) {
  const bounds =
    getPathBounds(width, height);

  const points = [];
  const steps = 190;

  const offset =
    Math.random() *
    Math.PI *
    2;

  for (
    let i = 0;
    i <= steps;
    i += 1
  ) {
    const t = i / steps;

    const y =
      bounds.startY +
      (
        bounds.endY -
        bounds.startY
      ) *
      t;

    const amplitude =
      width *
      (
        0.13 +
        Math.sin(
          t * Math.PI
        ) *
        0.06
      );

    const x =
      bounds.centerX +
      Math.sin(
        t * Math.PI * 7.2 +
        offset
      ) *
      amplitude;

    points.push({
      x: clampX(x, bounds),
      y
    });
  }

  return points;
}

function createZigzagPath(
  width,
  height
) {
  const bounds =
    getPathBounds(width, height);

  const anchors = [];

  const segments = 9;
  const amplitude =
    width * 0.27;

  for (
    let i = 0;
    i <= segments;
    i += 1
  ) {
    const t = i / segments;

    const y =
      bounds.startY +
      (
        bounds.endY -
        bounds.startY
      ) *
      t;

    let x = bounds.centerX;

    if (i > 0 && i < segments) {
      x +=
        i % 2 === 0
          ? amplitude
          : -amplitude;
    }

    anchors.push({
      x: clampX(x, bounds),
      y
    });
  }

  return interpolateAnchors(
    anchors,
    22
  );
}

function createLightningPath(
  width,
  height
) {
  const bounds =
    getPathBounds(width, height);

  const anchors = [
    {
      x: bounds.centerX,
      y: bounds.startY
    },
    {
      x: width * 0.28,
      y: height * 0.82
    },
    {
      x: width * 0.68,
      y: height * 0.69
    },
    {
      x: width * 0.40,
      y: height * 0.60
    },
    {
      x: width * 0.75,
      y: height * 0.47
    },
    {
      x: width * 0.34,
      y: height * 0.34
    },
    {
      x: width * 0.63,
      y: height * 0.23
    },
    {
      x: bounds.centerX,
      y: bounds.endY
    }
  ].map((point) => ({
    x: clampX(point.x, bounds),
    y: point.y
  }));

  return interpolateAnchors(
    anchors,
    25
  );
}

function createSpiralPath(
  width,
  height
) {
  const bounds =
    getPathBounds(width, height);

  const points = [];
  const steps = 210;

  for (
    let i = 0;
    i <= steps;
    i += 1
  ) {
    const t = i / steps;

    const y =
      bounds.startY +
      (
        bounds.endY -
        bounds.startY
      ) *
      t;

    const wave =
      Math.sin(
        t * Math.PI * 5.2
      );

    const loopBoost =
      Math.sin(
        t * Math.PI
      );

    const x =
      bounds.centerX +
      wave *
      width *
      (
        0.10 +
        loopBoost * 0.19
      ) +
      Math.sin(
        t * Math.PI * 10.4
      ) *
      width *
      0.04;

    points.push({
      x: clampX(x, bounds),
      y
    });
  }

  return points;
}

function interpolateAnchors(
  anchors,
  stepsPerSegment
) {
  const points = [];

  for (
    let i = 0;
    i < anchors.length - 1;
    i += 1
  ) {
    const start = anchors[i];
    const end = anchors[i + 1];

    for (
      let step = 0;
      step < stepsPerSegment;
      step += 1
    ) {
      const t =
        step / stepsPerSegment;

      points.push({
        x:
          start.x +
          (end.x - start.x) *
          t,

        y:
          start.y +
          (end.y - start.y) *
          t
      });
    }
  }

  points.push(
    anchors[
      anchors.length - 1
    ]
  );

  return points;
}

function animateMarkers() {
  const game = state.game;

  if (!game || game.finished) {
    return;
  }

  game.markerPhase += 0.06;

  drawGame();

  game.animationFrame =
    requestAnimationFrame(
      animateMarkers
    );
}

function drawGame() {
  const game = state.game;

  if (!game) {
    return;
  }

  const {
    context,
    width,
    height,
    pathPoints,
    userTrail
  } = game;

  context.clearRect(
    0,
    0,
    width,
    height
  );

  context.lineCap = "round";
  context.lineJoin = "round";

  drawGuidePath(
    context,
    pathPoints
  );

  if (userTrail.length > 1) {
    context.beginPath();

    userTrail.forEach(
      (point, index) => {
        if (index === 0) {
          context.moveTo(
            point.x,
            point.y
          );
        } else {
          context.lineTo(
            point.x,
            point.y
          );
        }
      }
    );

    context.strokeStyle =
      "rgba(236, 72, 153, 0.82)";

    context.lineWidth = 6;
    context.stroke();
  }

  const pulse =
    2 +
    Math.sin(
      game.markerPhase
    ) *
    3;

  drawMarker(
    context,
    pathPoints[0],
    "#7c3aed",
    "START",
    pulse
  );

  drawMarker(
    context,
    pathPoints[
      pathPoints.length - 1
    ],
    "#ec4899",
    "ZIEL",
    -pulse
  );
}

function drawGuidePath(
  context,
  points
) {
  context.beginPath();

  points.forEach(
    (point, index) => {
      if (index === 0) {
        context.moveTo(
          point.x,
          point.y
        );
      } else {
        context.lineTo(
          point.x,
          point.y
        );
      }
    }
  );

  context.strokeStyle = "#18181b";
  context.lineWidth = 19;
  context.stroke();

  context.beginPath();

  points.forEach(
    (point, index) => {
      if (index === 0) {
        context.moveTo(
          point.x,
          point.y
        );
      } else {
        context.lineTo(
          point.x,
          point.y
        );
      }
    }
  );

  context.strokeStyle = "#7c3aed";
  context.lineWidth = 11;
  context.stroke();

  context.beginPath();

  points.forEach(
    (point, index) => {
      if (index === 0) {
        context.moveTo(
          point.x,
          point.y
        );
      } else {
        context.lineTo(
          point.x,
          point.y
        );
      }
    }
  );

  context.setLineDash([3, 14]);

  context.strokeStyle =
    "rgba(255, 255, 255, 0.75)";

  context.lineWidth = 3;
  context.stroke();

  context.setLineDash([]);
}

function drawMarker(
  context,
  point,
  color,
  label,
  pulse
) {
  const radius =
    Math.max(17, 21 + pulse);

  context.beginPath();

  context.arc(
    point.x,
    point.y,
    radius + 8,
    0,
    Math.PI * 2
  );

  context.fillStyle =
    color === "#7c3aed"
      ? "rgba(124, 58, 237, 0.17)"
      : "rgba(236, 72, 153, 0.17)";

  context.fill();

  context.beginPath();

  context.arc(
    point.x,
    point.y,
    radius,
    0,
    Math.PI * 2
  );

  context.fillStyle = color;
  context.fill();

  context.lineWidth = 3;
  context.strokeStyle = "#18181b";
  context.stroke();

  context.fillStyle = "#ffffff";

  context.font =
    "900 9px Arial";

  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillText(
    label,
    point.x,
    point.y
  );
}

function beginCountdown() {
  const game = state.game;

  if (!game) {
    return;
  }

  const message =
    document.getElementById(
      "gameMessage"
    );

  const overlay =
    document.getElementById(
      "countdownOverlay"
    );

  message.classList.add("hidden");
  overlay.classList.remove("hidden");

  let count = 3;

  showCountdownValue(
    overlay,
    count
  );

  game.countdownTimer =
    window.setInterval(() => {
      count -= 1;

      if (count > 0) {
        showCountdownValue(
          overlay,
          count
        );

        return;
      }

      window.clearInterval(
        game.countdownTimer
      );

      game.countdownTimer = null;

      showCountdownValue(
        overlay,
        "LOS!"
      );

      window.setTimeout(() => {
        if (!state.game) {
          return;
        }

        overlay.classList.add(
          "hidden"
        );

        startGameClock();
      }, 600);
    }, 900);
}

function showCountdownValue(
  overlay,
  value
) {
  overlay.classList.remove(
    "countdown-pop"
  );

  void overlay.offsetWidth;

  overlay.textContent = value;

  overlay.classList.add(
    "countdown-pop"
  );
}

function startGameClock() {
  const game = state.game;

  if (!game) {
    return;
  }

  game.running = true;
  game.startTime = performance.now();

  const tick = (now) => {
    if (
      !state.game ||
      !state.game.running
    ) {
      return;
    }

    state.game.elapsed =
      (
        now -
        state.game.startTime
      ) /
      1000;

    const timeValue =
      document.getElementById(
        "timeValue"
      );

    if (timeValue) {
      timeValue.textContent =
        formatNumber(
          state.game.elapsed
        );
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function getPointerPosition(event) {
  const canvas = state.game.canvas;

  const rect =
    canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function distance(a, b) {
  return Math.hypot(
    a.x - b.x,
    a.y - b.y
  );
}

function handlePointerDown(event) {
  const game = state.game;

  if (
    !game ||
    !game.running ||
    game.finished
  ) {
    return;
  }

  const point =
    getPointerPosition(event);

  const startPoint =
    game.pathPoints[0];

  if (
    distance(
      point,
      startPoint
    ) > 42
  ) {
    return;
  }

  game.pointerActive = true;

  game.canvas.setPointerCapture(
    event.pointerId
  );

  processPointerPoint(point);
}

function handlePointerMove(event) {
  const game = state.game;

  if (
    !game ||
    !game.running ||
    !game.pointerActive ||
    game.finished
  ) {
    return;
  }

  processPointerPoint(
    getPointerPosition(event)
  );
}

function handlePointerUp(event) {
  const game = state.game;

  if (!game) {
    return;
  }

  game.pointerActive = false;

  if (
    game.canvas.hasPointerCapture?.(
      event.pointerId
    )
  ) {
    game.canvas.releasePointerCapture(
      event.pointerId
    );
  }
}

function processPointerPoint(point) {
  const game = state.game;

  if (!game) {
    return;
  }

  game.userTrail.push(point);

  game.totalSamples += 1;

  const searchFrom = Math.max(
    0,
    game.progressIndex - 5
  );

  const searchTo = Math.min(
    game.pathPoints.length - 1,
    game.progressIndex + 18
  );

  let nearestIndex =
    game.progressIndex;

  let nearestDistance =
    Number.POSITIVE_INFINITY;

  for (
    let i = searchFrom;
    i <= searchTo;
    i += 1
  ) {
    const currentDistance =
      distance(
        point,
        game.pathPoints[i]
      );

    if (
      currentDistance <
      nearestDistance
    ) {
      nearestDistance =
        currentDistance;

      nearestIndex = i;
    }
  }

  if (nearestDistance <= 30) {
    game.goodSamples += 1;

    game.progressIndex =
      Math.max(
        game.progressIndex,
        nearestIndex
      );
  }

  const accuracy =
    game.totalSamples === 0
      ? 100
      : Math.round(
          (
            game.goodSamples /
            game.totalSamples
          ) *
          100
        );

  const progress =
    Math.min(
      100,
      Math.round(
        (
          game.progressIndex /
          (
            game.pathPoints.length -
            1
          )
        ) *
        100
      )
    );

  updateGameMeta(
    accuracy,
    progress
  );

  const target =
    game.pathPoints[
      game.pathPoints.length - 1
    ];

  if (
    progress >= 96 &&
    distance(point, target) <= 45
  ) {
    finishGame();
  }
}

function updateGameMeta(
  accuracy,
  progress
) {
  const accuracyElement =
    document.getElementById(
      "accuracyValue"
    );

  const progressElement =
    document.getElementById(
      "progressValue"
    );

  const progressFill =
    document.getElementById(
      "progressFill"
    );

  if (accuracyElement) {
    accuracyElement.textContent =
      accuracy;
  }

  if (progressElement) {
    progressElement.textContent =
      progress;
  }

  if (progressFill) {
    progressFill.style.width =
      `${progress}%`;
  }
}

function finishGame() {
  const game = state.game;

  if (
    !game ||
    game.finished
  ) {
    return;
  }

  game.finished = true;
  game.running = false;

  game.elapsed = Math.max(
    0.8,
    (
      performance.now() -
      game.startTime
    ) /
    1000
  );

  if (game.animationFrame) {
    cancelAnimationFrame(
      game.animationFrame
    );
  }

  const accuracy =
    Math.max(
      1,
      Math.round(
        (
          game.goodSamples /
          Math.max(
            1,
            game.totalSamples
          )
        ) *
        100
      )
    );

  const pathLengthPx =
    calculatePathLength(
      game.pathPoints
    );

  const virtualCentimeters =
    pathLengthPx / 14;

  const speed =
    virtualCentimeters /
    game.elapsed;

  const difficultyMultiplier =
    getDifficultyMultiplier(
      state.currentChallenge
    );

  const amount =
    Math.max(
      0.05,
      (
        virtualCentimeters *
        (
          accuracy /
          100
        ) *
        difficultyMultiplier
      ) /
      (
        game.elapsed *
        7.2
      )
    );

  const score =
    Math.round(
      amount * 1000 +
      accuracy * 8 +
      speed * 20
    );

  const challenge =
    CHALLENGES[
      state.currentChallenge
    ];

  const result = {
    id:
      `${Date.now()}-` +
      Math.random()
        .toString(16)
        .slice(2),

    playerName:
      state.playerName,

    challengeId:
      state.currentChallenge,

    challengeName:
      challenge.name,

    time:
      Number(
        game.elapsed.toFixed(2)
      ),

    accuracy,

    distance:
      Number(
        virtualCentimeters.toFixed(
          1
        )
      ),

    speed:
      Number(
        speed.toFixed(2)
      ),

    amount:
      Number(
        amount.toFixed(2)
      ),

    score,

    createdAt:
      new Date().toISOString()
  };

  state.currentResult = result;

  saveResult(result);

  window.setTimeout(
    renderResult,
    300
  );
}

function getDifficultyMultiplier(
  challengeId
) {
  const multipliers = {
    wave: 1,
    snake: 1.08,
    zigzag: 1.14,
    lightning: 1.18,
    spiral: 1.22
  };

  return (
    multipliers[challengeId] ||
    1
  );
}

function calculatePathLength(points) {
  let total = 0;

  for (
    let i = 1;
    i < points.length;
    i += 1
  ) {
    total += distance(
      points[i - 1],
      points[i]
    );
  }

  return total;
}

function getRankForResult(result) {
  const results = loadResults();

  const index =
    results.findIndex(
      (entry) =>
        entry.id === result.id
    );

  return index >= 0
    ? index + 1
    : null;
}

function getResultComment(result) {
  if (
    result.accuracy >= 96 &&
    result.time <= 5
  ) {
    return (
      "Laser-Nase! Schnell, sauber " +
      "und verdächtig konzentriert."
    );
  }

  if (result.accuracy >= 91) {
    return (
      "Sehr saubere Spur. Kaum ein " +
      "Millimeter wurde verschenkt."
    );
  }

  if (result.time <= 4.5) {
    return (
      "Extrem schnell – die Kurven " +
      "wurden dabei kreativ ausgelegt."
    );
  }

  if (result.accuracy < 70) {
    return (
      "Die Linie und dein Finger " +
      "führten offenbar getrennte Leben."
    );
  }

  return (
    "Solide Runde. Die Nase sieht " +
    "noch deutliches Rekordpotenzial."
  );
}

function renderResult() {
  stopActiveGame();

  const result =
    state.currentResult;

  if (!result) {
    renderHome();
    return;
  }

  const rank =
    getRankForResult(result);

  app.innerHTML = `
    <section class="screen">

      <div class="topbar">

        <button
          id="homeButton"
          class="btn btn-small"
          type="button"
        >
          ← Start
        </button>

        <div class="topbar-title">

          <h2>Deine Auswertung</h2>

          <p>
            ${escapeHtml(
              result.playerName
            )}
          </p>

        </div>

      </div>

      <div class="card result-hero">

        <div class="result-badge">
          ${trophyIcon()}
        </div>

        <h2>Virtuelle Menge</h2>

        <p class="result-amount">
          ${formatNumber(
            result.amount
          )} g
        </p>

        <p class="result-label">
          rein fiktiver Spielwert
        </p>

        <div class="result-challenge">
          Linie:
          ${escapeHtml(
            result.challengeName ||
            "Unbekannt"
          )}
        </div>

      </div>

      <div class="card">

        <div class="stats-grid">

          <div class="stat">

            <strong>
              ${formatNumber(
                result.time
              )} s
            </strong>

            <span>Zeit</span>

          </div>

          <div class="stat">

            <strong>
              ${result.accuracy} %
            </strong>

            <span>Genauigkeit</span>

          </div>

          <div class="stat">

            <strong>
              ${formatNumber(
                result.distance,
                1
              )} cm
            </strong>

            <span>
              virtuelle Strecke
            </span>

          </div>

          <div class="stat">

            <strong>
              ${formatNumber(
                result.speed
              )} cm/s
            </strong>

            <span>
              Geschwindigkeit
            </span>

          </div>

          <div class="stat">

            <strong>
              ${result.score}
            </strong>

            <span>Gesamtpunkte</span>

          </div>

          <div class="stat">

            <strong>
              ${
                rank
                  ? `#${rank}`
                  : "–"
              }
            </strong>

            <span>Rang</span>

          </div>

        </div>

      </div>

      <div class="rank-banner">
        ${escapeHtml(
          getResultComment(result)
        )}
      </div>

      <div class="action-grid">

        <button
          id="againButton"
          class="btn btn-primary"
          type="button"
        >
          ${playIcon()}
          Noch einmal
        </button>

        <button
          id="rankingButton"
          class="btn btn-secondary"
          type="button"
        >
          ${rankingIcon()}
          Bestenliste
        </button>

      </div>

      <button
        id="shareButton"
        class="btn"
        type="button"
      >
        ${shareIcon()}
        Ergebnis teilen
      </button>

      <p class="disclaimer">
        Alle Mengen und Statistiken
        sind simuliert und frei erfunden.
      </p>

    </section>
  `;

  createConfetti();

  document
    .getElementById("homeButton")
    .addEventListener(
      "click",
      renderHome
    );

  document
    .getElementById("againButton")
    .addEventListener(
      "click",
      () => {
        removeConfetti();

        if (
          state.selectedChallenge ===
          "random"
        ) {
          resolveCurrentChallenge();
        }

        renderGame();
      }
    );

  document
    .getElementById(
      "rankingButton"
    )
    .addEventListener(
      "click",
      renderLeaderboard
    );

  document
    .getElementById(
      "shareButton"
    )
    .addEventListener(
      "click",
      shareResult
    );
}

function createConfetti() {
  removeConfetti();

  const layer =
    document.createElement("div");

  layer.className =
    "confetti-layer";

  layer.id =
    "confettiLayer";

  const colors = [
    "#7c3aed",
    "#ec4899",
    "#f59e0b",
    "#a78bfa",
    "#ffffff"
  ];

  for (
    let i = 0;
    i < 34;
    i += 1
  ) {
    const piece =
      document.createElement("div");

    piece.className =
      "confetti-piece";

    piece.style.left =
      `${Math.random() * 100}%`;

    piece.style.background =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];

    piece.style.setProperty(
      "--fall-duration",
      `${2.4 + Math.random() * 2.3}s`
    );

    piece.style.animationDelay =
      `${Math.random() * 0.9}s`;

    piece.style.transform =
      `rotate(${Math.random() * 360}deg)`;

    layer.appendChild(piece);
  }

  document.body.appendChild(layer);

  window.setTimeout(
    removeConfetti,
    5200
  );
}

function removeConfetti() {
  document
    .getElementById(
      "confettiLayer"
    )
    ?.remove();
}

async function shareResult() {
  const result =
    state.currentResult;

  if (!result) {
    return;
  }

  const text =
    `${result.playerName} erzielte ` +
    `bei SNIFFIfy mit der Linie ` +
    „${result.challengeName}“ ` +
    `${formatNumber(result.amount)} ` +
    `virtuelle g, ` +
    `${result.accuracy} % Genauigkeit ` +
    `und ${formatNumber(result.time)} ` +
    `Sekunden. Reine Satire.`;

  try {
    if (navigator.share) {
      await navigator.share({
        title:
          "SNIFFIfy Ergebnis",

        text
      });

      return;
    }

    await navigator.clipboard.writeText(
      text
    );

    window.alert(
      "Das Ergebnis wurde kopiert."
    );
  } catch (error) {
    if (
      error?.name !==
      "AbortError"
    ) {
      window.alert(
        "Das Ergebnis konnte nicht geteilt werden."
      );
    }
  }
}

function renderLeaderboard() {
  stopActiveGame();
  removeConfetti();

  const results =
    loadResults();

  const rows =
    results.length
      ? results
          .map(
            (
              result,
              index
            ) => {
              const date =
                new Date(
                  result.createdAt
                ).toLocaleDateString(
                  "de-DE"
                );

              const currentClass =
                state.currentResult?.id ===
                result.id
                  ? " current"
                  : "";

              const challengeName =
                result.challengeName ||
                "ältere Version";

              return `
                <div
                  class="leaderboard-row${currentClass}"
                  style="
                    animation-delay:
                    ${Math.min(
                      index * 0.04,
                      0.5
                    )}s;
                  "
                >

                  <div class="rank-number">
                    ${index + 1}
                  </div>

                  <div>

                    <div class="player-name">
                      ${escapeHtml(
                        result.playerName
                      )}
                    </div>

                    <div class="player-sub">
                      ${date}
                      ·
                      ${escapeHtml(
                        challengeName
                      )}
                      ·
                      ${result.accuracy} %
                      ·
                      ${formatNumber(
                        result.time
                      )} s
                    </div>

                  </div>

                  <div class="score-value">

                    ${formatNumber(
                      result.amount
                    )} g

                    <br>

                    <small>
                      ${result.score} P.
                    </small>

                  </div>

                </div>
              `;
            }
          )
          .join("")
      : `
        <div class="empty-state">
          Noch keine Ergebnisse gespeichert.
        </div>
      `;

  app.innerHTML = `
    <section class="screen">

      <div class="topbar">

        <button
          id="backHomeButton"
          class="btn btn-small"
          type="button"
        >
          ← Start
        </button>

        <div class="topbar-title">

          <h2>Bestenliste</h2>

          <p>
            Die besten Ergebnisse
            auf diesem Gerät
          </p>

        </div>

      </div>

      <div class="card">

        <div class="leaderboard-list">
          ${rows}
        </div>

      </div>

      <div class="action-grid">

        <button
          id="newGameButton"
          class="btn btn-primary"
          type="button"
        >
          ${playIcon()}
          Neue Runde
        </button>

        <button
          id="clearButton"
          class="btn btn-danger"
          type="button"
        >
          Liste löschen
        </button>

      </div>

      <p class="disclaimer">
        Die Bestenliste wird lokal
        in diesem Browser gespeichert.
      </p>

    </section>
  `;

  document
    .getElementById(
      "backHomeButton"
    )
    .addEventListener(
      "click",
      renderHome
    );

  document
    .getElementById(
      "newGameButton"
    )
    .addEventListener(
      "click",
      () => {
        if (!state.playerName) {
          renderHome();
          return;
        }

        resolveCurrentChallenge();
        renderGame();
      }
    );

  document
    .getElementById(
      "clearButton"
    )
    .addEventListener(
      "click",
      () => {
        const confirmed =
          window.confirm(
            "Möchtest du wirklich alle " +
            "gespeicherten Ergebnisse löschen?"
          );

        if (!confirmed) {
          return;
        }

        clearResults();

        state.currentResult = null;

        renderLeaderboard();
      }
    );
}

function stopActiveGame() {
  if (!state.game) {
    return;
  }

  if (
    state.game.animationFrame
  ) {
    cancelAnimationFrame(
      state.game.animationFrame
    );
  }

  if (
    state.game.countdownTimer
  ) {
    clearInterval(
      state.game.countdownTimer
    );
  }

  state.game = null;
}

window.addEventListener(
  "beforeunload",
  () => {
    stopActiveGame();
    removeConfetti();
  }
);

renderHome();