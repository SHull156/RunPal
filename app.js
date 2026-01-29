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

const wellnessStore = {};

form.addEventListener("submit", (event) => {
    event.preventDefault()
    const distance = distanceSelect.value;
    const raceDate = raceDateInput.value;

    if (!raceDate){
        planOutput.textContent=(`Please choose race date.`)
    } else {
        planOutput.textContent=(``);
        let outputHeader = document.createElement("h2");
        planOutput.appendChild(outputHeader);
        outputHeader.textContent=(`Plan for ${distance} race on ${raceDate}`)
        let weekHeader = document.createElement("h3");
        planOutput.appendChild(weekHeader);
        weekHeader.textContent=("Week 1")

        let runPlanContainer = document.createElement("div")
        planOutput.appendChild(runPlanContainer);

        for (let run of week1Plan){
            let runContainer = document.createElement("div")
            runPlanContainer.appendChild(runContainer);
            let runElement = document.createElement("p");
            runContainer.appendChild(runElement);
            
            runElement.textContent=(`Run type: ${run.runType}, Run distance: ${run.distanceKm}`)
            let feelingTodaySelector = document.createElement("select");
            runContainer.appendChild(feelingTodaySelector);
            
            //choose feeling option
            let chooseFeeling = document.createElement("option");
            chooseFeeling.textContent = ("Please choose");
            chooseFeeling.value = "";
            feelingTodaySelector.appendChild(chooseFeeling);
            
            
            //feeling good option
            let feelingGood = document.createElement("option");
            feelingGood.textContent = ("Good");
            feelingGood.value = "good";
            feelingTodaySelector.appendChild(feelingGood);
            
            //feeling ok option
            let feelingOK = document.createElement("option");
            feelingOK.textContent =("OK");
            feelingOK.value = "ok";
            feelingTodaySelector.appendChild(feelingOK);
            ;
            
            //feeling not great option
            let feelingNotGreat = document.createElement("option");
            feelingNotGreat.textContent = ("Not great")
            feelingNotGreat.value = "not_great"
            feelingTodaySelector.appendChild(feelingNotGreat);

            //restore saved value
            const savedFeeling = wellnessStore[run.id];
            feelingTodaySelector.value = savedFeeling ? savedFeeling : "";

            if (savedFeeling === "not_great"){
                const adjustedLabel = document.createElement("span");
                adjustedLabel.textContent = ("Adjusted")
                runContainer.appendChild(adjustedLabel);
            }

            //store on change
            feelingTodaySelector.addEventListener("change", () => {
                const selectedFeeling = feelingTodaySelector.value; 

                if (selectedFeeling === "") {
                    delete wellnessStore[run.id];
                } else {
                    wellnessStore[run.id] = selectedFeeling;
                }
            });

            

        }
        
    }
    
})





