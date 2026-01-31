const form = document.getElementById("plan-form"); 
const distanceSelect = document.getElementById("distance"); 
const runsPerWeekSelect = document.getElementById("runs-per-week");
const raceDateInput = document.getElementById("race-date"); 
const planOutput = document.getElementById("plan-output"); 
const resetButton = document.getElementById("reset-button");

const week1Plan = [
  { id: 1, weekNumber: 1, runType: "easy",  distanceKm: 5  },
  { id: 2, weekNumber: 1, runType: "tempo", distanceKm: 10 },
  { id: 3, weekNumber: 1, runType: "long",  distanceKm: 15 }
];

const wellnessStore = {};

form.addEventListener("submit", (event) => {
    event.preventDefault()

    const distance = distanceSelect.value;
    const runsPerWeek = runsPerWeekSelect.value;
    const raceDate = raceDateInput.value;
    
    let missingInputs = [];

    // Build missing inputs list
    if (distance === "") missingInputs.push("distance");
    if (runsPerWeek === "") missingInputs.push("runs per week");
    if (!raceDate) missingInputs.push("race date");

    // If anything missing, show message and stop
    if (missingInputs.length > 0) {
        let message;

        if (missingInputs.length === 1) {
        message = missingInputs[0];
        } else if (missingInputs.length === 2) {
        message = missingInputs.join(" and ");
        } else {
        message =
            missingInputs.slice(0, -1).join(", ") +
            " and " +
            missingInputs[missingInputs.length - 1];
        }

        planOutput.textContent = `Please choose ${message}.`;
        return;
        }

    // Clear previous output
    planOutput.textContent = "";

    //Work out difference between current and race date
    const today = new Date();
    const race = new Date(raceDate);

    const msUntilRace = race - today;
    const daysUntilRace = msUntilRace / (1000 * 60 * 60 * 24);
    const weeksToRace = Math.ceil(daysUntilRace / 7);

    if (weeksToRace <= 0) {
        planOutput.textContent = "Race date must be in the future.";
        return;
    }

    const weeksToGenerate = Math.min(weeksToRace, 10);

    // Header
    const outputHeader = document.createElement("h2");
    outputHeader.textContent = `Plan for ${distance} race on ${raceDate}`;
    planOutput.appendChild(outputHeader);

    // Render weeks

    for (let weekNumber = 1; weekNumber <= weeksToGenerate; weekNumber++){
        // Week header
        const weekHeader = document.createElement("h3");
        weekHeader.textContent = `Week ${weekNumber}`;
        planOutput.appendChild(weekHeader);

        // Run list container
        const runPlanContainer = document.createElement("div"); 
        runPlanContainer.classList.add("run-list");
        planOutput.appendChild(runPlanContainer);

        // Render runs
        for (const run of week1Plan) {
            const runContainer = document.createElement("div");
            runContainer.classList.add("run-item");
            runPlanContainer.appendChild(runContainer);

            const runElement = document.createElement("p");
            runElement.textContent = `Run type: ${run.runType}, Run distance: ${run.distanceKm}`;
            runContainer.appendChild(runElement);

            const feelingLabel = document.createElement("label");
            feelingLabel.textContent = "How are you feeling today?";
            runContainer.appendChild(feelingLabel);

            const feelingTodaySelector = document.createElement("select");
            runContainer.appendChild(feelingTodaySelector);

            // Options
            const chooseFeeling = document.createElement("option");
            chooseFeeling.textContent = "Please choose";
            chooseFeeling.value = "";
            feelingTodaySelector.appendChild(chooseFeeling);

            const feelingGood = document.createElement("option");
            feelingGood.textContent = "Good";
            feelingGood.value = "good";
            feelingTodaySelector.appendChild(feelingGood);

            const feelingOK = document.createElement("option");
            feelingOK.textContent = "OK";
            feelingOK.value = "ok";
            feelingTodaySelector.appendChild(feelingOK);

            const feelingNotGreat = document.createElement("option");
            feelingNotGreat.textContent = "Not great";
            feelingNotGreat.value = "not_great";
            feelingTodaySelector.appendChild(feelingNotGreat);

            const runKey = `${weekNumber}-${run.id}`;

            // Restore saved value
            const savedFeeling = wellnessStore[runKey];
            feelingTodaySelector.value = savedFeeling ? savedFeeling : "";

            // Badge if adjusted
            if (savedFeeling === "not_great") {
            const adjustedLabel = document.createElement("span");
            adjustedLabel.classList.add("adjusted-badge");
            adjustedLabel.textContent = "Adjusted";
            runContainer.appendChild(adjustedLabel);
            }

            // Store on change
            feelingTodaySelector.addEventListener("change", () => {
            const selectedFeeling = feelingTodaySelector.value;

            if (selectedFeeling === "") {
                delete wellnessStore[runKey];
            } else {
                wellnessStore[runKey] = selectedFeeling;
            }
            });
    }}
    });