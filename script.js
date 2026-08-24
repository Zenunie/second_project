const STORAGE_KEY = "kanbanTasks";
const lists = document.querySelectorAll(".list");
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
let cardCounter = 0;

const statusToList = {
  todo: "list1",
  progress: "list2",
  done: "list3",
};

for (const list of lists) {
  list.addEventListener("dragover", dragOver);
  list.addEventListener("dragenter", dragEnter);
  list.addEventListener("dragleave", dragLeave);
  list.addEventListener("drop", dragDrop);
}

function createCard(
  text,
  status = "todo",
  id = `card-${Date.now()}-${cardCounter++}`,
) {
  const card = document.createElement("div");
  card.className = `card ${status}`;
  card.draggable = true;
  card.id = id;

  const label = document.createElement("span");
  label.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×";
  deleteBtn.className = "delete-btn";
  deleteBtn.type = "button";
  deleteBtn.setAttribute("aria-label", `Delete ${text}`);
  deleteBtn.addEventListener("click", () => {
    card.remove();
    saveTasks();
  });

  card.append(label, deleteBtn);
  card.addEventListener("dragstart", dragStart);
  return card;
}

function saveTasks() {
  const tasks = [...document.querySelectorAll(".card")].map((card) => ({
    id: card.id,
    text: card.querySelector("span").textContent,
    status: ["todo", "progress", "done"].find((status) =>
      card.classList.contains(status),
    ),
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = [];

  try {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.warn("Saved tasks could not be loaded.", error);
  }

  for (const task of tasks) {
    if (!task.text || !statusToList[task.status]) continue;

    const card = createCard(task.text, task.status, task.id);
    document
      .querySelector(`#${statusToList[task.status]} .cards`)
      .appendChild(card);
  }
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", this.id);
}

function dragOver(event) {
  event.preventDefault();
}

function dragEnter(event) {
  event.preventDefault();
  this.classList.add("over");
}

function dragLeave(event) {
  if (!this.contains(event.relatedTarget)) this.classList.remove("over");
}

function dragDrop(event) {
  event.preventDefault();
  const card = document.getElementById(
    event.dataTransfer.getData("text/plain"),
  );
  if (!card) return;

  this.querySelector(".cards").appendChild(card);
  this.classList.remove("over");
  card.classList.remove("todo", "progress", "done");

  const status = Object.keys(statusToList).find(
    (key) => statusToList[key] === this.id,
  );
  card.classList.add(status);
  saveTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const taskName = taskInput.value.trim();
  if (!taskName) return;

  const card = createCard(taskName);
  document.querySelector("#list1 .cards").appendChild(card);
  saveTasks();

  taskInput.value = "";
  taskInput.focus();
});

loadTasks();
