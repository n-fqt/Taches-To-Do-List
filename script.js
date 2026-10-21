let tasks = [];
let selectedTaskId = null;

const taskContainer = document.getElementById("task-container");
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");
const modal = document.getElementById("task-modal");
const btnNewTask = document.getElementById("btn-new-task");
const btnCancel = document.getElementById("btn-cancel");
const btnCreate = document.getElementById("btn-create");
const btnChangeColor = document.getElementById("btn-change-color");
const progressFill = document.getElementById("progress-fill");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  toggleBtn.classList.toggle("collapsed");
  toggleBtn.textContent = sidebar.classList.contains("collapsed") ? "←" : "→";
});

btnNewTask.addEventListener("click", () => {
  modal.classList.add("active");
  document.getElementById("task-title-input").focus();
});

btnCancel.addEventListener("click", () => {
  modal.classList.remove("active");
  clearModalInputs();
});

btnCreate.addEventListener("click", () => {
  const title = document.getElementById("task-title-input").value;
  const desc = document.getElementById("task-desc-input").value;
  const date = document.getElementById("task-date-input").value;
  const color = document.getElementById("task-color-input").value;

  if (title.trim() === "") {
    alert("Le titre est obligatoire !");
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    title: title,
    desc: desc,
    date: date,
    color: color,
    completed: false,
  };

  tasks.push(newTask);
  renderTasks();
  updateProgress();

  modal.classList.remove("active");
  clearModalInputs();
});

function clearModalInputs() {
  document.getElementById("task-title-input").value = "";
  document.getElementById("task-desc-input").value = "";
  document.getElementById("task-date-input").value = "";
  document.getElementById("task-color-input").value = "#8ca1d4";
}

function renderTasks() {
  taskContainer.innerHTML = "";

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = `task-card ${task.completed ? "completed" : ""}`;
    card.style.backgroundColor = hexToRgba(task.color, 0.4);
    card.style.borderColor = hexToRgba(task.color, 0.8);

    card.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("delete-btn") ||
        e.target.type === "checkbox"
      )
        return;

      document
        .querySelectorAll(".task-card")
        .forEach((c) => (c.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"));

      selectedTaskId = task.id;
      card.style.boxShadow = "0 0 20px 5px " + task.color;
    });

    card.innerHTML = `
            <button class="delete-btn" onclick="deleteTask('${task.id}')">X</button>
            <div class="task-title">${task.title}</div>
            <div class="task-desc">${task.desc}</div>
            ${task.date ? `<div class="task-date">📅 ${task.date}</div>` : ""}
            <div style="margin-top:auto; display:flex; align-items:center; gap:10px;">
                <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete('${task.id}')">
                <span style="font-size:0.8rem">Fait</span>
            </div>
        `;

    taskContainer.appendChild(card);
  });
}

window.deleteTask = (id) => {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
  updateProgress();
};

window.toggleComplete = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
    updateProgress();
  }
};

function updateProgress() {
  if (tasks.length === 0) {
    progressFill.style.width = "0%";
    return;
  }
  const completedTasks = tasks.filter((t) => t.completed).length;
  const percentage = (completedTasks / tasks.length) * 100;
  progressFill.style.width = `${percentage}%`;
}

btnChangeColor.addEventListener("click", () => {
  if (!selectedTaskId) {
    alert("Clique d'abord sur une carte pour la sélectionner !");
    return;
  }
  const tempColorInput = document.createElement("input");
  tempColorInput.type = "color";
  tempColorInput.click();

  tempColorInput.addEventListener("input", (e) => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (task) {
      task.color = e.target.value;
      renderTasks();
      const cards = document.querySelectorAll(".task-card");
      cards.forEach((c) => {
        if (c.innerHTML.includes(task.title)) {
          c.style.boxShadow = "0 0 20px 5px " + task.color;
        }
      });
    }
  });
});

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

tasks = [
  {
    id: "1",
    title: "Tâches #1",
    desc: "Description de la tâche 1",
    date: "",
    color: "#8ca1d4",
    completed: false,
  },
  {
    id: "2",
    title: "Tâches #2",
    desc: "Description de la tâche 2",
    date: "",
    color: "#c38ce4",
    completed: false,
  },
  {
    id: "3",
    title: "Tâches #3",
    desc: "Description de la tâche 3",
    date: "",
    color: "#8cc4e4",
    completed: false,
  },
  {
    id: "4",
    title: "Tâches #4",
    desc: "Description de la tâche 4",
    date: "",
    color: "#8ca1d4",
    completed: false,
  },
  {
    id: "5",
    title: "Tâches #5",
    desc: "Description de la tâche 5",
    date: "",
    color: "#8ce4d4",
    completed: false,
  },
  {
    id: "6",
    title: "Tâches #6",
    desc: "Description de la tâche 6",
    date: "",
    color: "#4cdbcc",
    completed: false,
  },
];

renderTasks();
updateProgress();
