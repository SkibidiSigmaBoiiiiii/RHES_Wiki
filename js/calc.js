function calculatePPS() {
    const trashBox = document.getElementById("trashBox").checked;
    const genTemp = document.getElementById("genTemp").checked;
    const turbineTemp = document.getElementById("turbineTemp").checked;
    const hydraulicPump = document.getElementById("hydraulicPump").checked;
    const autoExcitation = document.getElementById("autoExcitation").checked;
    const tailwaterBonus = document.getElementById("tailwaterBonus").checked;
    const demandMet = document.getElementById("demandMet").checked;

    if (!demandMet) return 0;

    let pps = 0.3;

    if (!trashBox) pps += 0.1;
    if (!genTemp) pps += 0.2;
    if (!turbineTemp) pps += 0.2;
    if (!hydraulicPump) pps += 0.2;
    if (!autoExcitation) pps += 0.2;

    if (tailwaterBonus) {
        pps *= 1.15;
    }

    return Number(pps.toFixed(2));
}

function formatTime(totalSeconds) {
    if (totalSeconds <= 0 || !isFinite(totalSeconds)) return "Target reached!";
    
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    let result = [];
    if (h > 0) result.push(`${h}h`);
    if (m > 0) result.push(`${m}m`);
    if (s > 0 || result.length === 0) result.push(`${s}s`);

    return result.join(' ');
}

function updateCalculators() {
    const currentPPS = calculatePPS();
    const demandMet = document.getElementById("demandMet").checked;
    
    if (!demandMet) {
        document.getElementById("ppsResult").innerText = "Points per second: 0 (Demand not met)";
    } else {
        document.getElementById("ppsResult").innerText = "Points per second: " + currentPPS.toFixed(2) + "/s";
    }

    const currentPoints = parseFloat(document.getElementById("currentPoints").value) || 0;
    const targetPoints = parseFloat(document.getElementById("targetPoints").value) || 0;
    const timeResultEl = document.getElementById("timeResult");

    const pointsNeeded = targetPoints - currentPoints;

    if (currentPPS <= 0 && pointsNeeded > 0) {
        timeResultEl.innerText = "Time needed: Never (0 PPS)";
    } else if (pointsNeeded <= 0) {
        timeResultEl.innerText = "Time needed: Target reached!";
    } else {
        const secondsNeeded = pointsNeeded / currentPPS;
        timeResultEl.innerText = "Time needed: " + formatTime(secondsNeeded);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".pps-container input");
    inputs.forEach(input => {
        input.addEventListener("input", updateCalculators);
    });
    
    updateCalculators();
});
