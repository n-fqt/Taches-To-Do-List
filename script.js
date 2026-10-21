let tasks = [];
let selectedTaskId = null;
let editingTaskId = null;

const taskContainer = document.getElementById("task-container");
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");
const modal = document.getElementById("task-modal");
const modalTitle = document.getElementById("modal-title");
const btnNewTask = document.getElementById("btn-new-task");
const btnCancel = document.getElementById("btn-cancel");
const btnCreate = document.getElementById("btn-create");
const btnChangeColor = document.getElementById("btn-change-color");
const progressFill = document.getElementById("progress-fill");
const btnImportant = document.getElementById("btn-important");
const importantModal = document.getElementById("important-modal");
const importantList = document.getElementById("important-list");
const btnCloseImportant = document.getElementById("btn-close-important");
const btnEditTask = document.getElementById("btn-edit-task");
const editSelectModal = document.getElementById("edit-select-modal");
const editList = document.getElementById("edit-list");
const btnCloseEditSelect = document.getElementById("btn-close-edit-select");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  toggleBtn.classList.toggle("collapsed");
  toggleBtn.textContent = sidebar.classList.contains("collapsed") ? "←" : "→";
});

function clearModalInputs() {
  document.getElementById("task-title-input").value = "";
  document.getElementById("task-desc-input").value = "";
  document.getElementById("task-date-input").value = "";
  document.getElementById("task-color-input").value = "#8ca1d4";
}

btnNewTask.addEventListener("click", () => {
  editingTaskId = null;
  clearModalInputs();
  modalTitle.textContent = "Créer une nouvelle tâche";
  btnCreate.textContent = "Créer";
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

  if (editingTaskId) {
    const task = tasks.find((t) => t.id === editingTaskId);
    if (task) {
      task.title = title;
      task.desc = desc;
      task.date = date;
      task.color = color;
    }
  } else {
    const newTask = {
      id: Date.now().toString(),
      title: title,
      desc: desc,
      date: date,
      color: color,
      completed: false,
      important: false,
    };
    tasks.push(newTask);
  }

  renderTasks();
  updateProgress();
  modal.classList.remove("active");
  clearModalInputs();
  editingTaskId = null;
});

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

    const importantBadge = task.important
      ? `<div class="important-badge">⚠️ Important</div>`
      : "";

    card.innerHTML = `
            ${importantBadge}
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
        if (c.innerHTML.includes(task.title))
          c.style.boxShadow = "0 0 20px 5px " + task.color;
      });
    }
  });
});

btnImportant.addEventListener("click", () => {
  importantList.innerHTML = "";
  if (tasks.length === 0) {
    importantList.innerHTML =
      '<p style="text-align:center; color:#aaa;">Aucune tâche.</p>';
  } else {
    tasks.forEach((task) => {
      const item = document.createElement("div");
      item.className = "important-item";
      item.innerHTML = `<span>${task.title}</span>${task.important ? '<span class="status-text">Déjà important</span>' : ""}`;
      item.onclick = () => makeImportant(task.id);
      importantList.appendChild(item);
    });
  }
  importantModal.classList.add("active");
});

btnCloseImportant.addEventListener("click", () => {
  importantModal.classList.remove("active");
});

window.makeImportant = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    const task = tasks.splice(index, 1)[0];
    task.important = true;
    tasks.unshift(task);
    renderTasks();
    importantModal.classList.remove("active");
  }
};

btnEditTask.addEventListener("click", () => {
  editList.innerHTML = "";
  if (tasks.length === 0) {
    editList.innerHTML =
      '<p style="text-align:center; color:#aaa;">Aucune tâche à modifier.</p>';
  } else {
    tasks.forEach((task) => {
      const item = document.createElement("div");
      item.className = "important-item";
      item.innerHTML = `<span>${task.title}</span><span style="font-size:0.8rem; color:#aaa;">✏️ Modifier</span>`;
      item.onclick = () => openEditModal(task.id);
      editList.appendChild(item);
    });
  }
  editSelectModal.classList.add("active");
});

btnCloseEditSelect.addEventListener("click", () => {
  editSelectModal.classList.remove("active");
});

window.openEditModal = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  editingTaskId = id;

  document.getElementById("task-title-input").value = task.title;
  document.getElementById("task-desc-input").value = task.desc;
  document.getElementById("task-date-input").value = task.date;
  document.getElementById("task-color-input").value = task.color;

  modalTitle.textContent = "Modifier la tâche";
  btnCreate.textContent = "Enregistrer";

  editSelectModal.classList.remove("active");
  modal.classList.add("active");
};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

renderTasks();
updateProgress();
