// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
    const vscode = acquireVsCodeApi();
    let todos = [];
    let globalTodos = [];
    let projectName = '';

   

    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const completedList = document.getElementById('completed-todo-list');
    const completedContent = document.querySelector('.completed-todo-list-content');
    const globalTasksPane = document.querySelector('.global-tasks-pane');
    const globalTasksList = document.getElementById('global-tasks-list');
    const globalTodoForm = document.getElementById('global-todo-form');
    const globalTodoInput = document.getElementById('global-todo-input');
    const globalTodoContent = document.querySelector('.global-tasks-content');
    const globalCompletedList = document.getElementById('completed-global-tasks-list');
    const globalCompletedContent = document.querySelector('.completed-global-tasks-content');

    console.log('Hello from main.js');

    todoForm.addEventListener('submit', function(e){
        e.preventDefault();
       addTodo();

    });

    globalTodoForm.addEventListener('submit', function(e){
        e.preventDefault();
       addGlobalTodo();

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

    function addGlobalTodo(){
        if(!globalTodoInput.value){
            vscode.postMessage({
                type:"onError",
                value: 'Please enter a global todo item.'
            });
            return;
        }
        globalTodos.push({
            id: todos.length + 1,
            text: globalTodoInput.value,
            completed: false
        });
        globalTodoInput.value = '';
        
        renderGlobalTodos();


    }

    function saveTodos(){
        vscode.postMessage({
            type: 'save-todos',
            value: todos,
            name: projectName
        });
    }

    function saveGlobalTodos(){
        vscode.postMessage({
            type: 'save-global-todos',
            value: globalTodos,

        });
    }

    function renderTodos(){
        todoList.innerHTML = '';
        todos.forEach(function(todo){
            //Update the todo id
            todo.id = todos.indexOf(todo) + 1;
            todos[todos.findIndex(x => x.id === todo.id)] = todo;
            if(todo.completed){
                return;
            }
            const todoItem = document.createElement('div');
            todoItem.id = `todo-${todo.id}`;
            todoItem.style.cursor = 'pointer';  
            todoItem.style.padding = '5px';
            todoItem.style.fontSize = '14px';
            //Make grey border

            todoItem.style.margin = '5px';

            //Make display flex
            todoItem.style.display = 'flex';
            todoItem.style.justifyContent = 'space-between';
            const todoTextDiv = document.createElement('div');
            todoTextDiv.style.width = '85%';
            todoTextDiv.style.textWrap = 'wrap';



            const todoText = document.createElement('p');
            todoText.innerHTML = todo.text;
            todoText.style.overflowWrap = 'break-word';
            todoTextDiv.appendChild(todoText);

            todoItem.appendChild(todoTextDiv);
            const deleteButton = document.createElement('i');
            deleteButton.className = 'codicon codicon-trash';
            deleteButton.style.width = '14px';
            deleteButton.style.height = '14px';
            deleteButton.style.float = 'right';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.margin = '5px';
            deleteButton.addEventListener('click', function(){
                todos = todos.filter(function(item){
                    return item.id !== todo.id;
                });
                renderTodos();
                saveTodos();
            });
            todoItem.appendChild(deleteButton);
            
            

            if(todo.completed){
                todoItem.style.textDecoration = 'line-through';
                todoItem.style.color = 'grey';
                

            }
           
            todoItem.addEventListener('click', function(){
                todo.completed = !todo.completed;
                todoItem.style.textDecoration = 'line-through';
                todoItem.style.color = 'grey';

                //Animate the todo item falling off the list
                todoItem.animate([
                    { transform: 'translateX(0px)', opacity: 1 },
                    { transform: 'translateX(100px)', opacity: 0 }
                ], {
                    duration: 500,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
                setTimeout(function(){
                    
                    renderTodos();
                }, 500);
                renderCompletedTodos();

            });
            todoList.appendChild(todoItem);
        });
        //Save the todos
        saveTodos();
    }

    function renderGlobalTodos(){
        globalTasksList.innerHTML = '';
        globalTodos.forEach(function(todo){
            //Update the todo id
            todo.id = globalTodos.indexOf(todo) + 1;
            globalTodos[globalTodos.findIndex(x => x.id === todo.id)] = todo;
            if(todo.completed){
                return;
            }
            const todoItem = document.createElement('div');
            todoItem.id = `todo-${todo.id}`;
            todoItem.style.cursor = 'pointer';  
            todoItem.style.padding = '5px';
            todoItem.style.fontSize = '14px';
            //Make grey border

            todoItem.style.margin = '5px';

            //Make display flex
            todoItem.style.display = 'flex';
            todoItem.style.justifyContent = 'space-between';
            const todoTextDiv = document.createElement('div');
            todoTextDiv.style.width = '85%';
            todoTextDiv.style.textWrap = 'wrap';



            const todoText = document.createElement('p');
            todoText.innerHTML = todo.text;
            todoText.style.overflowWrap = 'break-word';
            todoTextDiv.appendChild(todoText);

            todoItem.appendChild(todoTextDiv);
            const deleteButton = document.createElement('i');
            deleteButton.className = 'codicon codicon-trash';
            deleteButton.style.width = '14px';
            deleteButton.style.height = '14px';
            deleteButton.style.float = 'right';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.margin = '5px';
            deleteButton.addEventListener('click', function(){
                globalTodos = globalTodos.filter(function(item){
                    return item.id !== todo.id;
                });
                renderGlobalTodos();

            });
            todoItem.appendChild(deleteButton);
            
            

            if(todo.completed){
                todoItem.style.textDecoration = 'line-through';
                todoItem.style.color = 'grey';
                

            }
           
            todoItem.addEventListener('click', function(){
                todo.completed = !todo.completed;
                todoItem.style.textDecoration = 'line-through';
                todoItem.style.color = 'grey';

                //Animate the todo item falling off the list
                todoItem.animate([
                    { transform: 'translateX(0px)', opacity: 1 },
                    { transform: 'translateX(100px)', opacity: 0 }
                ], {
                    duration: 500,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
                setTimeout(function(){
                    
                    renderGlobalTodos();
                }, 500);
                renderGlobalCompletedTodos()

            });
            globalTasksList.appendChild(todoItem);
        });
        if (globalTodoContent.style.maxHeight){
         globalTodoContent.style.maxHeight = globalTodoContent.scrollHeight + "px";
        }
        //Save the todos
        saveGlobalTodos();
    }

    function renderCompletedTodos(){
        completedList.innerHTML = '';
        const completedTodos = todos.filter(function(todo){
            return todo.completed;
        });
        console.log(completedTodos);
        completedTodos.forEach(function(todo){
            //Update the todo id
            completedTodos.id = completedTodos.indexOf(todo) + 1;
            completedTodos[completedTodos.findIndex(x => x.id === todo.id)] = todo;
            const todoItem = document.createElement('div');
            todoItem.id = `todo-${todo.id}`;
            todoItem.style.cursor = 'pointer';  
            todoItem.style.padding = '5px';
            todoItem.style.fontSize = '14px';
            //Make grey border

            todoItem.style.margin = '5px';

            //Make display flex
            todoItem.style.display = 'flex';
            todoItem.style.justifyContent = 'space-between';
            const todoTextDiv = document.createElement('div');
            todoTextDiv.style.width = '85%';
            todoTextDiv.style.textWrap = 'wrap';



            const todoText = document.createElement('p');
            todoText.innerHTML = todo.text;
            todoText.style.overflowWrap = 'break-word';
            todoTextDiv.appendChild(todoText);

            todoItem.appendChild(todoTextDiv);
            const deleteButton = document.createElement('i');
            deleteButton.className = 'codicon codicon-trash';
            deleteButton.style.width = '14px';
            deleteButton.style.height = '14px';
            deleteButton.style.float = 'right';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.margin = '5px';
            deleteButton.addEventListener('click', function(){
                todos = todos.filter(function(item){
                    if(item.completed){
                        return item.id !== todo.id;
                    }
                    return item.id !== todo.id;
                });
                renderCompletedTodos();

            });
            todoItem.appendChild(deleteButton);
            
            todoItem.addEventListener('click', function(){
                todo.completed = !todo.completed;

                //Animate the todo item falling off the list
                todoItem.animate([
                    { transform: 'translateX(0px)', opacity: 1 },
                    { transform: 'translateX(100px)', opacity: 0 }
                ], {
                    duration: 500,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
                setTimeout(function(){
                    
                    renderCompletedTodos();
                }, 500);
                renderTodos();
            });
            completedList.appendChild(todoItem);
        });
        if (completedContent.style.maxHeight){
            completedContent.style.maxHeight = completedContent.scrollHeight + "px";
           }
        //Save the todos
        saveTodos();
    }

    function renderGlobalCompletedTodos(){
        globalCompletedList.innerHTML = '';
        const completedTodos = globalTodos.filter(function(todo){
            return todo.completed;
        });
        console.log(completedTodos);
        completedTodos.forEach(function(todo){
            //Update the todo id
            completedTodos.id = completedTodos.indexOf(todo) + 1;
            completedTodos[completedTodos.findIndex(x => x.id === todo.id)] = todo;
            const todoItem = document.createElement('div');
            todoItem.id = `todo-${todo.id}`;
            todoItem.style.cursor = 'pointer';  
            todoItem.style.padding = '5px';
            todoItem.style.fontSize = '14px';
            //Make grey border

            todoItem.style.margin = '5px';

            //Make display flex
            todoItem.style.display = 'flex';
            todoItem.style.justifyContent = 'space-between';
            const todoTextDiv = document.createElement('div');
            todoTextDiv.style.width = '85%';
            todoTextDiv.style.textWrap = 'wrap';



            const todoText = document.createElement('p');
            todoText.innerHTML = todo.text;
            todoText.style.overflowWrap = 'break-word';
            todoTextDiv.appendChild(todoText);

            todoItem.appendChild(todoTextDiv);
            const deleteButton = document.createElement('i');
            deleteButton.className = 'codicon codicon-trash';
            deleteButton.style.width = '14px';
            deleteButton.style.height = '14px';
            deleteButton.style.float = 'right';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.margin = '5px';
            deleteButton.addEventListener('click', function(){
                globalTodos = globalTodos.filter(function(item){
                    if(item.completed){
                        return item.id !== todo.id;
                    }
                    return item.id !== todo.id;
                });
                renderGlobalCompletedTodos();

            });
            todoItem.appendChild(deleteButton);
            
            todoItem.addEventListener('click', function(){
                todo.completed = !todo.completed;

                //Animate the todo item falling off the list
                todoItem.animate([
                    { transform: 'translateX(0px)', opacity: 1 },
                    { transform: 'translateX(100px)', opacity: 0 }
                ], {
                    duration: 500,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                });
                setTimeout(function(){
                    
                    renderGlobalCompletedTodos();
                }, 500);
                renderGlobalTodos();
            });
            globalCompletedList.appendChild(todoItem);
        });
        if (globalCompletedContent.style.maxHeight){
            globalCompletedContent.style.maxHeight = globalCompletedContent.scrollHeight + "px";
           }
        //Save the todos
        saveGlobalTodos();
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
            case 'new-global-todo':
                    globalTodos.push({
                        id: globalTodos.length + 1,
                        text: message.value,
                        completed: false
                    });
                    renderGlobalTodos();
                    break;
            case 'project':
                console.log(message.value);
                projectName = message.name;
                todos = message.value;
                globalTodos = message.globalTodos;
                renderTodos();
                renderGlobalTodos();
                renderGlobalCompletedTodos();
                renderCompletedTodos();
                break;
            case 'view-global-todos':
                globalTasksPane.classList.toggle("active");
                const indicator = globalTasksPane.querySelector('.indicator');

                if(indicator.classList.contains('codicon-chevron-down')){
                    indicator.classList.remove('codicon-chevron-down');
                    indicator.classList.add('codicon-chevron-right');
                    
                } else {
                    indicator.classList.remove('codicon-chevron-right');
                    indicator.classList.add('codicon-chevron-down');

                }
                const content = globalTasksPane.nextElementSibling;
                if (content.style.maxHeight){
                content.style.maxHeight = null;
                } else {
                content.style.maxHeight = content.scrollHeight + "px";
                } 


        }
    });


    window.addEventListener('DOMContentLoaded', (event) => {
        

        vscode.postMessage({
            type: 'get-project'
        });
    });

    const panes = document.querySelectorAll(".pane");

    for (let i = 0; i < panes.length; i++) {
        panes[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const indicator = this.querySelector('.indicator');
            console.log(indicator);
            if(indicator.classList.contains('codicon-chevron-down')){
                indicator.classList.remove('codicon-chevron-down');
                indicator.classList.add('codicon-chevron-right');
                
            } else {
                indicator.classList.remove('codicon-chevron-right');
                indicator.classList.add('codicon-chevron-down');

            }
            const content = this.nextElementSibling;
            if (content.style.maxHeight){
            content.style.maxHeight = null;
            } else {
            content.style.maxHeight = content.scrollHeight + "px";
            } 
        });
    }

   
}());