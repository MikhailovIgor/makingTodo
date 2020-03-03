const input = document.getElementById('mainInput');
const ulItems = document.getElementById('ulItems');

function createTodo() {
    const li = document.createElement('li');
    li.classList.add('item');

    const text = document.createElement('span');
    text.classList.add('text');

    const newTodo = input.value;
    text.append(newTodo);

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete');
    delBtn.innerText = 'DEL';

    ulItems.appendChild(li).append(checkbox, text, delBtn)
    input.value = '';

}

input.addEventListener('keydown', (event) => {
    if(event.code === "Enter" && input.value != '') {
        createTodo();
    }
});


