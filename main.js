    const input = document.getElementById('mainInput');
    const ulItems = document.getElementById('ulItems');

    let todoList = [];

    function createItem(value, isChecked = false) {
        const li = document.createElement("li");
        li.classList.add('item');
        const delButton = document.querySelector('.delete');

        li.innerHTML = `<input class="done" ${isChecked ? 'checked' : ''} type="checkbox">
                            <label>
                                ${value}
                            </label>
                                 <button class="delete">X</button>`;

        ulItems.appendChild(li);

        todoList.push({
                isChecked: isChecked,
                value: value,
            }
        );

        input.value = '';

        deleteItem(delButton);

    };

    input.addEventListener('keydown', (event) => {
        if (event.code === "Enter" && input.value !== '') {
            createItem(input.value);
            localStorage.setItem('todo', JSON.stringify(todoList));
        }
    });

    function deleteItem(btn) {

        btn.addEventListener('click', () => {
            btn.parentElement.remove();
        })
    }









