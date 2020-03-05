const input = document.getElementById('mainInput');
const ulItems = document.getElementById('ulItems');

const taskList = [];

function createItem(value) {
    const li = document.createElement('li');
    li.classList.add('item');

    const text = document.createElement('span');
    text.classList.add('text');
    text.append(value);

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete');
    delBtn.innerText = 'DEL';

    ulItems.appendChild(li).append(checkbox, text, delBtn);
    deleteItem(delBtn);
    checkedItem(checkbox);
}

input.addEventListener('keydown', (event) => {
    if(event.code === "Enter" && input.value !== '') {
        createItem(input.value);
        localStorage.setItem('todo', ulItems.innerHTML);
        input.value = '';
    }
});

function deleteItem(btn) {
    btn.addEventListener('click', () => {
      btn.parentElement.remove();
        localStorage.setItem('todo', ulItems.innerHTML);
        //document.getElementById('clear').classList.add('visually-hidden');
    })
}

function checkedItem(checkbox) {
    const nextElem = checkbox.nextElementSibling;
    checkbox.addEventListener('change', () => {
        if(nextElem.classList.contains("lineThrow")) {
            nextElem.classList.remove('lineThrow');
            document.getElementById('clear').classList.add('visually-hidden');
        } else {
            nextElem.classList.add('lineThrow');
            document.getElementById('clear').classList.remove('visually-hidden');
        }
    });
}

function loadTodoFromStorage() {
    if(localStorage.getItem('todo')) {
        ulItems.innerHTML = localStorage.getItem('todo');

        const allDeleteBtn = document.querySelectorAll('.delete');
        const allCheckboxes = document.querySelectorAll('[type=checkbox]');

        allDeleteBtn.forEach(deleteItem);
        allCheckboxes.forEach(checkedItem);
    }
}

document.addEventListener('DOMContentLoaded', loadTodoFromStorage);
