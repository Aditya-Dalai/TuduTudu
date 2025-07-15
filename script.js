let tasks = [];
let history = [];
let isDark = false;

const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const newTaskInput = document.getElementById("newTaskInput");
const saveTask = document.getElementById("saveTask");
const cancelTask = document.getElementById("cancelTask");
const filter = document.getElementById("filter");
const historyBtn = document.getElementById("historyBtn");
const historyModal = document.getElementById("historyModal");
const historyList = document.getElementById("historyList");
const darkModeToggle = document.getElementById("darkModeToggle");

addTaskBtn.onclick = () => {
  newTaskInput.value = "";
  taskModal.classList.remove("hidden");
  newTaskInput.focus();
};

cancelTask.onclick = () => {
  taskModal.classList.add("hidden");
};

saveTask.onclick = () => {
  const text = newTaskInput.value.trim();
  if (text) {
    const task = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.unshift(task);
    taskModal.classList.add("hidden");
    renderTasks();
  }
};

function renderTasks() {
  const currentFilter = filter.value;
  taskList.innerHTML = "";
  tasks
    .filter(task => {
      if (currentFilter === "all") return true;
      return currentFilter === "complete" ? task.completed : !task.completed;
    })
    .forEach(task => {
      const li = document.createElement("li");
      li.className = `task ${task.completed ? "completed" : ""}`;
      const content = document.createElement("span");
      content.textContent = task.text;
      li.appendChild(content);

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.onclick = () => {
        const updatedText = prompt("Edit task:", task.text);
        if (updatedText) {
          task.text = updatedText;
          renderTasks();
        }
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.onclick = () => {
        tasks = tasks.filter(t => t.id !== task.id);
        renderTasks();
      };

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = task.completed ? "✅" : "☐";
      toggleBtn.onclick = () => {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        renderTasks();
      };

      actions.appendChild(toggleBtn);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      li.appendChild(actions);

      taskList.appendChild(li);
    });
}

filter.onchange = renderTasks;

historyBtn.onclick = () => {
  historyList.innerHTML = "";
  const now = new Date();
  const moved = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate.toDateString() !== now.toDateString();
  });
  moved.forEach(task => {
    const li = document.createElement("li");
    li.textContent = `${task.text} - ${task.completed ? `Completed at: ${task.completedAt}` : "Not completed"}`;
    historyList.appendChild(li);
  });
  historyModal.classList.remove("hidden");
};

document.body.onclick = (e) => {
  if (e.target.classList.contains("modal")) {
    taskModal.classList.add("hidden");
    historyModal.classList.add("hidden");
  }
};

darkModeToggle.onclick = () => {
  isDark = !isDark;
  document.body.classList.toggle("dark", isDark);
};

// Move old tasks to history at midnight
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() < 2) {
    const today = now.toDateString();
    const oldTasks = tasks.filter(task => new Date(task.createdAt).toDateString() !== today);
    history.push(...oldTasks);
    tasks = tasks.filter(task => new Date(task.createdAt).toDateString() === today);
    renderTasks();
  }
}, 60000);

renderTasks();
