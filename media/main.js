// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
    const vscode = acquireVsCodeApi();
    let todos = [];
   

    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    console.log('Hello from main.js');

    todoForm.addEventListener('submit', function(e){
        e.preventDefault();
       addTodo();
    });

    function addTodo(){
        if(!todoInput.value){
            vscode.postMessage({
                type:"onError",
                value: 'Please enter a todo item.'
            });
            return;
        }
        todos.push({
            id: todos.length + 1,
            text: todoInput.value,
            completed: false
        });
        todoInput.value = '';
        
        renderTodos();

    }

    function renderTodos(){
        todoList.innerHTML = '';
        todos.forEach(function(todo){
            const todoItem = document.createElement('li');
            todoItem.id = `todo-${todo.id}`;
            todoItem.style.cursor = 'pointer';
            todoItem.style.padding = '5px';
            todoItem.style.fontSize = '14px';

            if(todo.completed){
                todoItem.style.textDecoration = 'line-through';
                todoItem.style.color = 'grey';
                

            }
            todoItem.innerHTML = `
                ${todo.text}
            `;
            todoItem.addEventListener('click', function(){
                todo.completed = !todo.completed;
                renderTodos();
            });
            todoList.appendChild(todoItem);
        });
    }

    window.addEventListener('message', event => {
        const message = event.data; // The JSON data our extension sent
        switch (message.type) {
            case 'new-todo':
                todos.push({
                    id: todos.length + 1,
                    text: message.value,
                    completed: false
                });
                renderTodos();
                break;

        }
    });


   
}());