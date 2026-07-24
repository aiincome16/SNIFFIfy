"use strict";

const STORAGE_KEYS = Object.freeze({
  player: "sniffify_player",
  results: "sniffify_results",
  challenge: "sniffify_challenge",
  playerStats: "sniffify_player_stats",
  direction: "sniffify_direction",
  dwarfEnabled: "sniffify_dwarf_enabled",
  dwarfDifficulty: "sniffify_dwarf_difficulty"
});

const CHALLENGES = Object.freeze({
  straight: {
    id: "straight",
    name: "Gerade Linie",
    description: "Einfach und direkt",
    difficulty: 1,
    tolerance: 28,
    lengthCm: 18,
    preview: "M8 42 L84 10"
  },

  wave: {
    id: "wave",
    name: "Wellenritt",
    description: "Weiche, lange Kurven",
    difficulty: 1.08,
    tolerance: 29,
    lengthCm: 26,
    preview: "M4 38 C20 4 35 5 45 30 C57 57 73 55 86 14"
  },

  zigzag: {
    id: "zigzag",
    name: "Zickzack",
    description: "Scharfe Richtungswechsel",
    difficulty: 1.18,
    tolerance: 31,
    lengthCm: 34,
    preview: "M5 40 L22 10 L39 40 L56 10 L73 40 L86 12"
  },

  snake: {
    id: "snake",
    name: "Schlangenlinie",
    description: "Viele kleine Kurven",
    difficulty: 1.14,
    tolerance: 30,
    lengthCm: 38,
    preview:
      "M5 38 C20 7 29 8 38 27 C47 46 58 47 67 26 C74 10 81 10 86 18"
  },

  lightning: {
    id: "lightning",
    name: "Blitzspur",
    description: "Kantig und unruhig",
    difficulty: 1.23,
    tolerance: 32,
    lengthCm: 42,
    preview:
      "M6 40 L28 8 L24 28 L48 18 L42 41 L68 13 L63 31 L86 8"
  },

  spiral: {
    id: "spiral",
    name: "Wirbelwind",
    description: "Schleifen und Drehungen",
    difficulty: 1.28,
    tolerance: 32,
    lengthCm: 48,
    preview:
      "M6 38 C17 11 55 7 73 23 C89 37 70 50 51 43 C34 37 37 20 53 19 C65 19 69 27 65 34"
  },

  heart: {
    id: "heart",
    name: "Herzspur",
    description: "Zwei Bögen und eine Spitze",
    difficulty: 1.2,
    tolerance: 31,
    lengthCm: 36,
    preview:
      "M46 44 C8 24 12 4 30 10 C40 13 46 24 46 24 C46 24 52 13 62 10 C80 4 84 24 46 44"
  },

  random: {
    id: "random",
    name: "Zufallsmodus",
    description: "Jede Runde eine andere Strecke",
    difficulty: 1,
    tolerance: 30,
    lengthCm: 0,
    preview: ""
  }
});

const DIRECTIONS = Object.freeze({
  north: {
    id: "north",
    label: "Norden",
    arrow: "↑",

    destinations: [
      {
        name: "Burg Querfurt",
        distanceM: 1200
      },
      {
        name: "Lutherstadt Eisleben",
        distanceM: 21000
      },
      {
        name: "Hettstedt",
        distanceM: 39000
      },
      {
        name: "Magdeburg",
        distanceM: 98000
      }
    ]
  },

  northeast: {
    id: "northeast",
    label: "Nordosten",
    arrow: "↗",

    destinations: [
      {
        name: "Halle (Saale)",
        distanceM: 36000
      },
      {
        name: "Bitterfeld-Wolfen",
        distanceM: 76000
      },
      {
        name: "Berlin",
        distanceM: 205000
      }
    ]
  },

  east: {
    id: "east",
    label: "Osten",
    arrow: "→",

    destinations: [
      {
        name: "Merseburg",
        distanceM: 30000
      },
      {
        name: "Leipzig",
        distanceM: 69000
      },
      {
        name: "Dresden",
        distanceM: 180000
      }
    ]
  },

  south: {
    id: "south",
    label: "Süden",
    arrow: "↓",

    destinations: [
      {
        name: "Nebra (Unstrut)",
        distanceM: 25000
      },
      {
        name: "Naumburg (Saale)",
        distanceM: 51000
      },
      {
        name: "Jena",
        distanceM: 100000
      }
    ]
  },

  southwest: {
    id: "southwest",
    label: "Südwesten",
    arrow: "↙",

    destinations: [
      {
        name: "Weimar",
        distanceM: 95000
      },
      {
        name: "Erfurt",
        distanceM: 108000
      },
      {
        name: "Frankfurt am Main",
        distanceM: 285000
      }
    ]
  },

  west: {
    id: "west",
    label: "Westen",
    arrow: "←",

    destinations: [
      {
        name: "Sangerhausen",
        distanceM: 47000
      },
      {
        name: "Nordhausen",
        distanceM: 92000
      },
      {
        name: "Kassel",
        distanceM: 175000
      }
    ]
  },

  northwest: {
    id: "northwest",
    label: "Nordwesten",
    arrow: "↖",

    destinations: [
      {
        name: "Quedlinburg",
        distanceM: 85000
      },
      {
        name: "Wernigerode",
        distanceM: 115000
      },
      {
        name: "Hannover",
        distanceM: 210000
      }
    ]
  }
});

const DWARF_LEVELS = Object.freeze({
  cozy: {
    id: "cozy",
    label: "Gemütlich",
    targetSeconds: 24
  },

  busy: {
    id: "busy",
    label: "Fleißig",
    targetSeconds: 16
  },

  racing: {
    id: "racing",
    label: "Rasend",
    targetSeconds: 11
  }
});

const app = document.getElementById("app");

const state = {
  playerName: readStorage(
    STORAGE_KEYS.player,
    ""
  ),

  selectedChallenge: readStorage(
    STORAGE_KEYS.challenge,
    "random"
  ),

  selectedDirection: readStorage(
    STORAGE_KEYS.direction,
    "northeast"
  ),

  dwarfEnabled:
    readStorage(
      STORAGE_KEYS.dwarfEnabled,
      "true"
    ) === "true",

  dwarfDifficulty: readStorage(
    STORAGE_KEYS.dwarfDifficulty,
    "busy"
  ),

  currentChallengeId: null,
  currentResult: null,
  game: null,
  confettiTimeout: null
};

function readStorage(
  key,
  fallback
) {
  try {
    const value =
      localStorage.getItem(key);

    return value === null
      ? fallback
      : value;
  } catch (error) {
    console.error(
      "SNIFFIfy: Lokale Daten konnten nicht gelesen werden.",
      error
    );

    return fallback;
  }
}

function writeStorage(
  key,
  value
) {
  try {
    localStorage.setItem(
      key,
      value
    );

    return true;
  } catch (error) {
    console.error(
      "SNIFFIfy: Lokale Daten konnten nicht gespeichert werden.",
      error
    );

    return false;
  }
}

function loadResults() {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEYS.results
      );

    const parsed =
      raw
        ? JSON.parse(raw)
        : [];

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "SNIFFIfy: Ergebnisse sind ungültig und wurden ignoriert.",
      error
    );

    return [];
  }
}

function saveResults(results) {
  writeStorage(
    STORAGE_KEYS.results,
    JSON.stringify(
      results.slice(0, 50)
    )
  );
}

function loadPlayerStats() {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEYS.playerStats
      );

    const parsed =
      raw
        ? JSON.parse(raw)
        : {};

    return (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    )
      ? parsed
      : {};
  } catch (error) {
    console.error(
      "SNIFFIfy: Spielerstatistiken sind ungültig.",
      error
    );

    return {};
  }
}

function normalizePlayerKey(name) {
  return String(name)
    .trim()
    .toLocaleLowerCase("de-DE");
}

function getPlayerStats(name) {
  const allStats =
    loadPlayerStats();

  const key =
    normalizePlayerKey(name);

  const existing =
    allStats[key];

  return (
    existing &&
    typeof existing === "object"
  )
    ? {
        displayName:
          existing.displayName ||
          name,

        totalCm:
          Number(
            existing.totalCm
          ) || 0,

        rounds:
          Number(
            existing.rounds
          ) || 0,

        winsAgainstDwarf:
          Number(
            existing.winsAgainstDwarf
          ) || 0,

        lossesAgainstDwarf:
          Number(
            existing.lossesAgainstDwarf
          ) || 0
      }
    : {
        displayName: name,
        totalCm: 0,
        rounds: 0,
        winsAgainstDwarf: 0,
        lossesAgainstDwarf: 0
      };
}

function addRoundToPlayerStats(
  result
) {
  const allStats =
    loadPlayerStats();

  const key =
    normalizePlayerKey(
      result.playerName
    );

  const stats =
    getPlayerStats(
      result.playerName
    );

  stats.displayName =
    result.playerName;

  stats.totalCm =
    Number(
      (
        stats.totalCm +
        result.completedLineCm
      ).toFixed(2)
    );

  stats.rounds += 1;

  if (result.dwarfEnabled) {
    if (result.dwarfWon) {
      stats.lossesAgainstDwarf += 1;
    } else {
      stats.winsAgainstDwarf += 1;
    }
  }

  allStats[key] =
    stats;

  writeStorage(
    STORAGE_KEYS.playerStats,
    JSON.stringify(allStats)
  );

  return stats;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

function formatNumber(
  value,
  digits = 2
) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number.toLocaleString(
        "de-DE",
        {
          minimumFractionDigits:
            digits,

          maximumFractionDigits:
            digits
        }
      )
    : "0,00";
}

function formatDistanceFromCm(
  totalCm
) {
  const centimeters =
    Math.max(
      0,
      Number(totalCm) || 0
    );

  if (centimeters < 100) {
    return (
      `${formatNumber(
        centimeters,
        1
      )} cm`
    );
  }

  if (centimeters < 100000) {
    return (
      `${formatNumber(
        centimeters / 100,
        2
      )} m`
    );
  }

  return (
    `${formatNumber(
      centimeters / 100000,
      3
    )} km`
  );
}

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
          M83 40
          C91 40 98 44 102 50
        "
        fill="none"
        stroke="#7c3aed"
        stroke-width="5"
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
      />

      <path
        d="
          M39 29
          H25
          C24 48 31 57 44 59
          M81 29
          H95
          C96 48 89 57 76 59
        "
        fill="none"
        stroke="#18181b"
        stroke-width="5"
        stroke-linecap="round"
      />

      <path
        d="
          M60 74
          V91
          M43 101
          H77
        "
        fill="none"
        stroke="#18181b"
        stroke-width="7"
        stroke-linecap="round"
      />
    </svg>
  `;
}

function dwarfIcon() {
  return `
    <svg
      viewBox="0 0 150 150"
      aria-hidden="true"
    >
      <path
        d="M38 52 L75 12 L112 52 Z"
        fill="#7c3aed"
        stroke="#18181b"
        stroke-width="5"
        stroke-linejoin="round"
      />

      <circle
        cx="75"
        cy="65"
        r="31"
        fill="#f1b99b"
        stroke="#18181b"
        stroke-width="5"
      />

      <path
        d="
          M48 78
          C55 118 95 126 105 78
          C95 96 60 98 48 78
          Z
        "
        fill="#ffffff"
        stroke="#18181b"
        stroke-width="5"
      />

      <circle
        cx="64"
        cy="61"
        r="3"
        fill="#18181b"
      />

      <circle
        cx="87"
        cy="61"
        r="3"
        fill="#18181b"
      />

      <path
        d="
          M73 65
          L68 75
          L78 75
        "
        fill="none"
        stroke="#18181b"
        stroke-width="4"
        stroke-linecap="round"
      />

      <path
        d="
          M104 98
          L132 128
          M122 118
          L139 101
        "
        fill="none"
        stroke="#18181b"
        stroke-width="7"
        stroke-linecap="round"
      />

      <path
        d="
          M128 95
          L144 111
          L134 121
          L118 105
          Z
        "
        fill="#9ca3af"
        stroke="#18181b"
        stroke-width="4"
      />
    </svg>
  `;
}

function iconButton(symbol) {
  return `
    <span
      class="btn-icon"
      aria-hidden="true"
    >
      ${symbol}
    </span>
  `;
}

function challengePreview(
  challenge
) {
  if (
    challenge.id === "random"
  ) {
    return `
      <div
        class="challenge-preview random-preview"
        aria-hidden="true"
      >
        ?
      </div>
    `;
  }

  return `
    <svg
      class="challenge-preview"
      viewBox="0 0 92 52"
      aria-hidden="true"
    >
      <path
        d="${challenge.preview}"
      />
    </svg>
  `;
}

function showFatalError(
  message,
  error = null
) {
  if (error) {
    console.error(
      `SNIFFIfy: ${message}`,
      error
    );
  } else {
    console.error(
      `SNIFFIfy: ${message}`
    );
  }

  if (!app) {
    return;
  }

  cleanupGame();
  removeConfetti();

  app.innerHTML = `
    <section class="screen">
      <div class="card">

        <h1>
          App-Fehler
        </h1>

        <p>
          ${escapeHtml(message)}
        </p>

        <button
          id="fatalReloadButton"
          class="btn btn-primary"
          type="button"
        >
          Neu laden
        </button>

      </div>
    </section>
  `;

  document
    .getElementById(
      "fatalReloadButton"
    )
    ?.addEventListener(
      "click",
      () => location.reload(),
      {
        once: true
      }
    );
}

function validateStartup() {
  if (!app) {
    console.error(
      "SNIFFIfy: Das Hauptelement #app fehlt."
    );

    return false;
  }

  if (!window.PointerEvent) {
    showFatalError(
      "Dieser Browser unterstützt die benötigte Pointer-Steuerung nicht."
    );

    return false;
  }

  if (
    !CHALLENGES[
      state.selectedChallenge
    ]
  ) {
    state.selectedChallenge =
      "random";
  }

  if (
    !DIRECTIONS[
      state.selectedDirection
    ]
  ) {
    state.selectedDirection =
      "northeast";
  }

  if (
    !DWARF_LEVELS[
      state.dwarfDifficulty
    ]
  ) {
    state.dwarfDifficulty =
      "busy";
  }

  return true;
}

function renderHome() {
  cleanupGame();
  removeConfetti();

  state.currentChallengeId =
    null;

  const options =
    Object.values(
      CHALLENGES
    )
      .map((challenge) => {
        const selected =
          state.selectedChallenge ===
          challenge.id;

        const randomClass =
          challenge.id === "random"
            ? " challenge-random"
            : "";

        const lengthText =
          challenge.id === "random"
            ? "zufällige Länge"
            : `${challenge.lengthCm} cm`;

        return `
          <button
            class="challenge-option${selected ? " selected" : ""}${randomClass}"
            type="button"
            data-challenge="${challenge.id}"
            aria-pressed="${selected}"
          >
            ${challengePreview(
              challenge
            )}

            <strong>
              ${escapeHtml(
                challenge.name
              )}
            </strong>

            <span>
              ${escapeHtml(
                challenge.description
              )}
              ·
              ${lengthText}
            </span>
          </button>
        `;
      })
      .join("");

  const directionOptions =
    Object.values(DIRECTIONS)
      .map((direction) => {
        const selected =
          state.selectedDirection ===
          direction.id;

        return `
          <option
            value="${direction.id}"
            ${selected ? "selected" : ""}
          >
            ${direction.arrow}
            ${direction.label}
          </option>
        `;
      })
      .join("");

  const dwarfLevels =
    Object.values(
      DWARF_LEVELS
    )
      .map((level) => {
        const selected =
          state.dwarfDifficulty ===
          level.id;

        return `
          <option
            value="${level.id}"
            ${selected ? "selected" : ""}
          >
            ${level.label}
          </option>
        `;
      })
      .join("");

  const playerStats =
    state.playerName
      ? getPlayerStats(
          state.playerName
        )
      : null;

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

        ${
          playerStats
            ? `
              <p class="player-total-preview">
                Bisher gesammelt:
                <strong>
                  ${formatDistanceFromCm(
                    playerStats.totalCm
                  )}
                </strong>
                in
                ${playerStats.rounds}
                Runden
              </p>
            `
            : ""
        }

      </div>

      <div class="card">

        <h2 class="challenge-section-title">
          Welche Linie möchtest du?
        </h2>

        <div class="challenge-grid">
          ${options}
        </div>

      </div>

      <div class="card settings-card">

        <h2 class="challenge-section-title">
          Reise ab Querfurt
        </h2>

        <label
          class="field-label"
          for="directionSelect"
        >
          Reiserichtung
        </label>

        <select
          id="directionSelect"
          class="select-input"
        >
          ${directionOptions}
        </select>

        <p class="settings-help">
          Die Ortsentfernungen sind
          spielerische Näherungswerte.
          Querfurt bleibt immer der
          Ausgangspunkt.
        </p>

      </div>

      <div class="card dwarf-settings-card">

        <div class="dwarf-settings-head">

          <div class="dwarf-mini">
            ${dwarfIcon()}
          </div>

          <div>

            <h2>
              Schlag den Schaufelzwerg
            </h2>

            <p>
              Er schaufelt die Strecke weg,
              während du zeichnest.
            </p>

          </div>

        </div>

        <label class="toggle-row">

          <input
            id="dwarfToggle"
            type="checkbox"
            ${state.dwarfEnabled ? "checked" : ""}
          >

          <span
            class="toggle-switch"
            aria-hidden="true"
          ></span>

          <span>
            Zwerg als Gegner aktiv
          </span>

        </label>

        <label
          class="field-label"
          for="dwarfDifficulty"
        >
          Schwierigkeit
        </label>

        <select
          id="dwarfDifficulty"
          class="select-input"
          ${state.dwarfEnabled ? "" : "disabled"}
        >
          ${dwarfLevels}
        </select>

      </div>

      <div class="button-stack">

        <button
          id="startGameButton"
          class="btn btn-primary"
          type="button"
        >
          ${iconButton("▶")}
          Challenge starten
        </button>

        <button
          id="leaderboardButton"
          class="btn btn-secondary"
          type="button"
        >
          ${iconButton("🏆")}
          Bestenliste ansehen
        </button>

      </div>

      <div class="notice">
        Setze den Finger auf den
        violetten Startpunkt und folge
        der Spur bis zum pinken Ziel.
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
          const challengeId =
            button.dataset.challenge;

          if (
            !CHALLENGES[
              challengeId
            ]
          ) {
            return;
          }

          state.selectedChallenge =
            challengeId;

          writeStorage(
            STORAGE_KEYS.challenge,
            challengeId
          );

          document
            .querySelectorAll(
              "[data-challenge]"
            )
            .forEach((option) => {
              const selected =
                option.dataset.challenge ===
                challengeId;

              option.classList.toggle(
                "selected",
                selected
              );

              option.setAttribute(
                "aria-pressed",
                String(selected)
              );
            });
        }
      );
    });

  document
    .getElementById(
      "directionSelect"
    )
    ?.addEventListener(
      "change",
      (event) => {
        if (
          !DIRECTIONS[
            event.target.value
          ]
        ) {
          return;
        }

        state.selectedDirection =
          event.target.value;

        writeStorage(
          STORAGE_KEYS.direction,
          state.selectedDirection
        );
      }
    );

  const dwarfToggle =
    document.getElementById(
      "dwarfToggle"
    );

  const dwarfDifficulty =
    document.getElementById(
      "dwarfDifficulty"
    );

  dwarfToggle?.addEventListener(
    "change",
    () => {
      state.dwarfEnabled =
        dwarfToggle.checked;

      writeStorage(
        STORAGE_KEYS.dwarfEnabled,
        String(
          state.dwarfEnabled
        )
      );

      if (dwarfDifficulty) {
        dwarfDifficulty.disabled =
          !state.dwarfEnabled;
      }
    }
  );

  dwarfDifficulty?.addEventListener(
    "change",
    () => {
      if (
        !DWARF_LEVELS[
          dwarfDifficulty.value
        ]
      ) {
        return;
      }

      state.dwarfDifficulty =
        dwarfDifficulty.value;

      writeStorage(
        STORAGE_KEYS.dwarfDifficulty,
        state.dwarfDifficulty
      );
    }
  );

  document
    .getElementById(
      "startGameButton"
    )
    ?.addEventListener(
      "click",
      () => {
        const name =
          nameInput?.value.trim() ||
          "";

        if (!name) {
          nameInput?.setAttribute(
            "aria-invalid",
            "true"
          );

          nameInput?.focus();

          return;
        }

        nameInput.removeAttribute(
          "aria-invalid"
        );

        state.playerName =
          name.slice(0, 24);

        writeStorage(
          STORAGE_KEYS.player,
          state.playerName
        );

        state.currentChallengeId =
          resolveChallengeId();

        renderGame();
      }
    );

  document
    .getElementById(
      "leaderboardButton"
    )
    ?.addEventListener(
      "click",
      renderLeaderboard
    );
}

function resolveChallengeId() {
  if (
    state.selectedChallenge !==
      "random" &&
    CHALLENGES[
      state.selectedChallenge
    ]
  ) {
    return state.selectedChallenge;
  }

  const ids =
    Object.keys(
      CHALLENGES
    ).filter(
      (id) => id !== "random"
    );

  return ids[
    Math.floor(
      Math.random() *
      ids.length
    )
  ];
}

function renderGame() {
  cleanupGame();
  removeConfetti();

  const challenge =
    CHALLENGES[
      state.currentChallengeId
    ];

  if (!challenge) {
    showFatalError(
      "Die ausgewählte Strecke konnte nicht geladen werden."
    );

    return;
  }

  const dwarfPanel =
    state.dwarfEnabled
      ? `
        <div class="dwarf-race-panel">

          <div class="dwarf-race-info">

            <div
              id="dwarfCharacter"
              class="dwarf-character"
            >
              ${dwarfIcon()}
            </div>

            <div>

              <strong>
                Schaufelzwerg
              </strong>

              <span>
                ${
                  DWARF_LEVELS[
                    state.dwarfDifficulty
                  ].label
                }
              </span>

            </div>

          </div>

          <div class="dwarf-progress-track">

            <div
              id="dwarfProgressFill"
              class="dwarf-progress-fill"
            ></div>

          </div>

          <div class="race-numbers">

            <span>
              Du:
              <strong id="playerRaceValue">
                0 %
              </strong>
            </span>

            <span>
              Zwerg:
              <strong id="dwarfRaceValue">
                0 %
              </strong>
            </span>

          </div>

        </div>
      `
      : "";

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

          <h2>
            Challenge
          </h2>

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
          ${challenge.lengthCm} cm
          ·
          ${escapeHtml(
            challenge.description
          )}
        </p>

        ${dwarfPanel}

        <div class="game-meta">

          <div class="meta-box">

            <strong id="timeValue">
              0,00
            </strong>

            <span>
              Sekunden
            </span>

          </div>

          <div class="meta-box">

            <strong id="accuracyValue">
              100
            </strong>

            <span>
              Genauigkeit %
            </span>

          </div>

          <div class="meta-box">

            <strong id="progressValue">
              0
            </strong>

            <span>
              Fortschritt %
            </span>

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

              <h3>
                Bereit?
              </h3>

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
                ${iconButton("▶")}
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
    .getElementById(
      "backButton"
    )
    ?.addEventListener(
      "click",
      renderHome
    );

  document
    .getElementById(
      "prepareButton"
    )
    ?.addEventListener(
      "click",
      beginCountdown,
      {
        once: true
      }
    );

  try {
    setupCanvas(challenge);
  } catch (error) {
    showFatalError(
      "Die Spieloberfläche konnte nicht vorbereitet werden.",
      error
    );
  }
}

function setupCanvas(challenge) {
  const canvas =
    document.getElementById(
      "gameCanvas"
    );

  if (
    !(
      canvas instanceof
      HTMLCanvasElement
    )
  ) {
    throw new Error(
      "Canvas #gameCanvas fehlt."
    );
  }

  const rect =
    canvas.getBoundingClientRect();

  if (
    rect.width < 100 ||
    rect.height < 100
  ) {
    throw new Error(
      "Canvas besitzt keine gültige sichtbare Größe."
    );
  }

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "2D-Canvas-Kontext ist nicht verfügbar."
    );
  }

  const dpr =
    Math.min(
      window.devicePixelRatio ||
      1,
      2
    );

  canvas.width =
    Math.round(
      rect.width * dpr
    );

  canvas.height =
    Math.round(
      rect.height * dpr
    );

  context.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  const pathPoints =
    createPath(
      challenge.id,
      rect.width,
      rect.height
    );

  if (
    !Array.isArray(
      pathPoints
    ) ||
    pathPoints.length < 20
  ) {
    throw new Error(
      "Die Strecke enthält zu wenige gültige Punkte."
    );
  }

  state.game = {
    canvas,
    context,

    width:
      rect.width,

    height:
      rect.height,

    challenge,
    pathPoints,

    userTrail: [],

    running: false,
    finished: false,

    pointerActive: false,
    pointerId: null,

    startTime: 0,
    elapsed: 0,

    progressIndex: 0,
    samples: [],

    totalUserDistance: 0,
    lastUserPoint: null,

    markerPhase: 0,
    markerFrame: null,
    clockFrame: null,
    dwarfFrame: null,

    countdownTimer: null,
    countdownTimeout: null,

    dwarfProgress: 0,
    dwarfWon: false
  };

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
    handlePointerEnd
  );

  canvas.addEventListener(
    "pointercancel",
    handlePointerEnd
  );

  canvas.addEventListener(
    "lostpointercapture",
    handlePointerEnd
  );

  canvas.addEventListener(
    "contextmenu",
    preventDefault
  );

  drawGame();
  animateMarkers();
}

function preventDefault(event) {
  event.preventDefault();
}

function bounds(
  width,
  height
) {
  return {
    centerX:
      width / 2,

    startY:
      height - 42,

    endY:
      42,

    minX:
      38,

    maxX:
      width - 38
  };
}

function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );
}

function createPath(
  id,
  width,
  height
) {
  const generators = {
    straight:
      createStraightPath,

    wave:
      createWavePath,

    zigzag:
      createZigzagPath,

    snake:
      createSnakePath,

    lightning:
      createLightningPath,

    spiral:
      createSpiralPath,

    heart:
      createHeartPath
  };

  return (
    generators[id] ||
    createWavePath
  )(
    width,
    height
  );
}

function createStraightPath(
  width,
  height
) {
  const b =
    bounds(
      width,
      height
    );

  return interpolateAnchors(
    [
      {
        x: b.centerX,
        y: b.startY
      },
      {
        x: b.centerX,
        y: b.endY
      }
    ],
    180
  );
}

function createWavePath(
  width,
  height
) {
  const b =
    bounds(
      width,
      height
    );

  const points = [];

  const offset =
    Math.random() *
    Math.PI *
    2;

  for (
    let index = 0;
    index <= 190;
    index += 1
  ) {
    const t =
      index / 190;

    const y =
      b.startY +
      (
        b.endY -
        b.startY
      ) *
      t;

    const x =
      b.centerX +
      Math.sin(
        t *
        Math.PI *
        3.2 +
        offset
      ) *
      width *
      0.22 +
      Math.sin(
        t *
        Math.PI *
        7.1
      ) *
      width *
      0.04;

    points.push({
      x:
        clamp(
          x,
          b.minX,
          b.maxX
        ),
      y
    });
  }

  return points;
}

function createSnakePath(
  width,
  height
) {
  const b =
    bounds(
      width,
      height
    );

  const points = [];

  const offset =
    Math.random() *
    Math.PI *
    2;

  for (
    let index = 0;
    index <= 210;
    index += 1
  ) {
    const t =
      index / 210;

    const y =
      b.startY +
      (
        b.endY -
        b.startY
      ) *
      t;

    const amplitude =
      width *
      (
        0.13 +
        Math.sin(
          t *
          Math.PI
        ) *
        0.06
      );

    points.push({
      x:
        clamp(
          b.centerX +
          Math.sin(
            t *
            Math.PI *
            7.2 +
            offset
          ) *
          amplitude,
          b.minX,
          b.maxX
        ),

      y
    });
  }

  return points;
}

function createZigzagPath(
  width,
  height
) {
  const b =
    bounds(
      width,
      height
    );

  const anchors = [];
  const segments = 9;

  for (
    let index = 0;
    index <= segments;
    index += 1
  ) {
    const t =
      index /
      segments;

    const y =
      b.startY +
      (
        b.endY -
        b.startY
      ) *
      t;

    const x =
      (
        index === 0 ||
        index === segments
      )
        ? b.centerX
        : b.centerX +
          (
            index % 2 === 0
              ? width * 0.27
              : -width * 0.27
          );

    anchors.push({
      x:
        clamp(
          x,
          b.minX,
          b.maxX
        ),

      y
    });
  }

  return interpolateAnchors(
    anchors,
    24
  );
}

function createLightningPath(
  width,
  height
) {
  const b =
    bounds(
      width,
      height
    );

  const anchors = [
    [0.5, 0.92],
    [0.28, 0.82],
    [0.68, 0.69],
    [0.40, 0.60],
    [0.75, 0.47],
    [0.34, 0.34],
    [0.63, 0.23],
    [0.5, 0.09]
  ].map(
    ([x, y]) => ({
      x:
        clamp(
          width * x,
          b.minX,
          b.maxX
        ),

      y:
        height * y
    })
  );

  return interpolateAnchors(
    anchors,
    28
  );
}

function createSpiralPath(
  width,
  height
) {
  const b =
    bounds(
      width,
      height
    );

  const points = [];

  for (
    let index = 0;
    index <= 230;
    index += 1
  ) {
    const t =
      index / 230;

    const y =
      b.startY +
      (
        b.endY -
        b.startY
      ) *
      t;

    const loopBoost =
      Math.sin(
        t *
        Math.PI
      );

    const x =
      b.centerX +
      Math.sin(
        t *
        Math.PI *
        5.2
      ) *
      width *
      (
        0.1 +
        loopBoost *
        0.19
      ) +
      Math.sin(
        t *
        Math.PI *
        10.4
      ) *
      width *
      0.04;

    points.push({
      x:
        clamp(
          x,
          b.minX,
          b.maxX
        ),

      y
    });
  }

  return points;
}

function createHeartPath(
  width,
  height
) {
  const b =
    bounds(
      width,
      height
    );

  const points = [];

  points.push(
    ...interpolateAnchors(
      [
        {
          x: b.centerX,
          y: b.startY
        },
        {
          x: b.centerX,
          y:
            height *
            0.36
        }
      ],
      70
    )
  );

  for (
    let index = 0;
    index <= 180;
    index += 1
  ) {
    const t =
      (
        index /
        180
      ) *
      Math.PI *
      2;

    const normalizedX =
      16 *
      Math.sin(t) ** 3;

    const normalizedY =
      13 *
      Math.cos(t) -
      5 *
      Math.cos(2 * t) -
      2 *
      Math.cos(3 * t) -
      Math.cos(4 * t);

    points.push({
      x:
        clamp(
          b.centerX +
          normalizedX *
          width *
          0.016,
          b.minX,
          b.maxX
        ),

      y:
        height *
        0.22 -
        normalizedY *
        height *
        0.008
    });
  }

  points.push(
    ...interpolateAnchors(
      [
        points[
          points.length - 1
        ],
        {
          x: b.centerX,
          y: b.endY
        }
      ],
      60
    )
  );

  return points;
}

function interpolateAnchors(
  anchors,
  stepsPerSegment
) {
  const points = [];

  for (
    let index = 0;
    index <
    anchors.length - 1;
    index += 1
  ) {
    const start =
      anchors[index];

    const end =
      anchors[index + 1];

    for (
      let step = 0;
      step <
      stepsPerSegment;
      step += 1
    ) {
      const t =
        step /
        stepsPerSegment;

      points.push({
        x:
          start.x +
          (
            end.x -
            start.x
          ) *
          t,

        y:
          start.y +
          (
            end.y -
            start.y
          ) *
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
  const game =
    state.game;

  if (
    !game ||
    game.finished
  ) {
    return;
  }

  game.markerPhase +=
    0.06;

  drawGame();

  game.markerFrame =
    requestAnimationFrame(
      animateMarkers
    );
}

function drawGame() {
  const game =
    state.game;

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

  context.lineCap =
    "round";

  context.lineJoin =
    "round";

  const dwarfIndex =
    state.dwarfEnabled
      ? Math.floor(
          game.dwarfProgress *
          (
            pathPoints.length -
            1
          )
        )
      : 0;

  const remainingPath =
    pathPoints.slice(
      dwarfIndex
    );

  if (dwarfIndex > 0) {
    drawPolyline(
      context,
      pathPoints.slice(
        0,
        dwarfIndex + 1
      ),
      "rgba(156,163,175,.25)",
      18
    );
  }

  drawPolyline(
    context,
    remainingPath,
    "#18181b",
    20
  );

  drawPolyline(
    context,
    remainingPath,
    "#7c3aed",
    12
  );

  context.setLineDash(
    [3, 14]
  );

  drawPolyline(
    context,
    remainingPath,
    "rgba(255,255,255,.78)",
    3
  );

  context.setLineDash([]);

  drawSegmentedTrail(
    context,
    userTrail.filter(
      (point) =>
        point.correct
    ),
    "rgba(34,197,94,.9)",
    7
  );

  drawSegmentedTrail(
    context,
    userTrail.filter(
      (point) =>
        !point.correct
    ),
    "rgba(220,38,38,.85)",
    7
  );

  const pulse =
    Math.sin(
      game.markerPhase
    ) *
    3;

  drawMarker(
    context,
    pathPoints[0],
    "#7c3aed",
    "START",
    21 + pulse
  );

  drawMarker(
    context,
    pathPoints[
      pathPoints.length - 1
    ],
    "#ec4899",
    "ZIEL",
    21 - pulse
  );
}

function drawPolyline(
  context,
  points,
  strokeStyle,
  lineWidth
) {
  if (points.length < 2) {
    return;
  }

  context.beginPath();

  context.moveTo(
    points[0].x,
    points[0].y
  );

  for (
    let index = 1;
    index < points.length;
    index += 1
  ) {
    context.lineTo(
      points[index].x,
      points[index].y
    );
  }

  context.strokeStyle =
    strokeStyle;

  context.lineWidth =
    lineWidth;

  context.stroke();
}

function drawSegmentedTrail(
  context,
  points,
  strokeStyle,
  lineWidth
) {
  if (points.length < 2) {
    return;
  }

  context.beginPath();

  let previous =
    null;

  for (
    const point of points
  ) {
    if (
      !previous ||
      point.sampleIndex !==
      previous.sampleIndex + 1
    ) {
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

    previous =
      point;
  }

  context.strokeStyle =
    strokeStyle;

  context.lineWidth =
    lineWidth;

  context.stroke();
}

function drawMarker(
  context,
  point,
  color,
  label,
  radius
) {
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
      ? "rgba(124,58,237,.18)"
      : "rgba(236,72,153,.18)";

  context.fill();

  context.beginPath();

  context.arc(
    point.x,
    point.y,
    radius,
    0,
    Math.PI * 2
  );

  context.fillStyle =
    color;

  context.fill();

  context.lineWidth =
    3;

  context.strokeStyle =
    "#18181b";

  context.stroke();

  context.fillStyle =
    "#ffffff";

  context.font =
    "900 9px Arial";

  context.textAlign =
    "center";

  context.textBaseline =
    "middle";

  context.fillText(
    label,
    point.x,
    point.y
  );
}

function beginCountdown() {
  const game =
    state.game;

  if (!game) {
    return;
  }

  document
    .getElementById(
      "gameMessage"
    )
    ?.classList.add(
      "hidden"
    );

  const overlay =
    document.getElementById(
      "countdownOverlay"
    );

  if (!overlay) {
    showFatalError(
      "Der Countdown konnte nicht angezeigt werden."
    );

    return;
  }

  overlay.classList.remove(
    "hidden"
  );

  let count = 3;

  setCountdownValue(
    overlay,
    count
  );

  game.countdownTimer =
    window.setInterval(
      () => {
        count -= 1;

        if (count > 0) {
          setCountdownValue(
            overlay,
            count
          );

          return;
        }

        clearInterval(
          game.countdownTimer
        );

        game.countdownTimer =
          null;

        setCountdownValue(
          overlay,
          "LOS!"
        );

        game.countdownTimeout =
          window.setTimeout(
            () => {
              if (!state.game) {
                return;
              }

              overlay.classList.add(
                "hidden"
              );

              startRound();
            },
            550
          );
      },
      850
    );
}

function setCountdownValue(
  overlay,
  value
) {
  overlay.classList.remove(
    "countdown-pop"
  );

  void overlay.offsetWidth;

  overlay.textContent =
    value;

  overlay.classList.add(
    "countdown-pop"
  );
}

function startRound() {
  const game =
    state.game;

  if (!game) {
    return;
  }

  game.running =
    true;

  game.startTime =
    performance.now();

  const updateClock =
    (now) => {
      const current =
        state.game;

      if (
        !current ||
        !current.running ||
        current.finished
      ) {
        return;
      }

      current.elapsed =
        (
          now -
          current.startTime
        ) /
        1000;

      const timeElement =
        document.getElementById(
          "timeValue"
        );

      if (timeElement) {
        timeElement.textContent =
          formatNumber(
            current.elapsed
          );
      }

      current.clockFrame =
        requestAnimationFrame(
          updateClock
        );
    };

  game.clockFrame =
    requestAnimationFrame(
      updateClock
    );

  if (state.dwarfEnabled) {
    startDwarfRace();
  }
}

function startDwarfRace() {
  const game =
    state.game;

  const level =
    DWARF_LEVELS[
      state.dwarfDifficulty
    ];

  if (
    !game ||
    !level
  ) {
    return;
  }

  const animateDwarf =
    (now) => {
      const current =
        state.game;

      if (
        !current ||
        !current.running ||
        current.finished
      ) {
        return;
      }

      const elapsed =
        (
          now -
          current.startTime
        ) /
        1000;

      current.dwarfProgress =
        clamp(
          elapsed /
          level.targetSeconds,
          0,
          1
        );

      updateDwarfUi(
        current.dwarfProgress
      );

      drawGame();

      const playerProgress =
        current.progressIndex /
        (
          current.pathPoints.length -
          1
        );

      const gracePassed =
        elapsed > 3;

      if (
        current.dwarfProgress >= 1 ||
        (
          gracePassed &&
          current.dwarfProgress >
          playerProgress +
          0.035
        )
      ) {
        current.dwarfWon =
          true;

        finishRound(
          "dwarf"
        );

        return;
      }

      current.dwarfFrame =
        requestAnimationFrame(
          animateDwarf
        );
    };

  game.dwarfFrame =
    requestAnimationFrame(
      animateDwarf
    );
}

function updateDwarfUi(
  progress
) {
  const percent =
    Math.round(
      progress * 100
    );

  const fill =
    document.getElementById(
      "dwarfProgressFill"
    );

  const value =
    document.getElementById(
      "dwarfRaceValue"
    );

  const character =
    document.getElementById(
      "dwarfCharacter"
    );

  if (fill) {
    fill.style.width =
      `${percent}%`;
  }

  if (value) {
    value.textContent =
      `${percent} %`;
  }

  if (character) {
    character.style.left =
      `calc(${percent}% - 28px)`;
  }
}

function canvasPoint(event) {
  const game =
    state.game;

  const rect =
    game.canvas
      .getBoundingClientRect();

  return {
    x:
      event.clientX -
      rect.left,

    y:
      event.clientY -
      rect.top
  };
}

function pointDistance(
  a,
  b
) {
  return Math.hypot(
    a.x - b.x,
    a.y - b.y
  );
}

function handlePointerDown(
  event
) {
  const game =
    state.game;

  if (
    !game ||
    !game.running ||
    game.finished ||
    game.pointerActive
  ) {
    return;
  }

  event.preventDefault();

  const point =
    canvasPoint(event);

  if (
    pointDistance(
      point,
      game.pathPoints[0]
    ) > 44
  ) {
    flashCanvasError();

    return;
  }

  game.pointerActive =
    true;

  game.pointerId =
    event.pointerId;

  game.canvas
    .setPointerCapture(
      event.pointerId
    );

  processPointerPoint(
    point
  );
}

function handlePointerMove(
  event
) {
  const game =
    state.game;

  if (
    !game ||
    !game.running ||
    game.finished ||
    !game.pointerActive ||
    event.pointerId !==
    game.pointerId
  ) {
    return;
  }

  event.preventDefault();

  processPointerPoint(
    canvasPoint(event)
  );
}

function handlePointerEnd(
  event
) {
  const game =
    state.game;

  if (
    !game ||
    event.pointerId !==
    game.pointerId
  ) {
    return;
  }

  game.pointerActive =
    false;

  game.pointerId =
    null;

  if (
    game.canvas
      .hasPointerCapture?.(
        event.pointerId
      )
  ) {
    game.canvas
      .releasePointerCapture(
        event.pointerId
      );
  }
}

function flashCanvasError() {
  document
    .querySelector(
      ".canvas-wrap"
    )
    ?.animate(
      [
        {
          boxShadow:
            "0 0 0 0 rgba(220,38,38,0)"
        },
        {
          boxShadow:
            "0 0 0 7px rgba(220,38,38,.35)"
        },
        {
          boxShadow:
            "0 0 0 0 rgba(220,38,38,0)"
        }
      ],
      {
        duration: 420
      }
    );
}

function processPointerPoint(
  point
) {
  const game =
    state.game;

  if (!game) {
    return;
  }

  if (game.lastUserPoint) {
    game.totalUserDistance +=
      pointDistance(
        game.lastUserPoint,
        point
      );
  }

  game.lastUserPoint =
    point;

  const nearest =
    findNearestPathPoint(
      point,
      game.pathPoints,
      game.progressIndex
    );

  const correct =
    nearest.distance <=
    game.challenge.tolerance;

  if (correct) {
    game.progressIndex =
      Math.max(
        game.progressIndex,
        nearest.index
      );
  }

  const sampleIndex =
    game.samples.length;

  game.samples.push({
    distance:
      nearest.distance,

    correct,

    pathIndex:
      nearest.index
  });

  game.userTrail.push({
    ...point,
    correct,
    sampleIndex
  });

  const metrics =
    calculateLiveMetrics(
      game
    );

  updateGameMeta(
    metrics.accuracy,
    metrics.progress
  );

  drawGame();

  const target =
    game.pathPoints[
      game.pathPoints.length - 1
    ];

  if (
    metrics.progress >= 97 &&
    pointDistance(
      point,
      target
    ) <= 48
  ) {
    finishRound(
      "player"
    );
  }
}

function findNearestPathPoint(
  point,
  points,
  progressIndex
) {
  const start =
    Math.max(
      0,
      progressIndex - 8
    );

  const end =
    Math.min(
      points.length - 1,
      progressIndex + 28
    );

  let nearestIndex =
    progressIndex;

  let nearestDistance =
    Number.POSITIVE_INFINITY;

  for (
    let index = start;
    index <= end;
    index += 1
  ) {
    const distance =
      pointDistance(
        point,
        points[index]
      );

    if (
      distance <
      nearestDistance
    ) {
      nearestDistance =
        distance;

      nearestIndex =
        index;
    }
  }

  return {
    index:
      nearestIndex,

    distance:
      nearestDistance
  };
}

function calculateLiveMetrics(
  game
) {
  const correctSamples =
    game.samples.filter(
      (sample) =>
        sample.correct
    ).length;

  const accuracy =
    game.samples.length
      ? Math.round(
          (
            correctSamples /
            game.samples.length
          ) *
          100
        )
      : 100;

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

  return {
    accuracy,
    progress
  };
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

  const playerRaceValue =
    document.getElementById(
      "playerRaceValue"
    );

  if (accuracyElement) {
    accuracyElement.textContent =
      String(accuracy);
  }

  if (progressElement) {
    progressElement.textContent =
      String(progress);
  }

  if (progressFill) {
    progressFill.style.width =
      `${progress}%`;
  }

  if (playerRaceValue) {
    playerRaceValue.textContent =
      `${progress} %`;
  }
}

function finishRound(winner) {
  const game =
    state.game;

  if (
    !game ||
    game.finished
  ) {
    return;
  }

  game.finished =
    true;

  game.running =
    false;

  game.dwarfWon =
    winner === "dwarf";

  game.elapsed =
    Math.max(
      0.5,
      (
        performance.now() -
        game.startTime
      ) /
      1000
    );

  cancelGameFrames(game);

  const result =
    evaluateRound(game);

  const stats =
    addRoundToPlayerStats(
      result
    );

  result.playerTotalCm =
    stats.totalCm;

  result.playerRounds =
    stats.rounds;

  state.currentResult =
    result;

  const results =
    loadResults();

  results.push(result);

  results.sort(
    (
      first,
      second
    ) =>
      second.score -
      first.score
  );

  saveResults(results);

  window.setTimeout(
    renderResult,
    250
  );
}

function evaluateRound(game) {
  const samples =
    game.samples;

  const distances =
    samples.map(
      (sample) =>
        sample.distance
    );

  const averageDeviationPx =
    distances.length
      ? distances.reduce(
          (
            sum,
            value
          ) =>
            sum + value,
          0
        ) /
        distances.length
      : Math.min(
          game.width,
          game.height
        );

  const maximumDeviationPx =
    distances.length
      ? Math.max(
          ...distances
        )
      : Math.min(
          game.width,
          game.height
        );

  const correctSamples =
    samples.filter(
      (sample) =>
        sample.correct
    ).length;

  const accuracy =
    samples.length
      ? (
          correctSamples /
          samples.length
        ) *
        100
      : 0;

  const coverage =
    Math.min(
      100,
      (
        game.progressIndex /
        (
          game.pathPoints.length -
          1
        )
      ) *
      100
    );

  const scaleReference =
    Math.max(
      1,
      Math.min(
        game.width,
        game.height
      )
    );

  const averageDeviationPercent =
    (
      averageDeviationPx /
      scaleReference
    ) *
    100;

  const maximumDeviationPercent =
    (
      maximumDeviationPx /
      scaleReference
    ) *
    100;

  const overall =
    clamp(
      Math.round(
        clamp(
          accuracy,
          0,
          100
        ) *
        0.45 +
        clamp(
          coverage,
          0,
          100
        ) *
        0.38 +
        clamp(
          100 -
          averageDeviationPercent *
          8,
          0,
          100
        ) *
        0.17
      ),
      0,
      100
    );

  const completedLineCm =
    Number(
      (
        game.challenge.lengthCm *
        (
          coverage /
          100
        )
      ).toFixed(2)
    );

  const speedCmPerSecond =
    completedLineCm /
    game.elapsed;

  const amount =
    Math.max(
      0.05,
      (
        completedLineCm *
        (
          overall /
          100
        ) *
        game.challenge.difficulty
      ) /
      (
        game.elapsed *
        7.2
      )
    );

  const dwarfPenalty =
    game.dwarfWon
      ? 900
      : 0;

  const score =
    Math.max(
      0,
      Math.round(
        overall *
        100 +
        speedCmPerSecond *
        30 +
        game.challenge.difficulty *
        500 -
        dwarfPenalty
      )
    );

  return {
    id:
      `${Date.now()}-` +
      Math.random()
        .toString(16)
        .slice(2),

    playerName:
      state.playerName,

    challengeId:
      game.challenge.id,

    challengeName:
      game.challenge.name,

    lineLengthCm:
      game.challenge.lengthCm,

    completedLineCm,

    time:
      Number(
        game.elapsed.toFixed(2)
      ),

    overall,

    accuracy:
      Number(
        accuracy.toFixed(1)
      ),

    coverage:
      Number(
        coverage.toFixed(1)
      ),

    averageDeviation:
      Number(
        averageDeviationPercent
          .toFixed(2)
      ),

    maximumDeviation:
      Number(
        maximumDeviationPercent
          .toFixed(2)
      ),

    speed:
      Number(
        speedCmPerSecond
          .toFixed(2)
      ),

    amount:
      Number(
        amount.toFixed(2)
      ),

    score,

    directionId:
      state.selectedDirection,

    dwarfEnabled:
      state.dwarfEnabled,

    dwarfDifficulty:
      state.dwarfDifficulty,

    dwarfWon:
      game.dwarfWon,

    createdAt:
      new Date()
        .toISOString()
  };
}

function getJourneyProgress(
  totalCm,
  directionId
) {
  const direction =
    DIRECTIONS[
      directionId
    ] ||
    DIRECTIONS.northeast;

  const totalM =
    totalCm / 100;

  let previousDistance = 0;
  let reached = [];
  let next = null;

  for (
    const destination of
    direction.destinations
  ) {
    if (
      totalM >=
      destination.distanceM
    ) {
      reached.push(
        destination
      );

      previousDistance =
        destination.distanceM;
    } else {
      next =
        destination;

      break;
    }
  }

  if (!next) {
    const last =
      direction.destinations[
        direction.destinations.length -
        1
      ];

    return {
      direction,
      totalM,
      reached,
      next: null,
      progress: 100,
      remainingM: 0,
      lastReached: last
    };
  }

  const segmentLength =
    Math.max(
      1,
      next.distanceM -
      previousDistance
    );

  const segmentProgress =
    clamp(
      (
        (
          totalM -
          previousDistance
        ) /
        segmentLength
      ) *
      100,
      0,
      100
    );

  return {
    direction,
    totalM,
    reached,
    next,
    progress:
      segmentProgress,

    remainingM:
      Math.max(
        0,
        next.distanceM -
        totalM
      ),

    lastReached:
      reached[
        reached.length - 1
      ] ||
      null
  };
}

function formatRemainingMeters(
  meters
) {
  if (meters < 1000) {
    return (
      `${formatNumber(
        meters,
        0
      )} m`
    );
  }

  return (
    `${formatNumber(
      meters / 1000,
      2
    )} km`
  );
}

function resultComment(result) {
  if (
    result.dwarfEnabled &&
    result.dwarfWon
  ) {
    return (
      "Der Schaufelzwerg hat deine Spur eingeholt und zuerst weggeschaufelt."
    );
  }

  if (
    result.dwarfEnabled &&
    !result.dwarfWon
  ) {
    return (
      "Du warst schneller als der Schaufelzwerg und hast die Strecke gerettet."
    );
  }

  if (result.overall >= 95) {
    return (
      "Präzisions-Nase: fast die komplette Spur sauber getroffen."
    );
  }

  if (result.overall >= 85) {
    return (
      "Sehr starke Runde mit nur kleinen Abweichungen."
    );
  }

  if (result.overall >= 70) {
    return (
      "Solide Spur. Tempo und Genauigkeit waren ausgewogen."
    );
  }

  if (result.overall >= 50) {
    return (
      "Die Strecke wurde geschafft, aber mehrere Kurven gingen verloren."
    );
  }

  return (
    "Die Linie und dein Finger waren heute nicht derselben Meinung."
  );
}

function resultRank(result) {
  const index =
    loadResults()
      .findIndex(
        (entry) =>
          entry.id ===
          result.id
      );

  return index >= 0
    ? index + 1
    : null;
}

function renderResult() {
  cleanupGame();

  const result =
    state.currentResult;

  if (!result) {
    renderHome();

    return;
  }

  const rank =
    resultRank(result);

  const journey =
    getJourneyProgress(
      result.playerTotalCm,
      result.directionId
    );

  const journeyText =
    journey.next
      ? (
          `Nächstes Ziel: ` +
          `${journey.next.name} · ` +
          `noch ` +
          `${formatRemainingMeters(
            journey.remainingM
          )}`
        )
      : (
          `Du bist weiter als ` +
          `${journey.lastReached?.name || "das letzte Ziel"} ` +
          `gekommen.`
        );

  const dwarfClass =
    result.dwarfEnabled
      ? (
          result.dwarfWon
            ? " dwarf-result-lost"
            : " dwarf-result-won"
        )
      : "";

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

          <h2>
            Deine Auswertung
          </h2>

          <p>
            ${escapeHtml(
              result.playerName
            )}
          </p>

        </div>

      </div>

      <div
        class="card result-hero${dwarfClass}"
      >

        <div class="result-badge">
          ${
            result.dwarfEnabled
              ? dwarfIcon()
              : trophyIcon()
          }
        </div>

        <h2>
          ${
            result.dwarfEnabled
              ? (
                  result.dwarfWon
                    ? "Der Zwerg gewinnt"
                    : "Du gewinnst"
                )
              : "Gesamtergebnis"
          }
        </h2>

        <p class="result-amount">
          ${result.overall} %
        </p>

        <p class="result-label">
          aus Treffern, Abweichung
          und Vollständigkeit
        </p>

        <div class="result-challenge">
          ${escapeHtml(
            result.challengeName
          )}
          ·
          ${formatNumber(
            result.completedLineCm,
            1
          )}
          von
          ${result.lineLengthCm}
          cm
        </div>

      </div>

      <div class="card journey-card">

        <div class="journey-head">

          <div class="compass">
            ${journey.direction.arrow}
          </div>

          <div>

            <h2>
              Deine Reise ab Querfurt
            </h2>

            <p>
              ${journey.direction.label}
            </p>

          </div>

        </div>

        <div class="journey-total">

          Gesamtstrecke:

          <strong>
            ${formatDistanceFromCm(
              result.playerTotalCm
            )}
          </strong>

        </div>

        <div class="journey-progress-track">

          <div
            class="journey-progress-fill"
            style="
              width:
              ${journey.progress}%
            "
          ></div>

        </div>

        <p class="journey-next">
          ${escapeHtml(
            journeyText
          )}
        </p>

        <p class="journey-note">
          Die Ortsentfernungen sind
          spielerische Näherungswerte.
        </p>

      </div>

      <div class="card">

        <div class="stats-grid">

          <div class="stat">

            <strong>
              ${formatNumber(
                result.lineLengthCm,
                0
              )} cm
            </strong>

            <span>
              Soll-Länge
            </span>

          </div>

          <div class="stat">

            <strong>
              ${formatNumber(
                result.completedLineCm,
                1
              )} cm
            </strong>

            <span>
              geschafft
            </span>

          </div>

          <div class="stat">

            <strong>
              ${formatNumber(
                result.time
              )} s
            </strong>

            <span>
              Zeit
            </span>

          </div>

          <div class="stat">

            <strong>
              ${formatNumber(
                result.accuracy,
                1
              )} %
            </strong>

            <span>
              Treffergenauigkeit
            </span>

          </div>

          <div class="stat">

            <strong>
              ${formatNumber(
                result.maximumDeviation
              )} %
            </strong>

            <span>
              größte Abweichung
            </span>

          </div>

          <div class="stat">

            <strong>
              ${
                rank
                  ? `#${rank}`
                  : "–"
              }
            </strong>

            <span>
              Rang
            </span>

          </div>

        </div>

      </div>

      <div class="rank-banner">
        ${escapeHtml(
          resultComment(result)
        )}
      </div>

      <div class="action-grid">

        <button
          id="againButton"
          class="btn btn-primary"
          type="button"
        >
          ${iconButton("↻")}
          Wiederholen
        </button>

        <button
          id="nextButton"
          class="btn btn-secondary"
          type="button"
        >
          ${iconButton("→")}
          Nächste Strecke
        </button>

      </div>

      <button
        id="rankingButton"
        class="btn btn-secondary"
        type="button"
      >
        ${iconButton("🏆")}
        Bestenliste
      </button>

      <button
        id="shareButton"
        class="btn"
        type="button"
      >
        ${iconButton("↗")}
        Ergebnis teilen
      </button>

      <p class="disclaimer">
        Alle Mengen und Statistiken
        sind simuliert und frei erfunden.
      </p>

    </section>
  `;

  if (!result.dwarfWon) {
    createConfetti();
  }

  document
    .getElementById(
      "homeButton"
    )
    ?.addEventListener(
      "click",
      renderHome
    );

  document
    .getElementById(
      "againButton"
    )
    ?.addEventListener(
      "click",
      () => {
        state.currentChallengeId =
          result.challengeId;

        renderGame();
      }
    );

  document
    .getElementById(
      "nextButton"
    )
    ?.addEventListener(
      "click",
      () => {
        state.currentChallengeId =
          nextChallengeId(
            result.challengeId
          );

        renderGame();
      }
    );

  document
    .getElementById(
      "rankingButton"
    )
    ?.addEventListener(
      "click",
      renderLeaderboard
    );

  document
    .getElementById(
      "shareButton"
    )
    ?.addEventListener(
      "click",
      shareResult
    );
}

function nextChallengeId(
  currentId
) {
  const ids =
    Object.keys(
      CHALLENGES
    ).filter(
      (id) => id !== "random"
    );

  const index =
    ids.indexOf(
      currentId
    );

  return ids[
    (
      index +
      1 +
      ids.length
    ) %
    ids.length
  ];
}

async function shareResult() {
  const result =
    state.currentResult;

  if (!result) {
    return;
  }

  const journey =
    getJourneyProgress(
      result.playerTotalCm,
      result.directionId
    );

  const text =
    `${result.playerName} schaffte bei SNIFFIfy ` +
    `${formatNumber(result.completedLineCm, 1)} cm ` +
    `auf der Linie "${result.challengeName}". ` +
    `Insgesamt sind es ` +
    `${formatDistanceFromCm(result.playerTotalCm)} ` +
    `ab Querfurt Richtung ` +
    `${journey.direction.label}. ` +
    `Reine Satire.`;

  try {
    if (navigator.share) {
      await navigator.share({
        title:
          "SNIFFIfy Ergebnis",

        text
      });

      return;
    }

    if (
      navigator.clipboard
        ?.writeText
    ) {
      await navigator.clipboard
        .writeText(text);

      window.alert(
        "Das Ergebnis wurde kopiert."
      );

      return;
    }

    window.prompt(
      "Ergebnis kopieren:",
      text
    );
  } catch (error) {
    if (
      error?.name !==
      "AbortError"
    ) {
      console.error(
        "SNIFFIfy: Ergebnis konnte nicht geteilt werden.",
        error
      );

      window.alert(
        "Das Ergebnis konnte nicht geteilt werden."
      );
    }
  }
}

function renderLeaderboard() {
  cleanupGame();
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
                )
                  .toLocaleDateString(
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
                  style="
                    animation-delay:
                    ${Math.min(
                      index * 0.04,
                      0.5
                    )}s
                  "
                >

                  <div class="rank-number">
                    ${index + 1}
                  </div>

                  <div>

                    <div class="player-name">
                      ${escapeHtml(
                        result.playerName ||
                        "Unbekannt"
                      )}
                    </div>

                    <div class="player-sub">
                      ${date}
                      ·
                      ${escapeHtml(
                        result.challengeName ||
                        "ältere Version"
                      )}
                      ·
                      ${formatNumber(
                        result.completedLineCm ||
                        0,
                        1
                      )} cm
                    </div>

                  </div>

                  <div class="score-value">

                    ${result.score || 0}
                    P.

                    <br>

                    <small>
                      ${
                        result.dwarfEnabled
                          ? (
                              result.dwarfWon
                                ? "Zwerg"
                                : "Sieg"
                            )
                          : (
                              `${formatNumber(
                                result.overall ??
                                result.accuracy ??
                                0,
                                0
                              )} %`
                            )
                      }
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

          <h2>
            Bestenliste
          </h2>

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
          ${iconButton("▶")}
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
        Die Bestenliste und Gesamtstrecken
        werden lokal in diesem Browser
        gespeichert.
      </p>

    </section>
  `;

  document
    .getElementById(
      "backHomeButton"
    )
    ?.addEventListener(
      "click",
      renderHome
    );

  document
    .getElementById(
      "newGameButton"
    )
    ?.addEventListener(
      "click",
      () => {
        if (!state.playerName) {
          renderHome();

          return;
        }

        state.currentChallengeId =
          resolveChallengeId();

        renderGame();
      }
    );

  document
    .getElementById(
      "clearButton"
    )
    ?.addEventListener(
      "click",
      () => {
        const confirmed =
          window.confirm(
            "Möchtest du wirklich alle Ergebnisse und Gesamtstrecken löschen?"
          );

        if (!confirmed) {
          return;
        }

        saveResults([]);

        writeStorage(
          STORAGE_KEYS.playerStats,
          JSON.stringify({})
        );

        state.currentResult =
          null;

        renderLeaderboard();
      }
    );
}

function createConfetti() {
  removeConfetti();

  const layer =
    document.createElement(
      "div"
    );

  layer.id =
    "confettiLayer";

  layer.className =
    "confetti-layer";

  const colors = [
    "#7c3aed",
    "#ec4899",
    "#f59e0b",
    "#a78bfa",
    "#ffffff"
  ];

  for (
    let index = 0;
    index < 30;
    index += 1
  ) {
    const piece =
      document.createElement(
        "div"
      );

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
      `${
        2.4 +
        Math.random() *
        2.3
      }s`
    );

    piece.style.animationDelay =
      `${
        Math.random() *
        0.8
      }s`;

    layer.appendChild(
      piece
    );
  }

  document.body
    .appendChild(layer);

  state.confettiTimeout =
    window.setTimeout(
      removeConfetti,
      5000
    );
}

function removeConfetti() {
  document
    .getElementById(
      "confettiLayer"
    )
    ?.remove();

  if (state.confettiTimeout) {
    clearTimeout(
      state.confettiTimeout
    );

    state.confettiTimeout =
      null;
  }
}

function cancelGameFrames(game) {
  if (game.markerFrame) {
    cancelAnimationFrame(
      game.markerFrame
    );
  }

  if (game.clockFrame) {
    cancelAnimationFrame(
      game.clockFrame
    );
  }

  if (game.dwarfFrame) {
    cancelAnimationFrame(
      game.dwarfFrame
    );
  }

  if (game.countdownTimer) {
    clearInterval(
      game.countdownTimer
    );
  }

  if (game.countdownTimeout) {
    clearTimeout(
      game.countdownTimeout
    );
  }
}

function cleanupGame() {
  const game =
    state.game;

  if (!game) {
    return;
  }

  cancelGameFrames(game);

  game.running =
    false;

  game.finished =
    true;

  game.canvas
    ?.removeEventListener(
      "pointerdown",
      handlePointerDown
    );

  game.canvas
    ?.removeEventListener(
      "pointermove",
      handlePointerMove
    );

  game.canvas
    ?.removeEventListener(
      "pointerup",
      handlePointerEnd
    );

  game.canvas
    ?.removeEventListener(
      "pointercancel",
      handlePointerEnd
    );

  game.canvas
    ?.removeEventListener(
      "lostpointercapture",
      handlePointerEnd
    );

  game.canvas
    ?.removeEventListener(
      "contextmenu",
      preventDefault
    );

  state.game =
    null;
}

function initializeApp() {
  if (!validateStartup()) {
    return;
  }

  try {
    renderHome();
  } catch (error) {
    showFatalError(
      "Die App konnte nicht initialisiert werden.",
      error
    );
  }
}

window.addEventListener(
  "beforeunload",
  () => {
    cleanupGame();
    removeConfetti();
  },
  {
    once: true
  }
);

initializeApp();