let addMessage = document.querySelector('.input'),
    addButton = document.querySelector('.add'),
    todo = document.querySelector('.todo-list'),
    del = document.querySelector('.del');

let todoList = [];

const display = () => {
    let displayMessage = '';
    todoList.forEach((item, i) => {
        displayMessage += `
            <li class="todo-elem" key='${i}'>
                <div class="todo-elem__items">
                    <input type='checkbox' id='item_${i}' ${item.isDone ? 'checked' : ''}>
                    <label for='item_${i}' class='todo-text${item.done ? '_done' : ''}'>${item.todo}</label>
                </div>
                <button class='button del' onclick='deleteElem(this);'>Delete</button>
            </li>
        `;
    });
    todo.innerHTML = displayMessage;

};

if (localStorage.getItem('todo')) {
    todoList = JSON.parse(localStorage.getItem('todo'));
    display();
}


addButton.addEventListener('click', () => {
    if (addMessage.value.trim() === '') {
        alert('Your ToDo text must not be empty!')
        return
    }

    let newTodo = {
        todo: addMessage.value,
        isDone: false,
        id: 'item_' + todoList.length,
    };

    todoList.push(newTodo);
    display();
    localStorage.setItem('todo', JSON.stringify(todoList));

    addMessage.value = '';
});

const deleteElem = (target) => {
    const index = target.parentNode.getAttribute('key');
    todoList.splice(index, 1);
    localStorage.setItem('todo', JSON.stringify(todoList));
    display();
};

todo.addEventListener('change', (event) => {
    let id = event.target.getAttribute('id');
    todoList.forEach((item) => {
        if (item.id === id) {
            item.isDone = !item.isDone;
            item.done = !item.done;
            display();
            localStorage.setItem('todo', JSON.stringify(todoList));
        };
    })
});