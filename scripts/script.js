(() => {
  document.addEventListener("DOMContentLoaded", () => {
    // Elements

    const formContainer = document.querySelector(".add-task__wrapperr");
    const form = document.forms["add-task"];
    const inputTitle = form.elements["title"];
    const inputBody = form.elements["body"];
    const inputLabel = form.elements["label"];
    const tasksContainer = document.querySelector(".tasks__list");
    const themeChangeContainer = document.querySelector(".theme");
    const deleteAll = document.querySelector(".delete-all");
    const select = document.querySelector(".select");

    // Variables

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
      },
    };
    const arrOfTasks = [];
    let objOfTasks = {};
    let label = "";
    let currentTheme = "light";
    let message;

    // Events

    getThemeFromLS();
    getTaskFromLocalStorange();
    createSelect();
    form.addEventListener("submit", onFormSubmitHandler);
    tasksContainer.addEventListener("click", onDeleteHandler);
    themeChangeContainer.addEventListener("click", onThemeChangeHandler);
    themeChangeContainer.addEventListener("mouseenter", themeTooltipVisible);
    themeChangeContainer.addEventListener("mouseleave", themeTooltipHide);
    tasksContainer.addEventListener("change", addTaskLabelToLS);
    deleteAll.addEventListener("click", onDeleteAllHandler);

    // Functions

    function getTaskFromLocalStorange() {
      const keys = Object.keys(localStorage);

      if (keys.length <= 0) return;

      for (let key of keys) {
        if (!key.includes("task")) {
          break;
        }
        const task = JSON.parse(localStorage.getItem(key));
        arrOfTasks.push(task);
      }

      arrToObj(arrOfTasks);
    }

    function createSelect() {
      const defaultEl = document.createElement("option");
      defaultEl.hidden = true;
      select.appendChild(defaultEl);

      Object.values(objOfTasks).forEach((task) => {
        const optionEl = document.createElement("option");
        optionEl.classList.add("select__option");
        optionEl.value = task.label;
        optionEl.textContent = task.label;
        select.appendChild(optionEl);
      });
    }

    function getThemeFromLS() {
      const theme = localStorage.getItem("app_theme");

      if (theme === currentTheme || theme === null) return;

      currentTheme = theme;
      themeChangeContainer.dataset.theme = "dark";

      setTheme(currentTheme);
    }

    function arrToObj(arrOfTasks) {
      objOfTasks = arrOfTasks.reduce((acc, task) => {
        acc[task._id] = task;
        return acc;
      }, {});

      renderAllTasks(objOfTasks);
      console.log(objOfTasks);
      return objOfTasks;
    }

    function renderAllTasks(tasksList = {}) {
      if (!tasksList) return;
      const fragment = document.createDocumentFragment();

      Object.values(tasksList).forEach((task) => {
        const li = listItemTemplate(task);
        fragment.appendChild(li);
      });

      tasksContainer.appendChild(fragment);
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

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("list__delete-btn");
      deleteButton.type = "button";

      const span = document.createElement("span");

      li.appendChild(taskHeadline);
      li.appendChild(taskBody);
      li.appendChild(deleteButton);
      deleteButton.appendChild(span);

      const labelItem = createLabel(label);

      console.log(labelItem);

      li.insertAdjacentElement("beforeend", labelItem);

      return li;
    }

    function createLabel(label) {
      let labelElement;

      if (!label) {
        labelElement = document.createElement("input");
        labelElement.classList.add("list__label");
        labelElement.name = "label";
        labelElement.placeholder = "Добавить ярлык";
        return labelElement;
      }

      labelElement = document.createElement("p");
      labelElement.classList.add("list__label");
      labelElement.textContent = label;
      return labelElement;
    }

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

    function createNewTask(title, body, label) {
      const newTask = {
        _id: `task-${Math.random()}`,
        complited: false,
        title,
        body,
        label,
      };

      localStorage.setItem(newTask._id, JSON.stringify(newTask));
      objOfTasks[newTask._id] = { ...newTask };
      console.log(objOfTasks);
      return { ...newTask };
    }

    function deleteTask(id) {
      const { title } = objOfTasks[id];
      const isConfirm = confirm(`Точно удалить задачу: "${title}" ?`);

      if (!isConfirm) return isConfirm;

      deleteFromLocalStorange(id);
      delete objOfTasks[id];

      return isConfirm;
    }

    function deleteFromLocalStorange(id) {
      const keys = Object.keys(localStorage);
      localStorage.removeItem(id);
    }

    function deleteTaskFromHTML(confirmed, el) {
      if (!confirmed) return;
      el.remove();
    }

    function onDeleteHandler({ target }) {
      let isDeleteButton =
        target.classList.contains("list__delete-btn") ||
        target.parentElement.classList.contains("list__delete-btn");

      if (isDeleteButton) {
        const parent = target.closest("[data-task-id]");
        const id = parent.dataset.taskId;
        const confirmed = deleteTask(id);
        deleteTaskFromHTML(confirmed, parent);
      }
    }

    function onThemeChangeHandler() {
      const light = "light";
      const dark = "dark";
      const value = themeChangeContainer.dataset.theme;

      if (value === light) {
        themeChangeContainer.dataset.theme = dark;
        localStorage.setItem("app_theme", dark);
        setTheme(dark);
        return;
      }

      themeChangeContainer.dataset.theme = light;
      localStorage.setItem("app_theme", light);
      setTheme(light);
    }

    function setTheme(name) {
      currentTheme = name;
      const selectedThemObj = themes[name];

      Object.entries(selectedThemObj).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }

    function onDeleteAllHandler() {
      objOfTasks.length = 0;
      localStorage.clear();

      let last;
      while ((last = tasksContainer.lastChild))
        tasksContainer.removeChild(last);
    }

    function themeTooltipVisible({ target }) {
      message = document.createElement("p");
      const text =
        currentTheme === "light" || !currentTheme
          ? "Установить темную тему"
          : "Установить светлую тему";
      message.classList.add("message");
      message.textContent = text;

      themeChangeContainer.appendChild(message);
    }

    function themeTooltipHide() {
      if (message) {
        message.remove();
      }
    }

    function addTaskLabelToLS({ target }) {
      if (target.tagName === "INPUT") {
        const parentId = target.closest("li").dataset.taskId;
        label = target.value;
        const taskFromLS = JSON.parse(localStorage.getItem(parentId));

        taskFromLS.label = label;

        localStorage.setItem(parentId, JSON.stringify(taskFromLS));
      }
    }
  });
})();
