const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("toggle-modal");
const closeModalBg = document.getElementById("modal-bg");

const addTaskBtn = document.getElementById("add-new-task");

const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-dis");
const colSelect = document.getElementById("task-col");

let dragTask = null;

// ---------------- MODAL ----------------
openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

closeModalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

// ---------------- ADD TASK ----------------
addTaskBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    const col = colSelect.value;

    if (!title) return alert("Enter task title");

    const task = createTask(title, desc);
    document.getElementById(col).appendChild(task);

    saveTasks();
    updateCounts();

    titleInput.value = "";
    descInput.value = "";
    modal.classList.remove("active");
});

// ---------------- CREATE TASK ----------------
function createTask(title, desc) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <strong>${title}</strong>
        <p>${desc}</p>
        <button>Delete</button>
    `;

    // delete
    div.querySelector("button").addEventListener("click", () => {
        div.remove();
        saveTasks();
        updateCounts();
    });

    // drag start
    div.addEventListener("dragstart", () => {
        dragTask = div;
    });

    return div;
}

// ---------------- DRAG & DROP ----------------
[todo, progress, done].forEach(col => {
    col.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    col.addEventListener("drop", () => {
        if (dragTask) {
            col.appendChild(dragTask);
            saveTasks();
            updateCounts();
        }
    });
});

// ---------------- COUNT ----------------
function updateCounts() {
    document.getElementById("count-todo").innerText =
        todo.querySelectorAll(".task").length;

    document.getElementById("count-progress").innerText =
        progress.querySelectorAll(".task").length;

    document.getElementById("count-done").innerText =
        done.querySelectorAll(".task").length;
}

// ---------------- LOCAL STORAGE ----------------
function saveTasks() {
    const data = {
        todo: getTasks(todo),
        progress: getTasks(progress),
        done: getTasks(done)
    };

    localStorage.setItem("kanban-data", JSON.stringify(data));
}

function getTasks(col) {
    return Array.from(col.querySelectorAll(".task")).map(task => ({
        title: task.querySelector("strong").innerText,
        desc: task.querySelector("p").innerText
    }));
}

function loadTasks() {
    const data = JSON.parse(localStorage.getItem("kanban-data"));

    if (!data) return;

    ["todo", "progress", "done"].forEach(col => {
        data[col].forEach(taskData => {
            const task = createTask(taskData.title, taskData.desc);
            document.getElementById(col).appendChild(task);
        });
    });

    updateCounts();
}

loadTasks();