const arrOfTasks = [];
let objOfTasks = {};

function addToArray(taskObj) {
  arrOfTasks.push(taskObj);
  transformArrToObj(arrOfTasks);
  return arrOfTasks;
}

function transformArrToObj(array) {
  objOfTasks = array.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});
  return objOfTasks;
}

function removeFromObj(id, obj) {
  delete obj[id];
}

function addLabelToTasksArr(id, newLabel) {
  arrOfTasks.forEach((task) => {
    if (task._id !== id) return;
    task.label = newLabel;
  });

  return arrOfTasks;
}

function deleteAllTasksFromArray(confirmed) {
  if (!confirmed) return;
  arrOfTasks.splice(0, arrOfTasks.length);
  return arrOfTasks;
}

function filteredlabelsArr() {
  const labelsArr = arrOfTasks.map((item) => item.label);
  const filteredlabelsArr = labelsArr.filter((item, i) => {
    return i === labelsArr.indexOf(item);
  });

  return filteredlabelsArr;
}

export {
  addToArray,
  transformArrToObj,
  removeFromObj,
  arrOfTasks,
  objOfTasks,
  addLabelToTasksArr,
  deleteAllTasksFromArray,
  filteredlabelsArr,
};

