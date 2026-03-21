# RunPal 

RunPal is a lightweight, single-user running training plan generator that prioritises **runner self-assessment over aggressive optimisation**.

It generates a multi-week plan based on a target race date and length, and adapts individual runs in response to how the runner feels day-to-day — without automatically rewriting the entire plan.

The goal is simple: **listen to the runner, don’t overcorrect.**

---

## Key ideas

- Plans are generated once and stay stable unless the user explicitly regenerates or resets
- Wellness is treated as *perceived readiness for today's run*, not injury or illness forecasting
- Adjustments are local and reversible, not “smart” global optimisations
- No accounts, no backend, no data collection

---

## Features

- **Dynamic plan generation**
  - Choose race distance, race date, and runs per week (1–5)
  - Generates up to 10 weeks based on time to race, counting backwards from race date
  - Weekly runs selected using recovery / speed / endurance buckets

- **Local persistence (no login)**
  - Generated plans persist across page reloads using `localStorage`
  - The same plan is restored exactly as generated
  - Plan only changes when the user clicks **Generate** or **Reset**

- **Wellness-based run adjustments**
  - Each run has a daily wellness selector
  - When a run is marked **“Not great”**, it adjusts immediately:
    - Speed runs - downgraded to a recovery run (−20% distance)
    - Endurance runs - distance reduced by 20%
    - Recovery runs - distance reduced by 10%
  - Adjustments are visual, reversible, and scoped to that run only

- **Immediate feedback**
  - Adjusted runs are marked with an “Adjusted” badge instantly
  - No refresh required
  - Wellness state persists across reloads but never leaks between plans

---

## What this project demonstrates

- Thoughtful state modelling (plan vs wellness)
- Deterministic persistence of randomly generated data
- Rule-based behaviour instead of opaque “smart” logic
- Incremental feature development with clean Git history
- Conscious product constraints to avoid over-engineering

---

## Tech stack

- Vanilla JavaScript
- HTML & CSS
- `localStorage` for persistence
- No frameworks, no backend

---

## How to run locally

1. Clone the repository
2. Open `index.html` in your browser  
   *(or use a simple local server such as VS Code Live Server)*

That’s it — no build step required.

---

## Roadmap

- Progressive long-run distance across weeks
- Minor UI copy and accessibility polish
- Optional README diagrams explaining adjustment rules

Features **not** planned:
- Login or accounts
- Automatic plan optimisation
- AI coaching or recommendations
- Social or gamification features

---

## Project philosophy

Many training apps attempt to optimise away uncertainty.  
RunPal takes the opposite approach: it assumes the runner’s perception matters and keeps adjustments lightweight, transparent, and reversible.

This project is intentionally small, focused, and explainable.
