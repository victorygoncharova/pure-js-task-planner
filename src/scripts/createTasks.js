import { addToArray } from "./dataStorage";
import { setToLocalStorage } from "./localStorage";

function createNewTask(title, body, label) {
  const newTask = {
    _id: `task-${Math.floor(Math.random() * 1000)}`,
    title,
    body,
    label,
  };

  addToArray(newTask);
  setToLocalStorage(newTask._id, newTask);

  return { ...newTask };
}

function listItemTemplate({ _id, title, body = "", label = "" } = {}) {
  const li = document.createElement("li");
  li.classList.add("list__item");
  li.setAttribute("data-task-id", _id);

  const taskHeadline = document.createElement("h2");
  taskHeadline.classList.add("list__headline");
  taskHeadline.textContent = title;

  const taskBody = document.createElement("p");
  taskBody.classList.add("list__body");
  taskBody.textContent = body;

  const deleteContainer = document.createElement("div");
  deleteContainer.classList.add("list__delete");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("list__btn");
  deleteButton.type = "button";

  const span = document.createElement("span");

  li.appendChild(taskHeadline);
  li.appendChild(taskBody);
  li.appendChild(deleteContainer);
  deleteContainer.appendChild(deleteButton);
  deleteButton.appendChild(span);

  const labelItem = createLabel(label);
  li.insertAdjacentElement("beforeend", labelItem);

  return li;
}

function createLabel(labelValue) {
  let labelElement;

  if (!labelValue) {
    labelElement = document.createElement("input");
    labelElement.classList.add("list__label");
    labelElement.name = "label";
    labelElement.placeholder = "Добавить ярлык";
    return labelElement;
  }

  labelElement = document.createElement("p");
  labelElement.classList.add("list__label");
  labelElement.textContent = labelValue;
  return labelElement;
}

function renderAllTasks(tasksObj = {}, container) {
  if (!tasksObj) return;
  const fragment = document.createDocumentFragment();

  Object.values(tasksObj).forEach((task) => {
    const li = listItemTemplate(task);
    fragment.appendChild(li);
  });

  container.appendChild(fragment);
}

export { createNewTask, listItemTemplate, renderAllTasks };

