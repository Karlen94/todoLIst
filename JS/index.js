const taskInput = document.querySelector('.task-input'),
    addTaskButton = document.querySelector('#add-task-button'),
    taskRow = document.querySelector('.task-row');
    deleteTasksButton = document.querySelector('#delete-tasks-button');


addTaskButton.addEventListener('click', addNewTask);
deleteTasksButton.addEventListener('click', deleteTasks);

function getTasksFromStorage() {
    let taskStr = localStorage.getItem('tasks');
    if (taskStr) {
        return JSON.parse(taskStr);
    }

    return [];
}

function saveTasksToStorage(tasks) {
    const tasksStr = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksStr);
}

taskInput.addEventListener('keydown', (event) => {
    if (event.key !== "Enter") {
        return;
    }

    addNewTask();
});

const tasks = getTasksFromStorage();
initTasks(tasks);

function initTasks(tasks) {
    let tasksString = '';
    tasks.forEach(task => {
        const taskTemplate = getTaskTemplate(task);
        tasksString += taskTemplate;

    });

    taskRow.insertAdjacentHTML('afterbegin', tasksString);
}

function idGenerator() {
    return Math.random().toString(32).slice(2);
}

function addNewTask() {

    if (!taskInput.value) {
        return;
    }
    let newTask = {
        id: idGenerator(),
        date: new Date().toLocaleDateString(),
        text: taskInput.value
    }

    function idGenerator() {
        return Math.random().toString(32).slice(2);
    }
    const taskTemplate = getTaskTemplate(newTask);

    taskRow.insertAdjacentHTML('afterbegin', taskTemplate);
    taskInput.value = '';

    const tasks = getTasksFromStorage();
    tasks.push(newTask);

    saveTasksToStorage(tasks);
}

function removeTasks(event, taskId) {

    const taskElement = event.target.closest('.task').parentElement;
    taskElement.remove();

    const tasks = getTasksFromStorage();
    const newTasks = tasks.filter(task => task.id !== taskId);
    saveTasksToStorage(newTasks);
}

function editTasks(event) {
    let taskEl = event.target.closest('.task');

    let edit = taskEl.querySelector('.edit');
    edit.hidden = false;

    let actionBtn = taskEl.querySelector('.action-buttons');
    actionBtn.hidden = true;

}

function cancelChanges(event) {
    let taskEl = event.target.closest('.task');

    let edit = taskEl.querySelector('.edit');
    edit.hidden = true;

    let actionBtn = taskEl.querySelector('.action-buttons');
    actionBtn.hidden = false;

}

function saveChanges(event, taskId) {
    let taskEl = event.target.closest('.task');
    let edit = taskEl.querySelector('.edit');
    let editValue = edit.querySelector('input').value;
    let actionButtons = taskElement.querySelector('.action-buttons');

    if (!editValue) {
        return;
    }
    const taskContent = taskElement.querySelector('p');

    taskContent.innerText = editedValue;

    editBlock.hidden = true;
    actionButtons.hidden = false;

    const tasks = getTasksFromStorage();
    const task = tasks.find(task => task.id === taskId);
    task.text = editedValue;

    saveTasksToStorage(tasks);
}


let selectedTaskIds = new Set();

function toggleSelect(taskId) {
    if (selectedTaskIds.has(taskId)) {
        selectedTaskIds.delete(taskId);
    } else {
        selectedTaskIds.add(taskId);
    }


}


function deleteTasks() {
    if (!selectedTaskIds.size) {
        return;
    }

    let tasks = getTasksFromStorage();
    selectedTaskIds.forEach(taskId => {
        const task = document.querySelector(`[data-id="${taskId}"]`);
        task.remove();

        tasks = tasks.filter(task => task.id !== taskId);
    });

    saveTasksToStorage(tasks);
    selectedTaskIds.clear();
}

function getTaskTemplate(task) {
    return `
    <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3" data-id = "${task.id}">
                <div class="card task box">
                    <div class="card-body">
                    <input  type="checkbox" onclick = "toggleSelect('${task.id}')"/>
                    <div>Date ${task.date}</div>
                        <p class="card-text">${task.text}</p>
                        <div class = "edit"  hidden = 'true'>
                            <input type = "text" value = "${task.text}" class = "edit_text">
                            <div class="clear_save text-center">
                                <i class="btn btn-outline-warning  mt-3 fa fa-floppy-o" aria-hidden="true" onclick = saveChanges(event, '${task.id}')></i>
                                <i class="btn btn-outline-danger  mt-3 fa fa-times" aria-hidden="true"  onclick = cancelChanges(event)></i>
                            </div>
                        </div>
        <div class='action-buttons'>
        <i class="btn btn-outline-warning m-1 fa fa-pencil aria-hidden="true" onclick = editTasks(event)></i>
        <i class="btn btn-outline-danger m-1 fa fa-trash-o"  aria-hidden="true" onclick = "removeTasks(event)"></i>
        </div>
          </div>
             </div>
                </div>
    `;
}