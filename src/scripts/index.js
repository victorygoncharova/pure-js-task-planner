import "../sass/style.scss";
import { createNewTask, listItemTemplate } from "./createTasks.js";
import { addLabelToTasksArr } from "./dataStorage.js";
import { onFilterBtnHandler } from "./filteringTasks.js";
import {
  addLabelToLocalStorage,
  getTasksFromLocalStorage,
  getThemeFromLocalStorage
} from "./localStorage.js";
import { onDeleteAllTasks, onDeleteHandler } from "./removeTasks.js";
import {
  currentTheme,
  onThemeChangeHandler,
  themeTooltipHide,
  themeTooltipVisible
} from "./themes.js";

const form = document.forms["add-task"];
const formContainer = document.querySelector(".add-task__wrapper");
const tasksContainer = document.querySelector(".tasks__list");
const inputTitle = form.elements["title"];
const inputBody = form.elements["body"];
const inputLabel = form.elements["label"];
const themeIcon = document.querySelector(".theme");
const deleteAllTasksContainer = document.querySelector(".tasks__options");
const deleteAllTasksBtn = document.querySelector(".delete-all");
const filterBtn = document.querySelector(".filter__btn");

let label = "";

getThemeFromLocalStorage(currentTheme, themeIcon);
getTasksFromLocalStorage(tasksContainer);
form.addEventListener("submit", onFormSubmitHandler);
tasksContainer.addEventListener("click", onDeleteHandler);
tasksContainer.addEventListener("change", onLableChangeHandler);
deleteAllTasksBtn.addEventListener("click", () =>
  onDeleteAllTasks(tasksContainer, deleteAllTasksContainer)
);
filterBtn.addEventListener("click", onFilterBtnHandler);
themeIcon.addEventListener("mouseenter", () => themeTooltipVisible(themeIcon));
themeIcon.addEventListener("mouseleave", themeTooltipHide);
themeIcon.addEventListener("click", onThemeChangeHandler);

function onFormSubmitHandler(e) {
  e.preventDefault();

  const titleValue = inputTitle.value;
  const bodyValue = inputBody.value;
  const labelValue = inputLabel.value;

  if (!titleValue) {
    const message = document.createElement("p");
    message.textContent = "Введите название и текст задачи";
    message.classList.add("message");
    formContainer.appendChild(message);
    setTimeout(() => {
      message.remove();
    }, 5000);
    return;
  }

  const task = createNewTask(titleValue, bodyValue, labelValue);
  const listItem = listItemTemplate(task);
  tasksContainer.insertAdjacentElement("afterbegin", listItem);
  form.reset();
}

function onLableChangeHandler({ target }) {
  if (target.tagName === "INPUT") {
    const parentId = target.closest("li").dataset.taskId;
    label = target.value;

    addLabelToLocalStorage(parentId, label);
    addLabelToTasksArr(parentId, label);
  }
}

export { tasksContainer };

