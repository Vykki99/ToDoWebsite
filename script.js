const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

var xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
var level = localStorage.getItem("level") ? parseInt(localStorage.getItem("level")) : 0;

let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
  todo = [];
}

function CreateToDoItems() {
  if (todoValue.value === "") {
    setAlertMessage("Please enter your task!");
    todoAlert.innerText = "Please enter your task!";
    todoValue.focus();
  } else {
    let IsPresent = false;
    todo.forEach((element) => {
      if (element.item == todoValue.value) {
        IsPresent = true;
      }
    });

    if (IsPresent) {
      setAlertMessage("This task is already in the list!");
      return;
    }

    let li = document.createElement("li");
    const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div><div>
                      <span class="helper"><img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" /></span>
                      <span class="helper"><img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png" /></span></div></div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);

    if (!todo) {
      todo = [];
    }
    let itemList = { item: todoValue.value, status: false };
    todo.push(itemList);
    setLocalStorage();

    setAlertMessage("Task Created Successfully!");
  }
  todoValue.value = "";
}

function ReadToDoItems() {
  todo.forEach((element) => {
    let li = document.createElement("li");
    let style = "";
    if (element.status) {
      style = "style='text-decoration: line-through'";
    }
    const todoItems = `<div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${
      element.item
    }
    ${
      style === ""
        ? ""
        : '<img class="todo-controls" src="images/check-mark.png" />'
    }</div><div>
    ${
      style === ""
        ? '<span class="helper"><img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" /></span>'
        : ""
    }
    <span class="helper"><img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png" /></span></div></div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}
ReadToDoItems();

function UpdateToDoItems(e) {
  let updateTextElement = e.closest("li").querySelector("div:first-child");
  console.log("updateTextElement:", updateTextElement);
  if (updateTextElement && updateTextElement.style.textDecoration === "") {
    todoValue.value = updateTextElement.innerText;
    updateText = updateTextElement;
    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.setAttribute("src", "images/refresh.png");
    todoValue.focus();
  }
}

function UpdateOnSelectionItems() {
  let IsPresent = false;
  todo.forEach((element) => {
    if (element.item == todoValue.value) {
      IsPresent = true;
    }
  });

  if (IsPresent) {
    setAlertMessage("This task is already in the list!");
    return;
  }

  todo.forEach((element) => {
    if (element.item == updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "images/plus.png");
  todoValue.value = "";
  setAlertMessage("Task Updated Successfully!");
}

function DeleteToDoItems(e) {
  let listItem = e.closest("li");
  let deleteValue = listItem.querySelector("div:first-child").innerText.trim();

  if (confirm(`Are you sure you want to delete this task: ${deleteValue}?`)) {
    let taskIndex = todo.findIndex(task => task.item.trim() === deleteValue);
    if (taskIndex !== -1) {
      todo.splice(taskIndex, 1);
      setLocalStorage();
    }

    listItem.classList.add("deleted-item");
    setTimeout(() => {
      listItem.remove();
    }, 1000);
  }
}

function CompletedToDoItems(e) {
  if (e.parentElement.querySelector("div").style.textDecoration === "") {
    e.parentElement.querySelector("div").style.textDecoration = "line-through";
    e.parentElement.querySelector("img.edit").remove();

    todo.forEach((element) => {
      if (
        e.parentElement.querySelector("div").innerText.trim() == element.item
      ) {
        element.status = true;
      }
    });
    setLocalStorage();
    setAlertMessage("Task Completed Successfully!");
    ExperienceBar();
  }
}

function ExperienceBar() {
  xp += 10;
  if (xp >= 100) {
    level++;
    xp = 0;
    setAlertMessage("You Leveled Up!");
  }
  document.getElementById("level").innerHTML = level;
  document.getElementById("xp").setAttribute("value", xp);
  setLocalStorageXPLevel();
}

function setLocalStorageXPLevel() {
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}