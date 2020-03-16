const input = document.querySelector('.mainInput');
const ulItems = document.getElementById('ulItems');
const footer = document.querySelector('.footer');
const btnShowActive = document.querySelector('.showActive');
const btnShowAll = document.querySelector('.showAll');
const btnShowCompleted = document.querySelector('.showCompleted');
const clearCompleted = document.getElementById('clear');
const URL = 'http://localhost:3000/myTodoList';

let todoList = [];

//checking our List for current jobs
const checkFooter = () => {
    if (todoList.length) {
        footer.classList.remove('visually-hidden');
    } else {
        footer.classList.add('visually-hidden');
    }
};

//create DOM-elements, add classes and attributes to them,
function renderItem(task) {
    const {value, checked = false} = task;
    const li = document.createElement('li');
    li.classList.add('item');

    const text = document.createElement('label');
    text.classList.add('text');
    text.classList.add('notDone');
    text.append(value);

    const checkbox = document.createElement('input');
    checkbox.classList.add('checkInput');
    checkbox.setAttribute('type', 'checkbox');
    if (checked) {
        checkbox.setAttribute('checked', '');
        text.classList.add('done');
    }

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete');

    ulItems.appendChild(li).append(checkbox, text, delBtn);

    checkedItem(checkbox, task);
    deleteItemFromServer(delBtn, task);
}

//save our tasks in 'model' and in database
function saveTask(task) {
    todoList.push(task);

    saveDataToJSONServer(task);
    checkFooter();
}

//we post our task to database
const saveDataToJSONServer = (task) => {
    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(task)
    })
        .then(resp => {
            resp.json().then(newTask => renderItem(newTask))
        });
};

//create task with parameters, save it in database and clear field
const handleSaveTask = event => {
    if (event.code === "Enter" && input.value.length) {
        const newTask = {
            id: uuidv4(),
            value: input.value,
            checked: false
        };

        saveTask(newTask);
        input.value = '';
    }
};

input.addEventListener('keydown', handleSaveTask);

//delete task from database and from 'view'
const handleRemoveTask = async (btn, taskId) => {
    await fetch(`${URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    })
        .then(() => {
            todoList = todoList.filter(({id}) => taskId !== id);
            if (btn) {
                btn.parentElement.remove();
                checkFooter();
            }
        });
};

//When we click on a button, we delete necessary task
function deleteItemFromServer(btn, {id: taskId}) {
    // btn.addEventListener('click', handleRemoveTask.bind(this, btn, taskId))
    btn.addEventListener('click', () => handleRemoveTask(btn, taskId));
}

const toggleCheckbox = (flag, id) => {
    return  fetch(`${URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            checked: flag
        })
    });
};

//Do a compliance check of item
function checkedItem(checkbox, task) {
    const nextElem = checkbox.nextElementSibling;

    checkbox.addEventListener('change', () => {
        const isNeedToCheck = todoList.findIndex(item => item.id === task.id);
        const isChecked = todoList[isNeedToCheck].checked;

        todoList[isNeedToCheck].checked = !isChecked;
        if (!isChecked) {
            toggleCheckbox(true, task.id)
                .then(() => {
                    checkbox.setAttribute('checked', true);
                    nextElem.classList.add('done');
                });
        } else {
            toggleCheckbox(false, task.id)
                .then(() => {
                    checkbox.removeAttribute('checked');
                    nextElem.classList.remove('done');
                });
        }
    });
}

//clear content in HTML-element (delete 'childs')
const clearTaskListView = (elem = ulItems) => elem.innerHTML = '';

//make view of all our tasks, which we have in database
const handleShowAllTasks = () => {
    clearTaskListView();
    renderTodoList();
};

//make view of unresolved tasks
const handleShowActiveTasks = () => {
    clearTaskListView();
    todoList.filter(elem => !elem.checked).forEach(renderItem);
};

//make view of resolved tasks
const handleShowOnlyCompleted = () => {
    clearTaskListView();
    todoList.filter(elem => elem.checked).forEach(renderItem);
};

//delete all completed tasks from view and from database
const handleClearCompleted = async () => {
    clearTaskListView();

    const newListForDelete = todoList.filter(({checked}) => checked);

    await Promise.all(newListForDelete.map(({id}) => {
        return handleRemoveTask(null, id);
    }));

    renderTodoList();
};

btnShowAll.addEventListener('click', handleShowAllTasks);
btnShowActive.addEventListener('click', handleShowActiveTasks);
btnShowCompleted.addEventListener('click', handleShowOnlyCompleted);
clearCompleted.addEventListener('click', handleClearCompleted);

//make view of all our list
const renderTodoList = () => todoList.forEach(renderItem);

//load our list of items from our database
const loadTodoFromServer = () => {
    fetch(URL)
        .then(resp => resp.json())
        .then((result = []) => {
            todoList = result;
            renderTodoList();
            checkFooter();
        })
};

loadTodoFromServer();



