// import { v4 as uuidv4 } from 'uuid';

const input = document.querySelector('.mainInput');
const ulItems = document.getElementById('ulItems');
const footer = document.querySelector('.footer');
const btnShowActive = document.querySelector('.showActive');
const btnShowAll = document.querySelector('.showAll');
const btnShowCompleted = document.querySelector('.showCompleted');
const clearCompleted = document.getElementById('clear');
const URL = 'http://localhost:3000/myTodoList';

let todoList = [];

const checkFooter = () => {
    if(todoList.length) {
        footer.classList.remove('visually-hidden');
    } else {
        footer.classList.add('visually-hidden');
    }
};

function renderItem(task) {
    const {value, checked = false} = task;      //деструктуризация
    const li = document.createElement('li');
    li.classList.add('item');

    const text = document.createElement('label');
    text.classList.add('text');
    text.classList.add('notDone');
    text.append(value);

    const checkbox = document.createElement('input');
    checkbox.classList.add('checkInput');
    checkbox.setAttribute('type', 'checkbox');
    if(checked) {
        checkbox.setAttribute('checked', '');
        text.classList.add('done');
    }

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete');

    ulItems.appendChild(li).append(checkbox, text, delBtn);

    deleteItem(delBtn, task);
    checkedItem(checkbox, task);
    deleteItemFromServer(delBtn, task);
}

function saveTask(task) {
    todoList.push(task);

    saveDataToJSONServer(task);//saveDataToLS() was here previosly
    checkFooter();
}

const saveDataToLS = () => localStorage.setItem('todo', JSON.stringify(todoList));

const saveDataToJSONServer = (task) => {

    fetch(URL,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(task)
    })
    .then( (resp)=> {
        console.log(resp);
        resp.json().then(newTask => renderItem(newTask))
    });
};

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

function deleteItem(btn, task) {
    btn.addEventListener('click', () => {
        const removableItemIndex =  todoList.indexOf(task);
        todoList.splice(removableItemIndex, 1);
                                // здесь надо удалить объект с сервера (найду по id)
                                //и ...
        saveDataToLS();
        btn.parentElement.remove();
        checkFooter();
    });
}

function deleteItemFromServer(btn, task) {
    btn.addEventListener('click', () => {
        const removableItemId = task.id;
        console.log(removableItemId);   //отрабатывает (выводит id ТОГО таска, по которому кликнули)

        fetch(URL)
            .then(resp => resp.json()
                .then(arr => arr.find(isNeedId => {
                    if(isNeedId.id === removableItemId) {
                        console.log(task);//отрабатывает
                        debugger
                        arr.splice(task, 1);
                        debugger
                        console.log(arr);//выводит обновленный массив(объект, по которому кликнули - удален)
                    }
                }
                ))
                .then(arr))

    })
}

function checkedItem(checkbox, task) {
    const nextElem = checkbox.nextElementSibling;

    checkbox.addEventListener('change', () => {
        const removableItemIndex = todoList.indexOf(task);
        const isChecked = todoList[removableItemIndex].checked ;

        todoList[removableItemIndex].checked = !isChecked;
        if(!isChecked) {
            checkbox.setAttribute('checked', true);
            nextElem.classList.add('done');
        } else {
            checkbox.removeAttribute('checked');
           nextElem.classList.remove('done');
        }

        saveDataToLS();
    });
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
clearCompleted.addEventListener('click', handleClearCompleted);

const renderTodoList = () => todoList.forEach(renderItem);

const loadTodoFromServer = () => {
    fetch(URL)
        .then(resp => resp.json()
            .then(result => {
                if(result.length) {
                    todoList = result;
                    renderTodoList();
                    checkFooter();
                }

            } ))
};

loadTodoFromServer();           // loadTodoFromStorage() was here firstly




// const loadTodoFromStorage = () => {
//     const todoListFromLS = JSON.parse(localStorage.getItem('todo'));
//     if (todoListFromLS) {aen
//         todoList = todoListFromLS;
//         renderTodoList();
//     }
//     checkFooter();
// };
//


