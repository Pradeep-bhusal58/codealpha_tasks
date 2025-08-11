const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const editModal = document.getElementById('edit-modal');
const editTaskInput = document.getElementById('edit-task-input');
const saveEditBtn = document.getElementById('save-edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentEditIndex = -1; 
let currentDeleteIndex = -1; 


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTasks() {
    taskList.innerHTML = ''; 
    if (tasks.length === 0) {
        const noTasksMessage = document.createElement('li');
        noTasksMessage.className = 'text-center text-gray-500 py-4';
        noTasksMessage.textContent = 'No tasks yet! Add one above.';
        taskList.appendChild(noTasksMessage);
        return;
    }

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = `flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm transition duration-200 ease-in-out ${
            task.completed ? 'opacity-70' : ''
        }`;

        const taskContent = document.createElement('div');
        taskContent.className = 'flex items-center flex-grow';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500';
        checkbox.addEventListener('change', () => toggleTask(index));

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text;
        taskTextSpan.className = `flex-grow text-gray-800 ${
            task.completed ? 'completed-task' : ''
        }`;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskTextSpan);


        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'flex items-center space-x-2 ml-4';

        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-600 transition duration-300 shadow-sm';
        editButton.addEventListener('click', () => openEditModal(index));

        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition duration-300 shadow-sm';
        deleteButton.addEventListener('click', () => openDeleteModal(index));

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);

        
        listItem.appendChild(taskContent);
        listItem.appendChild(actionsDiv);

        
        taskList.appendChild(listItem);
    });
}
function addTask(text) {
    if (text.trim() === '') {
        
        return;
    }
    tasks.push({ id: Date.now(), text: text.trim(), completed: false }); // Add unique ID
    saveTasks();
    renderTasks();
}


function toggleTask(index) {
    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }
}


function openEditModal(index) {
    if (index >= 0 && index < tasks.length) {
        currentEditIndex = index;
        editTaskInput.value = tasks[index].text;
        editModal.classList.remove('hidden'); // Show the modal
    }
}


function saveEditedTask() {
    if (currentEditIndex !== -1) {
        const newText = editTaskInput.value.trim();
        if (newText !== '') {
            tasks[currentEditIndex].text = newText;
            saveTasks();
            renderTasks();
            closeEditModal();
        } else {
            console.error('Task cannot be empty!');
        }
    }
}


function closeEditModal() {
    editModal.classList.add('hidden');
    currentEditIndex = -1;
    editTaskInput.value = ''; 
}


function openDeleteModal(index) {
    if (index >= 0 && index < tasks.length) {
        currentDeleteIndex = index;
        deleteModal.classList.remove('hidden'); 
    }
}


function confirmDeleteTask() {
    if (currentDeleteIndex !== -1) {
        tasks.splice(currentDeleteIndex, 1); // Remove task from array
        saveTasks();
        renderTasks();
        closeDeleteModal();
    }
}


function closeDeleteModal() {
    deleteModal.classList.add('hidden'); // Hide the modal
    currentDeleteIndex = -1; // Reset index
}


taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    addTask(taskInput.value);
    taskInput.value = ''; 
});

saveEditBtn.addEventListener('click', saveEditedTask);
cancelEditBtn.addEventListener('click', closeEditModal);

confirmDeleteBtn.addEventListener('click', confirmDeleteTask);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);

renderTasks();
