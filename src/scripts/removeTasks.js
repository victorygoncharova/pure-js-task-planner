import {
  deleteAllTasksFromArray,
  objOfTasks,
  removeFromObj
} from "./dataStorage.js";
import {
  deleteAllTasksFromLocalStorage,
  deleteFromLocalStorage
} from "./localStorage.js";

let dialogContainer;
let createdDialog;

function onDeleteHandler({ target }) {
  let isDeleteButton =
    target.classList.contains("list__btn") ||
    target.parentElement.classList.contains("list__btn");

  if (!isDeleteButton) return;

  const parentLi = target.closest("[data-task-id]");
  const id = parentLi.dataset.taskId;

  deleteTask(id, objOfTasks);
  deleteTaskFromHTML(parentLi);
  removeDialog();
}

function deleteTask(id, obj) {
  deleteFromLocalStorage(id);
  removeFromObj(id, obj);
}

function deleteTaskFromHTML(task) {
  task.remove();
}

function deleteAllTaskFromHTML(confirmed, container) {
  if (!confirmed) return;

  let lastChild;
  while ((lastChild = container.lastChild)) container.removeChild(lastChild);
}

function onDeleteAllTasks(tasksContainer, optionsContainer) {
  if (createdDialog) return;

  createdDialog = createDeleteDialog(optionsContainer, "all");

  window.addEventListener("click", ({ target }) => {
    if (target.closest(".delete-all")) return;

    if (target.closest(".delete-dialor__label")) return;

    if (target.closest(".delete-dialor__btn")) {
      deleteAllTasksFromArray(createdDialog);
      deleteAllTasksFromLocalStorage(createdDialog);
      deleteAllTaskFromHTML(createdDialog, tasksContainer);
      removeDialog();

      return (createdDialog = false);
    }

    removeDialog();
    return (createdDialog = false);
  });
}

function createDeleteDialog(trigger, action = "current") {
  const fragment = document.createDocumentFragment();
  dialogContainer = document.createElement("div");
  dialogContainer.classList.add("delete-dialor");

  const p = document.createElement("p");
  p.classList.add("delete-dialor__label");
  p.textContent =
    action === "current" ? "Удалить задачу?" : "Удалить все задачи?";

  const btn = document.createElement("button");
  btn.classList.add("delete-dialor__btn");

  const svg =
    '<svg enable-background="new 0 0 515.556 515.556" viewBox="0 0 515.556 515.556" class="icon" xmlns="http://www.w3.org/2000/svg"><path d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z"/></svg>';

  btn.insertAdjacentHTML("afterbegin", svg);

  dialogContainer.appendChild(p);
  dialogContainer.appendChild(btn);
  fragment.appendChild(dialogContainer);
  trigger.appendChild(fragment);

  return true;
}

function removeDialog() {
  dialogContainer.remove();
}

export {
  onDeleteHandler,
  onDeleteAllTasks,
  deleteAllTaskFromHTML,
  createDeleteDialog,
};

