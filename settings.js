// 🌙 Toggle Light/Dark Theme
function toggleTheme() {
    document.body.classList.toggle("light-theme");
}

// ✅ Theme Styles (Light Mode)
const style = document.createElement("style");
style.textContent = `
    .light-theme .top-nav { background-color: #fff; color: #333; }
    .light-theme .top-nav .highlight { color: #e6b800; }
    .light-theme .sidebar { background-color: #f4f4f4; color: #333; }
    .light-theme .sidebar ul li.active, .light-theme .sidebar ul li:hover {
        background-color: #e6b800; color: #333;
    }
    .light-theme .main-content { background-color: #f9f9f9; color: #333; }
    .light-theme .settings-section { background-color: #fff; color: #222; }
`;
document.head.appendChild(style);
