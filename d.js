// Random Value Generator
function getRandomValue(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function updateMetricColors() {
    document.querySelectorAll(".metric-card").forEach(card => {
        let value = parseFloat(card.querySelector("p").innerText);
        
        if (value >= 90) {
            card.classList.remove("warning", "danger");
            card.classList.add("good"); // Green
        } else if (value >= 50) {
            card.classList.remove("good", "danger");
            card.classList.add("warning"); // Yellow
        } else {
            card.classList.remove("good", "warning");
            card.classList.add("danger"); // Red
        }
    });
}

// Call this function every time values update
updateMetricColors();



// Initial Battery Health (Starting at 100%)
let batteryHealth = 100;
let updateCount = 0; // Counter to track updates

// Function to Update Metrics
function updateMetrics() {
    document.getElementById("current").textContent = getRandomValue(350, 400) + " A";
    document.getElementById("voltage").textContent = getRandomValue(400, 440) + " V";
    document.getElementById("power-factor").textContent = getRandomValue(0.85, 0.99);
    
    // Battery Health decreases every 3 updates
    updateCount++;
    if (updateCount % 3 === 0) {
        batteryHealth -= 0.1;
        if (batteryHealth < 20) {
            batteryHealth = 100; // Reset when too low
        }
    }

    document.getElementById("battery").textContent = batteryHealth.toFixed(1) + "%";
}

// Initialize Charts
const currentVoltageCtx = document.getElementById('currentVoltageChart').getContext('2d');
const powerFactorCtx = document.getElementById('powerFactorChart').getContext('2d');
const batteryHealthCtx = document.getElementById('batteryHealthChart').getContext('2d');
const energyConsumptionCtx = document.getElementById('energyConsumptionChart').getContext('2d');

// 1️⃣ Modified Current & Voltage Chart - **Bar Chart**
const currentVoltageChart = new Chart(currentVoltageCtx, {
    type: 'bar',
    data: {
        labels: ["Current (A)", "Voltage (V)"],
        datasets: [{
            label: "Current & Voltage",
            backgroundColor: ['#ffcc00', '#007bff'],
            data: [getRandomValue(350, 400), getRandomValue(400, 440)]
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// 2️⃣ Power Factor Line Chart (No Changes)
const powerFactorChart = new Chart(powerFactorCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Power Factor',
            borderColor: '#28a745',
            data: [],
            fill: false
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// 3️⃣ Battery Health Line Chart (Now Decreasing Every 3 Updates)
const batteryHealthChart = new Chart(batteryHealthCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Battery Health (%)',
            borderColor: '#dc3545',
            data: [],
            fill: false
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// 4️⃣ Modified Energy Consumption Graph - **Doughnut Chart**
const energyConsumptionChart = new Chart(energyConsumptionCtx, {
    type: 'doughnut',
    data: {
        labels: ["Usage (kWh)", "Remaining"],
        datasets: [{
            data: [getRandomValue(5, 20), getRandomValue(80, 100)],
            backgroundColor: ['#6610f2', '#ddd']
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// Function to Update Charts
function updateCharts() {
    // Update Current & Voltage (Bar Chart)
    currentVoltageChart.data.datasets[0].data = [getRandomValue(350, 400), getRandomValue(400, 440)];
    currentVoltageChart.update();

    // Update Power Factor (No Changes)
    if (powerFactorChart.data.labels.length > 20) {
        powerFactorChart.data.labels.shift();
        powerFactorChart.data.datasets[0].data.shift();
    }
    powerFactorChart.data.labels.push(new Date().toLocaleTimeString());
    powerFactorChart.data.datasets[0].data.push(getRandomValue(0.85, 0.99));
    powerFactorChart.update();

    // Update Battery Health (Now Decreasing Every 3 Updates)
    if (batteryHealthChart.data.labels.length > 20) {
        batteryHealthChart.data.labels.shift();
        batteryHealthChart.data.datasets[0].data.shift();
    }
    batteryHealthChart.data.labels.push(new Date().toLocaleTimeString());
    batteryHealthChart.data.datasets[0].data.push(batteryHealth.toFixed(1));
    batteryHealthChart.update();

    // Update Energy Consumption (Doughnut Chart)
    energyConsumptionChart.data.datasets[0].data = [getRandomValue(5, 20), getRandomValue(80, 100)];
    energyConsumptionChart.update();
}

// Update Metrics and Charts Every 2 Seconds
setInterval(() => {
    updateMetrics();
    updateCharts();
}, 2000);

// Initialize
updateMetrics();
updateCharts();

let lastScrollTop = 0;
const footer = document.querySelector('.footer');
const mainContent = document.querySelector('.main-content');

window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY;
    let contentRect = mainContent.getBoundingClientRect();
    let windowHeight = window.innerHeight;

    // Check if the bottom of the main content is visible in the viewport
    if (contentRect.bottom <= windowHeight) {
        footer.style.bottom = "0"; // Show footer
    } else {
        footer.style.bottom = "-100px"; // Hide footer
    }

    lastScrollTop = scrollTop;
});
