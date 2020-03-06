const input = document.getElementById('mainInput');
const ulItems = document.getElementById('ulItems');

let todoList = [];

function renderItem({value, checked = false}, index) {
    const li = document.createElement('li');
    li.classList.add('item');

    const text = document.createElement('label');
    text.classList.add('text');
    text.append(value);

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete');
    delBtn.innerText = 'X';

    ulItems.appendChild(li).append(checkbox, text, delBtn);

    deleteItem(delBtn, index);
    checkedItem(checkbox, index);
}

function saveTask({value, checked = false}) {
    todoList.push({
        checked: checked,
        value: value,
    });

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


function deleteItem(btn, index) {
    btn.addEventListener('click', () => {
        todoList.splice(index, 1);
        saveDataToLS();
        btn.parentElement.remove();
    });
}

function checkedItem(checkbox, index) {
    const nextElem = checkbox.nextElementSibling;

    checkbox.addEventListener('change', () => {
        if(!checkbox.hasAttribute('checked')) {
            todoList[index].checked = true;
            saveDataToLS();
            checkbox.setAttribute('checked', true);
            nextElem.classList.add('lineThrow');
        } else {
            todoList[index].checked = false;
            saveDataToLS();
            checkbox.removeAttribute('checked');
            nextElem.classList.remove('lineThrow');
        }
    })
}

const renderTodoList = () => todoList.forEach(renderItem);

function loadTodoFromStorage() {
    const todoListFromLS = JSON.parse(localStorage.getItem('todo'));
    if (todoListFromLS) {
        todoList = todoListFromLS;
        renderTodoList();
    }
}

document.addEventListener('DOMContentLoaded', loadTodoFromStorage);
