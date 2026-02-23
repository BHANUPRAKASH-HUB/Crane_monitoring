// 📊 Chart for Current & Voltage Levels
new Chart(document.getElementById("currentVoltageChart"), {
    type: "line",
    data: {
        labels: ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM"],
        datasets: [
            {
                label: "Current (A)",
                data: [350, 370, 360, 380, 375, 365],
                borderColor: "#ffcc00",
                fill: false,
                tension: 0.4
            },
            {
                label: "Voltage (V)",
                data: [410, 415, 413, 417, 416, 414],
                borderColor: "#4bc0c0",
                fill: false,
                tension: 0.4
            }
        ]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: "top" } }
    }
});

// ⚡ Power Factor Chart
new Chart(document.getElementById("powerFactorChart"), {
    type: "doughnut",
    data: {
        labels: ["Active Power", "Reactive Power"],
        datasets: [{
            data: [92, 8],
            backgroundColor: ["#ffcc00", "#ff6384"]
        }]
    },
    options: { responsive: true }
});

// 🔋 Battery Health Chart
new Chart(document.getElementById("batteryHealthChart"), {
    type: "bar",
    data: {
        labels: ["Battery 1", "Battery 2", "Battery 3"],
        datasets: [{
            label: "Health (%)",
            data: [95, 90, 88],
            backgroundColor: "#ffcc00"
        }]
    },
    options: { responsive: true }
});

// 🔌 Energy Consumption Chart
new Chart(document.getElementById("energyConsumptionChart"), {
    type: "line",
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            label: "kWh Used",
            data: [120, 130, 125, 140, 135, 128, 132],
            borderColor: "#36a2eb",
            fill: true,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            tension: 0.4
        }]
    },
    options: { responsive: true }
});
