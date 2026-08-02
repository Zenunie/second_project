const cards = document.querySelectorAll(".card");
const lists = document.querySelectorAll(".list");
let cardCounter = 1;

const addButtons = document.querySelectorAll(".add-btn");
document.querySelectorAll(".card").forEach(addDeleteButton);

for (const card of cards) {
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);
}

for (const list of lists) {
  list.addEventListener("dragover", dragOver);
  list.addEventListener("dragenter", dragEnter);
  list.addEventListener("dragleave", dragLeave);
  list.addEventListener("drop", dragDrop);
}

function dragStart(e) {
  // this allows the drop location to know which element is being moved when you release it
  e.dataTransfer.setData("text/plain", this.id);
}

function dragEnd() {
  console.log("Drag ended");
}

function dragOver(e) {
  // this line is important because by default, browsers don't allow you to drop elements onto other elements.
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add("over");
}

function dragLeave(e) {
  this.classList.remove("over");
}

function dragDrop(e) {
  const id = e.dataTransfer.getData("text/plain");
  const card = document.getElementById(id);

  this.appendChild(card);
  this.classList.remove("over");

  // Remove old status
  card.classList.remove("todo", "progress", "done");

  // Add new status
  if (this.id === "list1") {
    card.classList.add("todo");
  } else if (this.id === "list2") {
    card.classList.add("progress");
  } else if (this.id === "list3") {
    card.classList.add("done");
  }
}

function addDeleteButton(card) {
  const text = card.textContent;

  card.textContent = "";

  const span = document.createElement("span");
  span.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";
  deleteBtn.className = "delete-btn";

  deleteBtn.addEventListener("click", () => {
    card.remove();
  });

  card.appendChild(span);
  card.appendChild(deleteBtn);
}

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const list = button.parentElement;
    const input = list.querySelector(".task-input");

    if (input.value.trim() === "") return;

    const card = document.createElement("div");

    card.className = "card todo";
    card.textContent = input.value;
    card.draggable = true;
    card.id = `card${cardCounter++}`;
    addDeleteButton(card);

    // Enable drag and drop
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);

    // Insert before the input
    list.insertBefore(card, input);

    const cardsContainer = list.querySelector(".cards");
    cardsContainer.appendChild(card);

    input.value = "";
  });
});
