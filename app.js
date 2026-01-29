const form = document.getElementById("plan-form"); 
const distanceSelect = document.getElementById("distance"); 
const raceDateInput = document.getElementById("race-date"); 
const planOutput = document.getElementById("plan-output"); 
const resetButton = document.getElementById("reset-button");

const week1Plan = [
        {
        id: 1,
        weekNumber: 1,
        runType: "easy",
        distanceKm: 5 
    },

        {
        id: 2,
        weekNumber: 1,
        runType: "tempo",
        distanceKm: 10 
    },

        {
        id: 3,
        weekNumber: 1,
        runType: "long",
        distanceKm: 15 
    }

]

form.addEventListener("submit", (event) => {
    event.preventDefault()
    const distance = distanceSelect.value;
    const raceDate = raceDateInput.value;

    if (!raceDate){
        planOutput.innerHTML=(`Please choose race date.`)
    } else {
        planOutput.innerHTML=(``);
        let outputHeader = document.createElement("h2");
        planOutput.appendChild(outputHeader);
        outputHeader.innerHTML=(`Plan for ${distance} race on ${raceDate}`)
        let weekHeader = document.createElement("h3");
        planOutput.appendChild(weekHeader);
        weekHeader.innerHTML=("Week 1")

        let runPlanContainer = document.createElement("div")
        planOutput.appendChild(runPlanContainer);

        for (let run of week1Plan){
            let runElement = document.createElement("p");
            runPlanContainer.appendChild(runElement);
            runElement.innerHTML=(`Run type: ${run.runType}, Run distance: ${run.distanceKm}`)
        }
        
    }
    
})





