const mainInput = document.getElementById('mainInput');
const ulItems = document.getElementById('ulItems');

let todoList = [];



//checkbox.setAttribute('type', 'checkbox');

mainInput.addEventListener('keydown', function(enter) {

    if(enter.keyCode === 13) {
        let oneMoreLi = document.createElement("li");

        oneMoreLi.innerHTML = `<div class="item">
                                    <input class="done" type="checkbox">
                                        <label>
                                            ${this.value}
                                        </label>
                                    <button class="delete">DEL</button>
                                </div>`
        ulItems.insertAdjacentElement("afterbegin", oneMoreLi);
        todoList.unshift(oneMoreLi);
        localStorage.setItem('todo', this.value);
        this.value = '';
    }
});
