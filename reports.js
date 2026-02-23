const firebaseURL = "https://sensor-data-8b2d7-default-rtdb.firebaseio.com/sensor_data.json";

async function filterReports() {
    const selectedDate = document.getElementById("reportDate").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    if (!selectedDate || !startTime || !endTime) {
        alert("⚠️ Please select a date and time range.");
        return;
    }

    try {
        const response = await fetch(firebaseURL);
        if (!response.ok) throw new Error("Network Error");

        const data = await response.json();
        const keys = Object.keys(data);
        let filteredData = [];

        keys.forEach(key => {
            let record = data[key];
            let timestamp = record.timestamp; // Example: "28-03-2025 10:29 AM"

            let [day, month, yearTime] = timestamp.split("-");
            let [year, time] = yearTime.split(" ");
            let formattedDate = `${year}-${month}-${day}`;

            let timePart = timestamp.split(" ")[1] + " " + timestamp.split(" ")[2];

            if (formattedDate === selectedDate && isTimeInRange(timePart, startTime, endTime)) {
                filteredData.push(record);
            }
        });

        displayData(filteredData);
        updateCharts(filteredData); // Update the charts with filtered data
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        document.getElementById("reportTableBody").innerHTML = "<tr><td colspan='5'>Error loading data.</td></tr>";
    }
}

function isTimeInRange(recordTime, startTime, endTime) {
    let [recordHour, recordMinute] = convertTo24Hour(recordTime).split(":").map(Number);
    let [startHour, startMinute] = startTime.split(":").map(Number);
    let [endHour, endMinute] = endTime.split(":").map(Number);

    let recordTotalMinutes = recordHour * 60 + recordMinute;
    let startTotalMinutes = startHour * 60 + startMinute;
    let endTotalMinutes = endHour * 60 + endMinute;

    return recordTotalMinutes >= startTotalMinutes && recordTotalMinutes <= endTotalMinutes;
}

function convertTo24Hour(time) {
    let [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (period.toLowerCase() === "am" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function displayData(data) {
    const tableBody = document.getElementById("reportTableBody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>No data found for the selected range.</td></tr>";
        return;
    }

    data.forEach(record => {
        let row = `<tr>
            <td>${record.timestamp}</td>
            <td>${record.temperature}°C</td>
            <td>${record.fuel_level}%</td>
            <td>${record.vibration} m/s²</td>
            <td>${record.operating_hours} hrs</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function downloadCSV() {
    let csvContent = "Date & Time,Temperature (°C),Fuel Level (%),Vibration (m/s²),Operation Hours (hrs)\n";
    const tableRows = document.querySelectorAll("#reportTableBody tr");
    
    tableRows.forEach(row => {
        let cols = row.querySelectorAll("td");
        let rowData = [];
        cols.forEach(col => rowData.push(col.innerText));
        csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "crane_report.csv";
    link.click();
}

// Chart.js instances
let temperatureChart, fuelChart;

// Function to update charts dynamically
function updateCharts(data) {
    let timestamps = data.map(record => record.timestamp);
    let temperatures = data.map(record => record.temperature);
    let fuelLevels = data.map(record => record.fuel_level);

    // Update or create the Temperature Chart
    if (!temperatureChart) {
        temperatureChart = createChart("temperatureTrend", "Temperature (°C)", timestamps, temperatures, "red");
    } else {
        updateChart(temperatureChart, timestamps, temperatures);
    }

    // Update or create the Fuel Level Chart
    if (!fuelChart) {
        fuelChart = createChart("fuelLevelTrend", "Fuel Level (%)", timestamps, fuelLevels, "blue");
    } else {
        updateChart(fuelChart, timestamps, fuelLevels);
    }
}

// Function to create a new chart
function createChart(canvasId, label, labels, data, color) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: "rgba(0,0,0,0.1)",
                borderWidth: 2,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: "Timestamp" },
                    ticks: { autoSkip: true, maxTicksLimit: 10 }
                },
                y: {
                    title: { display: true, text: label },
                    beginAtZero: false
                }
            }
        }
    });
}

// Function to update an existing chart
function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}


// Function to create a new chart
function createChart(canvasId, label, labels, data, color) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: "rgba(0,0,0,0)",
                borderWidth: 2,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: "Timestamp" },
                    ticks: { autoSkip: true, maxTicksLimit: 10 }
                },
                y: {
                    title: { display: true, text: label },
                    beginAtZero: false
                }
            }
        }
    });
}

// Function to update an existing chart
function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}