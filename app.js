const form = document.getElementById("plan-form");
const distanceSelect = document.getElementById("distance");
const runsPerWeekSelect = document.getElementById("runs-per-week");
const raceDateInput = document.getElementById("race-date");
const planOutput = document.getElementById("plan-output");
const resetButton = document.getElementById("reset-button");

const PLAN_STORAGE_KEY = "runpal.plan.v1";

const savePlanToLocalStorage = (planData) => {
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(planData));
};

const loadPlanFromLocalStorage = () => {
  const raw = localStorage.getItem(PLAN_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const updateSavedWellnessStore = (nextWellnessStore) => {
  const savedPlan = loadPlanFromLocalStorage();
  if (!savedPlan) return;

  savePlanToLocalStorage({
    ...savedPlan,
    wellnessStore: { ...nextWellnessStore },
  });
};

// ---------- Wellness adjustment helpers ----------

const roundTo1Decimal = (num) => Math.round(num * 10) / 10;

const getAdjustedRunDisplay = (run, wellnessValue) => {
  if (wellnessValue !== "not_great") {
    return {
      displayType: run.runType,
      displayDistanceKm: run.distanceKm,
      isAdjusted: false,
    };
  }

  // Speed > downgrade to recovery, -20%
  if (run.bucket === "speed") {
    return {
      displayType: "Recovery run",
      displayDistanceKm: roundTo1Decimal(run.distanceKm * 0.8),
      isAdjusted: true,
    };
  }

  // Endurance > -20%
  if (run.bucket === "endurance") {
    return {
      displayType: run.runType,
      displayDistanceKm: roundTo1Decimal(run.distanceKm * 0.8),
      isAdjusted: true,
    };
  }

  // Recovery > -10%
  return {
    displayType: run.runType,
    displayDistanceKm: roundTo1Decimal(run.distanceKm * 0.9),
    isAdjusted: true,
  };
};

// ---------- Base data ----------

const baseRuns = [
  { id: 1, runType: "Easy run", distanceKm: 5, bucket: "recovery" },
  { id: 2, runType: "Easy run", distanceKm: 6, bucket: "recovery" },
  { id: 3, runType: "Tempo", distanceKm: 10, bucket: "speed" },
  { id: 4, runType: "Intervals", distanceKm: 6, bucket: "speed" },
  { id: 5, runType: "Hilly Repeats", distanceKm: 5, bucket: "speed" },
  { id: 6, runType: "Long", distanceKm: 15, bucket: "endurance" },
];

const wellnessStore = {};

// ---------- Plan generation helpers ----------

const pickRandomUnique = (array, numberToPick) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, numberToPick);
};

const getBucketCounts = (runsPerWeekNum) => {
  if (runsPerWeekNum === 5) return { recovery: 2, speed: 2, endurance: 1 };
  if (runsPerWeekNum === 4) return { recovery: 1, speed: 2, endurance: 1 };
  if (runsPerWeekNum === 3) return { recovery: 1, speed: 1, endurance: 1 };
  if (runsPerWeekNum === 2) return { speed: 1, endurance: 1 };
  return null;
};

const selectRunsForWeek = (runs, runsPerWeekNum) => {
  if (runsPerWeekNum === 1) return pickRandomUnique(runs, 1);

  const counts = getBucketCounts(runsPerWeekNum);
  if (!counts) return [];

  const byBucket = {
    recovery: runs.filter((r) => r.bucket === "recovery"),
    speed: runs.filter((r) => r.bucket === "speed"),
    endurance: runs.filter((r) => r.bucket === "endurance"),
  };

  const selected = [];
  for (const [bucket, count] of Object.entries(counts)) {
    selected.push(...pickRandomUnique(byBucket[bucket], count));
  }

  return pickRandomUnique(selected, selected.length);
};

// ---------- Rendering ----------

const renderPlan = ({ distance, raceDate, weeksToGenerate, selectedRunIdsByWeek }) => {
  planOutput.textContent = "";

  const outputHeader = document.createElement("h2");
  outputHeader.textContent = `Plan for ${distance} race on ${raceDate}`;
  planOutput.appendChild(outputHeader);

  for (let weekNumber = 1; weekNumber <= weeksToGenerate; weekNumber++) {
    const weekHeader = document.createElement("h3");
    weekHeader.textContent = `Week ${weekNumber}`;
    planOutput.appendChild(weekHeader);

    const runPlanContainer = document.createElement("div");
    runPlanContainer.classList.add("run-list");
    planOutput.appendChild(runPlanContainer);

    const runIds = selectedRunIdsByWeek[weekNumber - 1] || [];
    const runsForThisWeek = runIds
      .map((id) => baseRuns.find((r) => r.id === id))
      .filter(Boolean);

    for (const run of runsForThisWeek) {
      const runContainer = document.createElement("div");
      runContainer.classList.add("run-item");
      runPlanContainer.appendChild(runContainer);

      const runKey = `${weekNumber}-${run.id}`;
      const savedFeeling = wellnessStore[runKey] || "";
      const adjusted = getAdjustedRunDisplay(run, savedFeeling);

      const runElement = document.createElement("p");
      runElement.textContent = `Run type: ${adjusted.displayType}, Run distance: ${adjusted.displayDistanceKm} km`;
      runContainer.appendChild(runElement);

      const label = document.createElement("label");
      label.textContent = "How are you feeling today?";
      runContainer.appendChild(label);

      const select = document.createElement("select");
      runContainer.appendChild(select);

      [
        ["", "Please choose"],
        ["good", "Good"],
        ["ok", "OK"],
        ["not_great", "Not great"],
      ].forEach(([value, text]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        select.appendChild(option);
      });

      select.value = savedFeeling;

      const badge = document.createElement("span");
      badge.classList.add("adjusted-badge");
      badge.textContent = "Adjusted";
      badge.style.display = adjusted.isAdjusted ? "inline-block" : "none";
      runContainer.appendChild(badge);

      select.addEventListener("change", () => {
        if (select.value === "") {
          delete wellnessStore[runKey];
        } else {
          wellnessStore[runKey] = select.value;
        }

        updateSavedWellnessStore(wellnessStore);

        const next = getAdjustedRunDisplay(run, wellnessStore[runKey]);
        badge.style.display = next.isAdjusted ? "inline-block" : "none";
        runElement.textContent = `Run type: ${next.displayType}, Run distance: ${next.displayDistanceKm} km`;
      });
    }
  }
};

// ---------- Reset ----------

resetButton.addEventListener("click", () => {
  planOutput.textContent = "";
  form.reset();
  Object.keys(wellnessStore).forEach((k) => delete wellnessStore[k]);
  localStorage.removeItem(PLAN_STORAGE_KEY);
});

// ---------- Generate ----------

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const distance = distanceSelect.value;
  const runsPerWeek = runsPerWeekSelect.value;
  const raceDate = raceDateInput.value;

  if (!distance || !runsPerWeek || !raceDate) {
    planOutput.textContent = "Please choose distance, runs per week and race date.";
    return;
  }

  const runsPerWeekNum = Number(runsPerWeek);
  const today = new Date();
  const race = new Date(raceDate);
  const weeksToRace = Math.ceil((race - today) / (1000 * 60 * 60 * 24 * 7));

  if (weeksToRace <= 0) {
    planOutput.textContent = "Race date must be in the future.";
    return;
  }

  const weeksToGenerate = Math.min(weeksToRace, 10);
  const selectedRunIdsByWeek = [];

  for (let i = 1; i <= weeksToGenerate; i++) {
    selectedRunIdsByWeek.push(
      selectRunsForWeek(baseRuns, runsPerWeekNum).map((r) => r.id)
    );
  }

  Object.keys(wellnessStore).forEach((k) => delete wellnessStore[k]);

  renderPlan({
    distance,
    raceDate,
    weeksToGenerate,
    selectedRunIdsByWeek,
  });

  savePlanToLocalStorage({
    version: 1,
    distance,
    runsPerWeek: runsPerWeekNum,
    raceDate,
    weeksToGenerate,
    selectedRunIdsByWeek,
    wellnessStore: {},
  });
});

// ---------- Restore ----------

const savedPlan = loadPlanFromLocalStorage();
if (savedPlan) {
  distanceSelect.value = savedPlan.distance || "";
  runsPerWeekSelect.value = savedPlan.runsPerWeek?.toString() || "";
  raceDateInput.value = savedPlan.raceDate || "";

  Object.assign(wellnessStore, savedPlan.wellnessStore || {});

  renderPlan(savedPlan);
}
