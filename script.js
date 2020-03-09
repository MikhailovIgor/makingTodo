const input = document.getElementById('mainInput');
const ulItems = document.getElementById('ulItems');
const footer = document.querySelector('.footer');

let todoList = [];

const checkFooter = () => {
    if(todoList.length > 0) {
        footer.classList.remove('visually-hidden')
    }else {footer.classList.add('visually-hidden')}
};

function renderItem(task, index) {
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
    checkedItem(checkbox, index);
}

function saveTask({value, checked = false}) {
    todoList.push({
        checked: checked,
        value: value
    });
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

function checkedItem(checkbox, index) {
    const nextElem = checkbox.nextElementSibling;

    checkbox.addEventListener('change', () => {
        if(!checkbox.hasAttribute('checked')) {
            todoList[index].checked = true;
            checkbox.setAttribute('checked', true);
            saveDataToLS();
            nextElem.classList.add('lineThrow');
        } else {
            todoList[index].checked = false;
            checkbox.removeAttribute('checked');
            saveDataToLS();
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
    checkFooter();
}


document.addEventListener('DOMContentLoaded', loadTodoFromStorage);
