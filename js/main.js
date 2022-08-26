const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(function(task) {
        renderTask(task);
    })
}



checkEmptyList();

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);

function addTask (event) {
    event.preventDefault();

    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    taskInput.value = "";
    taskInput.focus();
    checkEmptyList ();
   
}

function deleteTask (event) {
    if (event.target.dataset.action !== 'delete') {
        return
        }
     
    const parenNode = event.target.closest('li');
    const id = Number(parenNode.id);
    const index = tasks.findIndex((task) => {
        return task.id === id;
        }
    );

   

    tasks.splice(index, 1); 

    parenNode.remove();
    checkEmptyList ();
    saveToLocalStorage();
    
}

function doneTask(event) {
    if (event.target.dataset.action !== 'done') {
        return
    }

    const parentNode = event.target.closest('li');

    const id = Number(parentNode.id);

    const task =  tasks.find(function(task) {
        if (task.id ===  id) {
            return true
        }
    });

    task.done = !task.done;

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList () {
    if (tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
                    <img src="./images/leaf.svg" width="48" alt="Empty" class="mt-3 central-pic">
                    <div class="empty-list__title">List of tasks is empty</div>
                </li>`
        taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } else {
        const emptyListElem = document.querySelector('#emptyList');
        emptyListElem ? emptyListElem.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask (task) {
    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" class="btn-action" data-action="done">
                            <img src="./images/tick.svg" width="18" height="18" alt="Done">
                        </button>
                        <button type="button" class="btn-action" data-action="delete">
                            <img src="./images/cross.svg" width="18" height="18" alt="Delete">
                        </button>
                    </div>
                </li>`;

    taskList.insertAdjacentHTML('beforeend', taskHTML);
}