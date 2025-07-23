const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const themeToggleButton = document.getElementById('theme-toggle');

addButton.addEventListener('click', addTask);
taskInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') addTask();
});
taskList.addEventListener('click', handleTaskClick);
themeToggleButton.addEventListener('click', toggleTheme);
document.addEventListener('DOMContentLoaded', loadInitialState);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert("You must write something!");
        return;
    }
    createTaskElement(taskText, false); // Create new task, not completed
    taskInput.value = '';
    taskInput.focus();
    saveData();
}

/**
 * Creates and appends a task list item to the DOM.
 * @param {string} text - The text content of the task.
 * @param {boolean} isCompleted - Whether the task is completed.
 */
function createTaskElement(text, isCompleted) {
    const li = document.createElement('li');
    if (isCompleted) {
        li.className = 'completed';
    }
    
    const taskSpan = document.createElement('span');
    taskSpan.textContent = text;
    li.appendChild(taskSpan);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;';
    deleteButton.className = 'delete-btn';
    li.appendChild(deleteButton);
    
    taskList.appendChild(li);
}

function handleTaskClick(event) {
    const target = event.target;
    if (target.classList.contains('delete-btn')) {
        target.parentElement.remove();
    } else if (target.tagName === 'LI' || target.tagName === 'SPAN') {
        const listItem = target.closest('li');
        if (listItem) {
            listItem.classList.toggle('completed');
        }
    }
    saveData();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon(isDarkMode);
}

function updateThemeIcon(isDarkMode) {
    themeToggleButton.textContent = isDarkMode ? '☀️' : '🌙';
}

function saveData() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadInitialState() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDarkMode = savedTheme === 'dark';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon(isDarkMode);

    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        savedTasks.forEach(task => createTaskElement(task.text, task.completed));
    }
}