// 📈 Speed Chart
document.addEventListener("DOMContentLoaded", function () {
    // Get the chart canvas
    const ctx = document.getElementById('speedChart').getContext('2d');

    // Initial Time Labels (Every 6 Hours)
    let labels = ['00:00', '06:00', '12:00', '18:00'];

    // Initial Speed Values
    let speedData = [30, 45, 38, 50];

    // Create the Chart
    let speedChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Speed (km/h)',
                data: speedData,
                backgroundColor: 'rgba(255, 204, 0, 0.4)',
                borderColor: '#ffcc00',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { 
                    title: { display: true, text: "Speed (km/h)" }, 
                    min: 20, max: 60 
                }
            },
            animation: {
                duration: 500,
                easing: 'linear'
            }
        }
    });

    // Function to Update Speed Data
    function updateSpeedChart() {
        // Generate a new speed value (between 25-55 km/h)
        let newSpeed = Math.floor(Math.random() * 30) + 25;

        // Get Current Time (HH:MM Format)
        let now = new Date();
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let currentTime = `${hours}:${minutes}`;

        // Update Data (Remove Oldest, Add New)
        labels.push(currentTime);
        speedData.push(newSpeed);
        if (labels.length > 6) {  // Keep max 6 data points
            labels.shift();
            speedData.shift();
        }

        // Update Chart
        speedChart.update();
    }

    // Update Chart Every 5 Seconds
    setInterval(updateSpeedChart, 3000);
});


// 🏗 Load Chart
document.addEventListener("DOMContentLoaded", function () {
    const loadEl = document.getElementById("load"); // Load value from the dashboard
    const ctx = document.getElementById("loadChart").getContext("2d");

    // Initialize Bar Chart
    let loadChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Crane 1"], // Only showing one crane
            datasets: [{
                label: "Load (tons)",
                data: [10], // Initial value (will update dynamically)
                backgroundColor: ['#ffcc00'], // Keep the original color
                borderColor: '#000',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50 // Adjust as needed
                }
            }
        }
    });

    // Function to Update Load Chart
    function updateLoadChart() {
        let loadText = loadEl.textContent.trim();
        let loadValue = parseFloat(loadText.replace(" tons", "")); // Extract numeric value

        if (!isNaN(loadValue)) {
            loadChart.data.datasets[0].data[0] = loadValue; // Update chart data
            loadChart.update();
        }
    }

    // Update Load Chart Every 3 Seconds
    setInterval(updateLoadChart, 3000);
});


// 🌡 Temperature Chart
document.addEventListener("DOMContentLoaded", function () {
    const temperatureEl = document.getElementById("temperature");
    const ctx = document.getElementById("temperatureChart").getContext("2d");

    // Initialize Line Chart
    let temperatureChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [], // Time labels (will update dynamically)
            datasets: [{
                label: "Temperature (°C)",
                data: [],
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "#ff6384",
                borderWidth: 2,
                tension: 0.4 // Smooth curves
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: "Time (hh:mm:ss)" }
                },
                y: {
                    title: { display: true, text: "Temperature (°C)" },
                    min: 20,
                    max: 50 // Adjust based on expected range
                }
            }
        }
    });

    // Function to Update Temperature Chart
    function updateTemperatureChart() {
        let temperatureText = temperatureEl.textContent.trim();
        let temperatureValue = parseFloat(temperatureText.replace("°C", "")); // Extract numeric value
        let currentTime = new Date().toLocaleTimeString();

        if (!isNaN(temperatureValue)) {
            // Push new data
            temperatureChart.data.labels.push(currentTime);
            temperatureChart.data.datasets[0].data.push(temperatureValue);

            // Keep only the last 10 readings for a cleaner chart
            if (temperatureChart.data.labels.length > 10) {
                temperatureChart.data.labels.shift();
                temperatureChart.data.datasets[0].data.shift();
            }

            temperatureChart.update();
        }
    }

    // Update Line Chart Every 3 Seconds
    setInterval(updateTemperatureChart, 3000);
});


// 🔋 Battery Health Chart
new Chart(document.getElementById('batteryChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        labels: ['Healthy', 'Needs Check'],
        datasets: [{
            data: [80, 20],
            backgroundColor: ['#36a2eb', '#ffcd56']
        }]
    }
});

// 🥧 Safety Pie Chart
new Chart(document.getElementById('safetyPieChart').getContext('2d'), {
    type: 'pie',
    data: {
        labels: ['Safe Operations', 'Warnings', 'Critical'],
        datasets: [{
            data: [65, 25, 10],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545']
        }]
    }
});

// ⚡ Energy Efficiency Pie Chart
new Chart(document.getElementById('energyPieChart').getContext('2d'), {
    type: 'pie',
    data: {
        labels: ['Optimal Usage', 'Moderate', 'High Consumption'],
        datasets: [{
            data: [50, 30, 20],
            backgroundColor: ['#17a2b8', '#ffc107', '#ff6384']
        }]
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Parameter Elements
    const vibrationEl = document.getElementById("vibration");
    const fuelEl = document.getElementById("fuel");
    const hoursEl = document.getElementById("hours");
    const temperatureEl = document.getElementById("temperature");

    // Card Elements
    const vibrationCard = document.getElementById("vibration-card");
    const fuelCard = document.getElementById("fuel-card");
    const hoursCard = document.getElementById("hours-card");
    const temperatureCard = document.getElementById("temperature-card");

    // Notification Panel & Icon
    const notificationPanel = document.querySelector(".notification-panel");
    const notificationIcon = document.querySelector(".notification-icon");
    const notificationList = document.createElement("ul");
    notificationPanel.appendChild(notificationList);

    // Toggle Notification Panel on Click
    notificationIcon.addEventListener("click", function () {
        notificationPanel.classList.toggle("open");
    });

    // Function to Add Notification
    function addNotification(message, isCritical = false) {
        const notificationItem = document.createElement("li");
        notificationItem.classList.add("notification");
        notificationItem.style.color = isCritical ? "red" : "black";
        notificationItem.textContent = "🚨 " + message;
        notificationList.prepend(notificationItem);

        // Open Notification Panel When Alert is Added
        notificationPanel.classList.add("open");
        // Store Notifications in localStorage
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.unshift({ message, isCritical, timestamp: new Date().toLocaleString() });

    // Keep only the last 20 notifications
    if (notifications.length > 20) {
        notifications.pop();
    }

    localStorage.setItem("notifications", JSON.stringify(notifications));
    }

    // Initialize Operating Hours
    let operatingHours = 0.0; // Starting from 8 hours

    // Function to Simulate Crane Issue
    function simulateCraneIssue() {
        // Simulating Random Changes Due to Crane Issues
        let vibration = (Math.random() * 4 + 2).toFixed(1); // 2.0 - 6.0 mm/s
        let fuel = (Math.random() * 10 + 10).toFixed(1); // 10 - 20 L/hr
        let temperature = (Math.random() * 15 + 30).toFixed(1); // 30 - 45°C

        // Increase Operating Hours Continuously
        operatingHours = (parseFloat(operatingHours) + 0.1).toFixed(1); // Increase by 0.1 every 5s

        // Updating Values in the Dashboard
        vibrationEl.textContent = `${vibration} mm/s`;
        fuelEl.textContent = `${fuel} L/hr`;
        hoursEl.textContent = `${operatingHours} hrs`;
        temperatureEl.textContent = `${temperature}°C`;

        // Changing Card Colors Based on Thresholds
        updateCardColor(vibrationCard, parseFloat(vibration), 3, 5);
        updateCardColor(fuelCard, parseFloat(fuel), 15, 18);
        updateCardColor(hoursCard, parseFloat(operatingHours), 10, 12);
        updateCardColor(temperatureCard, parseFloat(temperature), 40, 44);

        // Triggering Alerts for Critical Values
        if (parseFloat(vibration) > 5) {
            addNotification(`Vibration levels too high! (${vibration} mm/s) - Possible mechanical failure.`, true);
        }
        if (parseFloat(fuel) > 18) {
            addNotification(`Fuel consumption too high! (${fuel} L/hr) - Crane under excessive load.`, true);
        }
        if (parseFloat(operatingHours) > 10) {
            addNotification(`Operating hours exceed recommended limit! (${operatingHours} hrs) - Consider maintenance.`);
        }
        if (parseFloat(temperature) > 44) {
            addNotification(`Overheating detected! (${temperature}°C) - Brake failure risk. Immediate action required!`, true);
        }
    }

    // Function to Change Card Colors Based on Value Ranges
    function updateCardColor(card, value, warningThreshold, criticalThreshold) {
        if (value > criticalThreshold) {
            card.style.backgroundColor = "red"; // Critical Condition
            card.style.color = "white";
        } else if (value > warningThreshold) {
            card.style.backgroundColor = "yellow"; // Warning Condition
            card.style.color = "black";
        } else {
            card.style.backgroundColor = "green"; // Normal Condition
            card.style.color = "white";
        }
    }

    // Simulate Crane Issue Every 5 Seconds
    setInterval(simulateCraneIssue, 3000);
});
