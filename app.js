"use strict";

const STORAGE_KEYS = {
  player: "sniffify_player",
  results: "sniffify_results"
};

const app = document.getElementById("app");

const state = {
  playerName: loadPlayerName(),
  currentResult: null,
  game: null
};

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
    return localStorage.getItem(STORAGE_KEYS.player) || "";
  } catch {
    return "";
  }
}

function savePlayerName(name) {
  state.playerName = name.trim().slice(0, 24);

  try {
    localStorage.setItem(
      STORAGE_KEYS.player,
      state.playerName
    );
  } catch {
    // Die App bleibt auch ohne lokale Speicherung nutzbar.
  }
}

function loadResults() {
  try {
    const raw = localStorage.getItem(
      STORAGE_KEYS.results
    );

    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveResult(result) {
  const results = loadResults();

  results.push(result);

  results.sort((a, b) => b.score - a.score);

  try {
    localStorage.setItem(
      STORAGE_KEYS.results,
      JSON.stringify(results.slice(0, 50))
    );
  } catch {
    // Ergebnis wird trotzdem angezeigt.
  }
}

function clearResults() {
  try {
    localStorage.removeItem(STORAGE_KEYS.results);
  } catch {
    // Keine weitere Aktion notwendig.
  }
}

function formatNumber(value, digits = 2) {
  return Number(value).toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function renderHome() {
  stopActiveGame();

  app.innerHTML = `
    <section class="screen">

      <header class="brand">

        <div
          class="brand-mark"
          aria-hidden="true"
        >
          👃
        </div>

        <h1>
          SNIFF<span>Ify</span>
        </h1>

        <p class="subtitle">
          Die vollkommen unseriöse Nasen-Challenge
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
          value="${escapeHtml(state.playerName)}"
        >

      </div>

      <div class="button-stack">

        <button
          id="startGameButton"
          class="btn btn-primary"
          type="button"
        >
          Neue Challenge starten
        </button>

        <button
          id="leaderboardButton"
          class="btn btn-secondary"
          type="button"
        >
          Bestenliste ansehen
        </button>

      </div>

      <div class="notice">
        Ziehe die virtuelle Spur mit dem Finger
        möglichst schnell und genau nach.
        Die angezeigte „Menge“ ist frei erfunden
        und Teil des Spiels.
      </div>

      <p class="disclaimer">
        Reine Satire und Unterhaltung.
        Die App misst, dokumentiert oder bewertet
        keinen echten Substanzkonsum.
      </p>

    </section>
  `;

  const nameInput =
    document.getElementById("playerName");

  document
    .getElementById("startGameButton")
    .addEventListener("click", () => {
      const name = nameInput.value.trim();

      if (!name) {
        nameInput.focus();

        nameInput.setAttribute(
          "aria-invalid",
          "true"
        );

        return;
      }

      nameInput.removeAttribute("aria-invalid");

      savePlayerName(name);

      renderGame();
    });

  document
    .getElementById("leaderboardButton")
    .addEventListener(
      "click",
      renderLeaderboard
    );
}

function renderGame() {
  stopActiveGame();

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
            ${escapeHtml(state.playerName)}
          </p>

        </div>

      </div>

      <div class="card game-card">

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

              <h3>Bereit?</h3>

              <p>
                Setze den Finger auf den violetten
                Startpunkt und folge der Spur bis
                zum pinken Ziel.
              </p>

              <button
                id="prepareButton"
                class="btn btn-primary"
                type="button"
              >
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
    .getElementById("prepareButton")
    .addEventListener(
      "click",
      beginCountdown
    );

  setupGameCanvas();
}

function setupGameCanvas() {
  const canvas =
    document.getElementById("gameCanvas");

  const rect = canvas.getBoundingClientRect();

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
    createPath(width, height);

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
    countdownTimer: null
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
}

function createPath(width, height) {
  const points = [];

  const startX = width / 2;
  const startY = height - 42;
  const endY = 42;

  const steps = 160;

  const seedA =
    Math.random() * Math.PI * 2;

  const seedB =
    Math.random() * Math.PI * 2;

  for (
    let i = 0;
    i <= steps;
    i += 1
  ) {
    const t = i / steps;

    const y =
      startY +
      (endY - startY) * t;

    const waveA =
      Math.sin(
        t * Math.PI * 3.2 + seedA
      ) *
      width *
      0.22;

    const waveB =
      Math.sin(
        t * Math.PI * 7.1 + seedB
      ) *
      width *
      0.07;

    const x = Math.max(
      38,
      Math.min(
        width - 38,
        startX + waveA + waveB
      )
    );

    points.push({ x, y });
  }

  return points;
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

  context.beginPath();

  pathPoints.forEach(
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
  context.lineWidth = 18;
  context.stroke();

  context.beginPath();

  pathPoints.forEach(
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
      "rgba(236, 72, 153, 0.75)";

    context.lineWidth = 6;
    context.stroke();
  }

  drawMarker(
    context,
    pathPoints[0],
    "#7c3aed",
    "START"
  );

  drawMarker(
    context,
    pathPoints[
      pathPoints.length - 1
    ],
    "#ec4899",
    "ZIEL"
  );
}

function drawMarker(
  context,
  point,
  color,
  label
) {
  context.beginPath();

  context.arc(
    point.x,
    point.y,
    20,
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

  overlay.classList.remove(
    "hidden"
  );

  let count = 3;

  overlay.textContent = count;

  game.countdownTimer =
    window.setInterval(() => {
      count -= 1;

      if (count > 0) {
        overlay.textContent = count;
        return;
      }

      window.clearInterval(
        game.countdownTimer
      );

      game.countdownTimer = null;

      overlay.textContent = "LOS!";

      window.setTimeout(() => {
        if (!state.game) {
          return;
        }

        overlay.classList.add(
          "hidden"
        );

        startGameClock();
      }, 550);
    }, 850);
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
      (now - state.game.startTime) /
      1000;

    document
      .getElementById("timeValue")
      .textContent = formatNumber(
        state.game.elapsed
      );

    state.game.animationFrame =
      requestAnimationFrame(tick);
  };

  game.animationFrame =
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
    ) > 38
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
    game.progressIndex - 4
  );

  const searchTo = Math.min(
    game.pathPoints.length - 1,
    game.progressIndex + 14
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

  if (nearestDistance <= 28) {
    game.goodSamples += 1;

    game.progressIndex = Math.max(
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
          ) * 100
        );

  const progress = Math.min(
    100,
    Math.round(
      (
        game.progressIndex /
        (
          game.pathPoints.length -
          1
        )
      ) * 100
    )
  );

  document
    .getElementById(
      "accuracyValue"
    )
    .textContent = accuracy;

  document
    .getElementById(
      "progressValue"
    )
    .textContent = progress;

  document
    .getElementById(
      "progressFill"
    )
    .style.width = `${progress}%`;

  drawGame();

  const target =
    game.pathPoints[
      game.pathPoints.length - 1
    ];

  if (
    progress >= 96 &&
    distance(point, target) <= 42
  ) {
    finishGame();
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
    ) / 1000
  );

  if (game.animationFrame) {
    cancelAnimationFrame(
      game.animationFrame
    );
  }

  const accuracy = Math.max(
    1,
    Math.round(
      (
        game.goodSamples /
        Math.max(
          1,
          game.totalSamples
        )
      ) * 100
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

  const amount = Math.max(
    0.05,
    (
      virtualCentimeters *
      (accuracy / 100)
    ) /
    (
      game.elapsed *
      7.2
    )
  );

  const score = Math.round(
    amount * 1000 +
    accuracy * 8 +
    speed * 20
  );

  const result = {
    id:
      `${Date.now()}-` +
      Math.random()
        .toString(16)
        .slice(2),

    playerName:
      state.playerName,

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

  const index = results.findIndex(
    (entry) =>
      entry.id === result.id
  );

  return index >= 0
    ? index + 1
    : null;
}

function getResultComment(result) {
  if (
    result.accuracy >= 95 &&
    result.time <= 5
  ) {
    return (
      "Laser-Nase! Schnell und " +
      "erstaunlich präzise."
    );
  }

  if (result.accuracy >= 90) {
    return (
      "Saubere Spur. Die virtuelle " +
      "Nase war heute konzentriert."
    );
  }

  if (result.time <= 4.5) {
    return (
      "Extrem schnell – aber die " +
      "Kurven waren mutig interpretiert."
    );
  }

  if (result.accuracy < 70) {
    return (
      "Die Spur hatte offenbar andere " +
      "Pläne als dein Finger."
    );
  }

  return (
    "Solide Runde. Beim nächsten " +
    "Versuch ist mehr drin."
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

        <div
          class="result-badge"
          aria-hidden="true"
        >
          🏆
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
          Noch einmal
        </button>

        <button
          id="rankingButton"
          class="btn btn-secondary"
          type="button"
        >
          Bestenliste
        </button>

      </div>

      <button
        id="shareButton"
        class="btn"
        type="button"
      >
        Ergebnis teilen
      </button>

      <p class="disclaimer">
        Alle Mengen und Statistiken
        sind simuliert und frei erfunden.
        Kein echter Konsum wird gemessen
        oder bewertet.
      </p>

    </section>
  `;

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
      renderGame
    );

  document
    .getElementById("rankingButton")
    .addEventListener(
      "click",
      renderLeaderboard
    );

  document
    .getElementById("shareButton")
    .addEventListener(
      "click",
      shareResult
    );
}

async function shareResult() {
  const result =
    state.currentResult;

  if (!result) {
    return;
  }

  const text =
    `${result.playerName} erzielte ` +
    `bei SNIFFIfy ` +
    `${formatNumber(result.amount)} ` +
    `virtuelle g, ` +
    `${result.accuracy} % ` +
    `Genauigkeit und ` +
    `${formatNumber(result.time)} ` +
    `Sekunden. Reine Satire.`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "SNIFFIfy Ergebnis",
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
    if (error?.name !== "AbortError") {
      window.alert(
        "Das Ergebnis konnte nicht geteilt werden."
      );
    }
  }
}

function renderLeaderboard() {
  stopActiveGame();

  const results = loadResults();

  const rows = results.length
    ? results
        .map((result, index) => {
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

          return `
            <div
              class="leaderboard-row${currentClass}"
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
                  · ${result.accuracy} %
                  · ${formatNumber(
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
        })
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
            Die besten lokalen Ergebnisse
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
        Die Bestenliste wird nur lokal
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
        if (state.playerName) {
          renderGame();
        } else {
          renderHome();
        }
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
  stopActiveGame
);

renderHome();