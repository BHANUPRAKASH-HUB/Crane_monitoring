// 📡 MQTT Configuration
const MQTT_BROKER = "wss://mqtt.eclipseprojects.io/mqtt";
const MQTT_TOPIC = "raspberrypi/sensors";

// 📊 Get Canvas Contexts for Charts
let vibrationCtx = document.getElementById("vibrationGraph").getContext("2d");
let temperatureCtx = document.getElementById("temperatureGraph").getContext("2d");
let fuelCtx = document.getElementById("fuelGraph").getContext("2d");
let operationHoursCtx = document.getElementById("operationHoursGraph").getContext("2d");

// 📈 Initialize Charts
let vibrationChart = new Chart(vibrationCtx, getChartConfig("Vibration (m/s²)", "rgba(255, 99, 132, 0.6)"));
let temperatureChart = new Chart(temperatureCtx, getChartConfig("Temperature (°C)", "rgba(54, 162, 235, 0.6)"));
let fuelChart = new Chart(fuelCtx, getChartConfig("Fuel Level (%)", "rgba(255, 206, 86, 0.6)"));
let operationHoursChart = new Chart(operationHoursCtx, getChartConfig("Operation Hours (hrs)", "rgba(75, 192, 192, 0.6)"));

// 🔄 Data History for Graphs (Last 10 Data Points)
let dataHistory = {
    vibration: [],
    temperature: [],
    fuel_level: [],
    operating_hours: []
};

// 📡 Connect to MQTT Broker
const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
    console.log("📡 Connected to MQTT Broker");
    client.subscribe(MQTT_TOPIC, (err) => {
        if (!err) console.log(`✅ Subscribed to topic: ${MQTT_TOPIC}`);
        else console.error("❌ Subscription failed:", err);
    });
});

// 📩 Handle Incoming MQTT Messages
client.on("message", (topic, message) => {
    try {
        if (topic === MQTT_TOPIC) {
            let sensorData = JSON.parse(message.toString());

            // Extract and Validate Data
            const temperature = parseFloat(sensorData.temperature) || 0;
            const fuel_level = parseFloat(sensorData.fuel_level) || 0;
            const vibration = parseFloat(sensorData.vibration) || 0;
            const operating_hours = parseFloat(sensorData.operating_hours) || 0;

            // 🖥 Update UI with Live Sensor Data
            document.getElementById("temperature").textContent = temperature.toFixed(2);
            document.getElementById("fuelLevel").textContent = fuel_level.toFixed(2);
            document.getElementById("vibration").textContent = vibration.toFixed(2);
            document.getElementById("operationHours").textContent = operating_hours.toFixed(2);

            // 📡 Send Data to Flask Backend
            sendData({ temperature, fuel_level, vibration, operating_hours });

            // 📈 Update Graphs with New Data
            updateGraphData(vibrationChart, dataHistory.vibration, vibration);
            updateGraphData(temperatureChart, dataHistory.temperature, temperature);
            updateGraphData(fuelChart, dataHistory.fuel_level, fuel_level);
            updateGraphData(operationHoursChart, dataHistory.operating_hours, operating_hours);
        }
    } catch (error) {
        console.error("❌ Error parsing MQTT message:", error);
    }
});

// 🔁 Function to Send Data to Flask Backend for AI Predictions
function sendData(sensorData) {
    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sensorData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.alert) {
            addNotification(result.alert);
        }
    })
    .catch(error => console.error("❌ Error:", error));
}

// 📊 Function to Update Graphs Dynamically
function updateGraphData(chart, dataArray, newData) {
    if (dataArray.length >= 10) dataArray.shift(); // Keep Last 10 Data Points
    dataArray.push(newData);

    chart.data.labels = Array.from({ length: dataArray.length }, (_, i) => i + 1);
    chart.data.datasets[0].data = dataArray;
    chart.update();
}

// 🎨 Function to Generate Chart Configuration
function getChartConfig(label, color) {
    return {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                backgroundColor: color,
                borderColor: color.replace("0.6", "1"),
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            scales: {
                x: {
                    title: { display: true, text: "Time", font: { size: 10 } },
                    ticks: { font: { size: 8 } }
                },
                y: {
                    title: { display: true, text: label, font: { size: 10 } },
                    ticks: { font: { size: 8 } }
                }
            },
            plugins: {
                legend: { labels: { font: { size: 10 } } }
            }
        }
    };
}

// 🔔 Notification Bell Toggle
const notificationToggle = document.getElementById("notificationToggle");
const notificationPanel = document.getElementById("notificationPanel");
const notificationList = document.getElementById("notificationList");

notificationToggle.addEventListener("click", function () {
    notificationPanel.classList.toggle("open");
});

// 🔔 Function to Add Notifications
function addNotification(message) {
    let existingNotifications = Array.from(notificationList.children);
    if (existingNotifications.some(notification => notification.textContent === message)) {
        return;
    }

    let notificationItem = document.createElement("div");
    notificationItem.classList.add("notification");
    notificationItem.textContent = message;
    
    notificationList.appendChild(notificationItem);
    notificationPanel.classList.add("open");

    // Remove Notification After 10 Seconds
    setTimeout(() => {
        notificationItem.remove();
    }, 10000);
}
