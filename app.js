let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function updateStats() {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}

function renderTodos() {
    const todoList = document.getElementById("todoList");
    const emptyState = document.getElementById("emptyState");

    let filteredTodos = todos;
    if (currentFilter === "active") {
        filteredTodos = todos.filter((todo) => !todo.completed);
    } else if (currentFilter === "completed") {
        filteredTodos = todos.filter((todo) => todo.completed);
    }

    todoList.innerHTML = "";

    if (todos.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement("li");
            li.className = `todo-item priority-${todo.priority} ${
                todo.completed ? "completed" : ""
            }`;

            const date = new Date(todo.date);
            const formattedDate = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

            li.innerHTML = `
                        <input type="checkbox" 
                               class="todo-checkbox"
                               ${todo.completed ? "checked" : ""} 
                               onchange="toggleTodo(${index})">
                        <div class="todo-content">
                            <span class="todo-text">${todo.text}</span>
                            <div class="todo-meta">
                                <span>Added: ${formattedDate}</span>
                                <span>Priority: ${todo.priority}</span>
                            </div>
                        </div>
                        <div class="todo-actions">
                            <button class="action-btn" onclick="editTodo(${index})">✏️</button>
                            <button class="action-btn delete-btn" onclick="deleteTodo(${index})">🗑️</button>
                        </div>
                    `;

            todoList.appendChild(li);
        });
    }

    updateStats();
}

function addTodo() {
    const input = document.getElementById("todoInput");
    const priority = document.getElementById("prioritySelect").value;
    const text = input.value.trim();

    if (text) {
        todos.unshift({
            text,
            completed: false,
            priority,
            date: new Date().toISOString(),
        });
        localStorage.setItem("todos", JSON.stringify(todos));
        input.value = "";
        renderTodos();
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

function deleteTodo(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        todos.splice(index, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }
}

function editTodo(index) {
    const newText = prompt("Edit task:", todos[index].text);
    if (newText !== null && newText.trim() !== "") {
        todos[index].text = newText.trim();
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }
}

function filterTodos(filter) {
    currentFilter = filter;
    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");
    renderTodos();
}

// Add todo when Enter key is pressed
document.getElementById("todoInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTodo();
    }
});

// JavaScript functions to handle modal display and editing
function openModal(index) {
    const modal = document.getElementById("editModal");
    const editInput = document.getElementById("editInput");
    editInput.value = todos[index].text;
    modal.style.display = "block";

    // Save the index of the todo being edited
    editInput.dataset.index = index;
}

function closeModal() {
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
}

function saveEdit() {
    const editInput = document.getElementById("editInput");
    const index = editInput.dataset.index;
    const newText = editInput.value.trim();

    if (newText) {
        todos[index].text = newText;
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
        closeModal();
    }
}

// Initial render
renderTodos();
