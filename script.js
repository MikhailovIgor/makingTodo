const input = document.getElementById('mainInput');
const ulItems = document.getElementById('ulItems');

function createTodo() {
    const li = document.createElement('li');
    li.classList.add('item');

    const text = document.createElement('span');
    text.classList.add('text');

    //const newTodo = input.value;
    text.append(/*newTodo*/input.value);

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete');
    delBtn.innerText = 'DEL';

    ulItems.appendChild(li).append(checkbox, text, delBtn);
    input.value = '';
    deleteItem(delBtn);
    checkingItem(checkbox);

}

input.addEventListener('keydown', (event) => {
    if(event.code === "Enter" && input.value != '') {
        createTodo();
    }
});

function deleteItem(btn) {
    btn.addEventListener('click', () => {
      btn.parentElement.remove();
        document.getElementById('clear').classList.add('visually-hidden');
    })
}

function checkingItem(checkbox) {
    const nextElem = checkbox.nextElementSibling;
    checkbox.addEventListener('change', () => {
        if(nextElem.classList.contains("lineThrow")) {
            nextElem.classList.remove('lineThrow');
            document.getElementById('clear').classList.add('visually-hidden');
        } else {
            nextElem.classList.add('lineThrow');
            document.getElementById('clear').classList.remove('visually-hidden');
        }
    })
}