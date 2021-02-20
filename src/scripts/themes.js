import { setToLocalStorage } from "./localStorage.js";

const themes = {
  light: {
    "--logo-color": "#323e66",
    "--add-section-bg": "#fdfffc",
    "--add-placeholder-color": "#7a7b7b",
    "--add-btn-color": "#323e66",
    "--tasks-section-bg": "#e1e5f2",
    "--input-border-color": "#e1e5f2",
    "--text-color": "#000",
    "--task-bg": "#fdfffc",
    "--label-task-bg": "#e1e5f2",
    "--label-color": "#000",
    "--box-shadow-color": "rgba(21, 21, 21, 0.25)",
    "--delete-btn-color": "#323e66",
    "--headline-color": "#323e66",
    "--task-text-color": "#000",
    "--tooltip-color": "#7a7b7b",
    "--filter-container-bg": "#323e66",
    "--delete-container-border": "#323e66",
  },
  dark: {
    "--logo-color": "#fdfffc",
    "--add-section-bg": "#323232",
    "--add-placeholder-color": "#fdfffc",
    "--add-btn-color": "none",
    "--tasks-section-bg": "#2e2c2c",
    "--input-border-color": "#e1e5f2",
    "--text-color": "#fdfffc",
    "--task-bg": "none",
    "--label-color": "#fdfffc",
    "--label-task-bg": "none",
    "--box-shadow-color": "rgba(21, 21, 21, 0.25)",
    "--delete-btn-color": "#fdfffc",
    "--headline-color": "#fdfffc",
    "--task-text-color": "#fdfffc",
    "--tooltip-color": "#fdfffc",
    "--filter-container-bg": "#3e3f43",
    "--delete-container-border": "#fdfffc",
  },
};

let currentTheme = "light";
let message;

function setTheme(name) {
  currentTheme = name;
  const selectedThemeObj = themes[name];

  Object.entries(selectedThemeObj).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

function onThemeChangeHandler({ target }) {
  const light = "light";
  const dark = "dark";

  const targetEl = target.closest(".theme");
  const value = targetEl.dataset.theme;

  if (value === light) {
    targetEl.dataset.theme = dark;
    setToLocalStorage("app_theme", dark);
    setTheme(dark);
    return;
  }

  targetEl.dataset.theme = light;
  setToLocalStorage("app_theme", light);
  setTheme(light);
}

function themeTooltipVisible(container) {
  message = document.createElement("p");
  const text =
    currentTheme === "light" || !currentTheme
      ? "Установить темную тему"
      : "Установить светлую тему";
  message.classList.add("message");
  message.textContent = text;

  container.appendChild(message);
}

function themeTooltipHide() {
  if (message) {
    message.remove();
  }
}

export {
  setTheme,
  onThemeChangeHandler,
  themeTooltipVisible,
  themeTooltipHide,
  currentTheme,
};

