import { renderAllTasks } from "./createTasks.js";
import {
  arrOfTasks,
  filteredlabelsArr,
  transformArrToObj
} from "./dataStorage.js";
import { tasksContainer } from "./index.js";
import { deleteAllTaskFromHTML } from "./removeTasks.js";

const filter = document.querySelector(".filter");
const filterContainer = document.querySelector(".filter__container");

function onFilterBtnHandler({ target }) {
  const isFilterButton = target.closest(".filter__btn");
  if (!isFilterButton) return;
  const parent = isFilterButton.parentElement;

  if (parent.classList.contains("open")) {
    removeList();
    return;
  }

  const hasChild = filterContainer.childElementCount > 0;
  if (arrOfTasks.length === 0) return;
  if (hasChild) removeList();
  createList();
}

function createList() {
  const fragment = document.createDocumentFragment();

  filterContainer.parentElement.classList.add("open");

  const filteredArr = filteredlabelsArr();
  filteredArr.unshift("Все задачи");

  filteredArr.forEach((label) => {
    const labelEl = label;
    if (!labelEl) return;

    const li = document.createElement("li");
    li.classList.add("filter__item");
    li.textContent = label;

    fragment.appendChild(li);
  });

  filterContainer.appendChild(fragment);

  filterContainer.addEventListener("click", filterTasks);

  closeClickOverlay();
}

function removeList() {
  filterContainer.parentElement.classList.remove("open");

  let lastChild;
  while ((lastChild = filterContainer.lastChild))
    filterContainer.lastChild.remove();
}

function closeClickOverlay() {
  window.addEventListener("click", ({ target }) => {
    if (target.closest(".filter") || target.closest(".filter__container"))
      return;
    removeList();
  });
}

function filterTasks({ target }) {
  if (!filter.classList.contains("open")) return;

  if (!target.classList.contains("filter__item")) return;

  const taskLabel = target.textContent;

  const newArr = arrOfTasks.reduce((acc, current) => {
    if (current.label === taskLabel || taskLabel === "Все задачи")
      acc.push(current);
    return acc;
  }, []);

  const converted = transformArrToObj(newArr);

  deleteAllTaskFromHTML(true, tasksContainer);
  renderAllTasks(converted, tasksContainer);
}

export { onFilterBtnHandler };

