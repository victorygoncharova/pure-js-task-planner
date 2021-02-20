import { renderAllTasks } from "./createTasks.js";
import { addToArray, transformArrToObj } from "./dataStorage.js";
import { setTheme } from "./themes.js";

function setToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTasksFromLocalStorage(containerEl) {
  const arrOfKeys = getKeysFromLocalStorage();

  if (arrOfKeys.length === 0) return;

  const verifiedArr = arrOfKeys.filter((item) => item.includes("task"));

  if (verifiedArr.length === 0) return;

  function createArrayOfTasks() {
    let array;
    for (let key of verifiedArr) {
      const task = getFromLocalStorage(key);
      array = addToArray(task);
    }
    return array;
  }

  const arrTasksFromLocalStorage = createArrayOfTasks();
  const objTasksFromLocalStorage = transformArrToObj(arrTasksFromLocalStorage);

  renderAllTasks(objTasksFromLocalStorage, containerEl);
}

function getKeysFromLocalStorage() {
  return Object.keys(localStorage);
}

function getFromLocalStorage(item) {
  return JSON.parse(localStorage.getItem(item));
}

function deleteFromLocalStorage(id) {
  localStorage.removeItem(id);
}

function addLabelToLocalStorage(id, label) {
  const task = getFromLocalStorage(id);
  task.label = label;

  setToLocalStorage(id, task);
}

function deleteAllTasksFromLocalStorage(confirmed) {
  if (!confirmed) return;

  const keys = getKeysFromLocalStorage();

  keys
    .filter((item) => item.includes("task"))
    .forEach((task) => deleteFromLocalStorage(task));
}

function getThemeFromLocalStorage(currentThemeValue, themeIconContainer) {
  const theme = getFromLocalStorage("app_theme");
  if (theme === currentThemeValue || theme === null) return;
  currentThemeValue = theme;
  themeIconContainer.dataset.theme = "dark";

  setTheme(currentThemeValue);
}

export {
  setToLocalStorage,
  getThemeFromLocalStorage,
  getTasksFromLocalStorage,
  getKeysFromLocalStorage,
  deleteFromLocalStorage,
  addLabelToLocalStorage,
  deleteAllTasksFromLocalStorage,
};

