// Ensure script runs only after DOM loads
window.onload = function () {
    console.log("Dashboard script loaded successfully!");

    // Select all sections and sidebar items
    const sections = document.querySelectorAll('.section');
    const sidebarItems = document.querySelectorAll('.sidebar ul li');

    // Show selected section and update sidebar active state
    window.showSection = function (event, sectionId) {
        console.log("Switching to section:", sectionId);
        
        sections.forEach(section => section.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';

        sidebarItems.forEach(item => item.classList.remove('active'));
        event.currentTarget.classList.add('active');

        if (sectionId === 'analytics') updateAnalytics();
    };

    // Function to generate random values
    function getRandomValue(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    }

    // Function to update dashboard values dynamically
    function updateDashboardValues() {
        if (!document.getElementById("temperature")) {
            console.error("Temperature element missing!");
            return;
        }

        document.getElementById("temperature").textContent = `${getRandomValue(20, 35)}°C`;
        document.getElementById("fuel").textContent = `${getRandomValue(50, 100)}%`;
        document.getElementById("vibration").textContent = `${getRandomValue(0, 10)} mm/s`;
        document.getElementById("uptime").textContent = `${getRandomValue(0, 1000)} hrs`;
        document.getElementById("load").textContent = `${getRandomValue(0, 20)} tons`;
    }

    // Update values every 2 seconds
    setInterval(updateDashboardValues, 2000);
    updateDashboardValues();

    // Performance Analysis Chart
    const performanceCtx = document.getElementById("performanceChart").getContext("2d");
    new Chart(performanceCtx, {
        type: "line",
        data: {
            labels: [...Array(10)].map((_, i) => `Time ${i + 1}`),
            datasets: [{
                label: "Performance (%)",
                data: [...Array(10)].map(() => getRandomValue(50, 100)),
                backgroundColor: "rgba(52, 152, 219, 0.2)",
                borderColor: "#3498db",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });

    // Fuel Consumption Chart
    const fuelCtx = document.getElementById("fuelChart").getContext("2d");
    new Chart(fuelCtx, {
        type: "bar",
        data: {
            labels: [...Array(7)].map((_, i) => `Day ${i + 1}`),
            datasets: [{
                label: "Fuel Consumption (Liters)",
                data: [...Array(7)].map(() => getRandomValue(50, 70)),
                backgroundColor: "#e74c3c",
                borderColor: "#c0392b",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
};