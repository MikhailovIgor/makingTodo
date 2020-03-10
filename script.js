const input = document.getElementById('mainInput');
const ulItems = document.getElementById('ulItems');
const footer = document.querySelector('.footer');
const btnShowActive = document.querySelector('.showActive');
const btnShowAll = document.querySelector('.showAll');
const btnShowCompleted = document.querySelector('.showCompleted');

let todoList = [];

const checkFooter = () => {
    if(todoList.length > 0) {
        footer.classList.remove('visually-hidden')
    } else {footer.classList.add('visually-hidden')}
};

function renderItem(task) {
    const {value, checked = false} = task;      //деструктуризация
    const li = document.createElement('li');
    li.classList.add('item');

    const text = document.createElement('label');
    text.classList.add('text');
    text.append(value);

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    if(checked) {
        checkbox.setAttribute('checked', '');
        text.classList.add('lineThrow');
    }

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete');

    delBtn.innerText = 'X';

    ulItems.appendChild(li).append(checkbox, text, delBtn);

    deleteItem(delBtn, task);
    checkedItem(checkbox, task);
}

function saveTask(task) {
    todoList.push(task);
    checkFooter();
    saveDataToLS();
}

const saveDataToLS = () => localStorage.setItem('todo', JSON.stringify(todoList));

const handleSaveTask = event => {
    if (event.code === "Enter" && input.value !== '') {
        const newTask = {value: input.value, checked: false};
        renderItem(newTask, todoList.length);
        saveTask(newTask);

        input.value = '';
    }
};

input.addEventListener('keydown', handleSaveTask);

function deleteItem(btn, task) {
    btn.addEventListener('click', () => {
        const removableItemIndex =  todoList.indexOf(task);
        todoList.splice(removableItemIndex, 1);
        saveDataToLS();
        btn.parentElement.remove();
        checkFooter();
    });
}

function checkedItem(checkbox, task) {
    const nextElem = checkbox.nextElementSibling;

    checkbox.addEventListener('change', () => {
        const removableItemIndex = todoList.indexOf(task);

        const isChecked = todoList[removableItemIndex].checked ;
        todoList[removableItemIndex].checked = !isChecked;
        if(!isChecked) {
            checkbox.setAttribute('checked', true);
            nextElem.classList.add('lineThrow');
        } else {
            checkbox.removeAttribute('checked');
            nextElem.classList.remove('lineThrow');
        }
        saveDataToLS();
    })
}

const renderTodoList = () => todoList.forEach(renderItem);

function loadTodoFromStorage() {
    const todoListFromLS = JSON.parse(localStorage.getItem('todo'));
    if (todoListFromLS) {
        todoList = todoListFromLS;
        renderTodoList();
    }
    checkFooter();
}

const clearTaskListView = () => ulItems.innerHTML = '';

const handleShowAllTasks = () => {
    clearTaskListView();
    renderTodoList();
};

const handleShowActiveTasks = () => {
    clearTaskListView();
    todoList.filter(elem => !elem.checked).forEach(renderItem);
};

const handleShowOnlyCompleted = () => {
    clearTaskListView();
    todoList.filter(elem => elem.checked).forEach(renderItem);
};

const  handleClearCompleted = () => {
    clearTaskListView();

    todoList = todoList.filter(item => !item.checked);

    saveDataToLS();
    renderTodoList();
};

btnShowAll.addEventListener('click', handleShowAllTasks);
btnShowActive.addEventListener('click', handleShowActiveTasks);
btnShowCompleted.addEventListener('click', handleShowOnlyCompleted);

document.addEventListener('DOMContentLoaded', loadTodoFromStorage);
