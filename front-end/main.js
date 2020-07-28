const readline = require('readline');
const fs = require('fs');


let todos = [];
const interface = readline.createInterface({ input: process.stdin, output: process.stdout })
const menu = `
Your options are:

1. Add a todo.
2. Remove a todo.
3. Mark a todo completed.
4. Mark a todo uncompleted.
5. Set priority.
6. Delete all completed todos.
7. Quit.

`

const loadTodos = function () {
  const file = fs.readFileSync(__dirname + '/../back-end/todos.json', 'utf8')
  let data = JSON.parse(file)
  todos = data.todos
}



const saveTodos = function () {
  let obj = {
    todos: todos,
  }
  let newContents = JSON.stringify(obj, null, 2)
  fs.writeFileSync(__dirname + '/../back-end/todos.json', newContents);
}


const displayTodos = function (shouldPrintNumber) {
  console.log('\nHere are your current todos:\n')
  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];
    const num = i + 1;
    let listSymbol = '*';
    let mark = '✖';
    if (shouldPrintNumber) {
      listSymbol = num + '.';
    }

    if (todo.isComplete === true) {
      mark = '✅';
    }

    const todoLine = `${listSymbol} ${todo.text} - priority: ${todo.priority} - ${mark}`
    console.log(todoLine);
  }
}

const add = function (text) {
  const todo = {
    text: text,
    isComplete: false,
    priority: 1,
  }
  todos.push(todo);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const remove = function (num) {
  num = Number(num)
  todos.splice(num - 1, 1);
  saveTodos();
  displayTodos(false);
  interface.close();
}

const complete = function (num) {
  num = Number(num)
  todos[num - 1].isComplete = true
  saveTodos();
  displayTodos(false);
  interface.close();
}

const uncomplete = function (num) {
  num = Number(num)
  todos[num - 1].isComplete = false
  saveTodos();
  displayTodos(false);
  interface.close();
}

// Stretch goals:
// toggle priority
const priority = function (num) {
  num = Number(num)
  if (todos[num - 1].priority === 1) {
    todos[num - 1].priority = 2
  } else if (todos[num - 1].priority === 2) {
    todos[num - 1].priority = 1
  }
  saveTodos();
  displayTodos(false);
  interface.close();
}

// delete completed todos
const deleteComplete = function(answer) {
  let newTodos = []
  if ('yes'.includes(answer.toLowerCase())) {
    for (let i =0; i<todos.length; i++) {
      if (todos[i].isComplete !== true) {
        newTodos.push(todos[i])
      }
    }
  }

  todos = newTodos 
  saveTodos();
  displayTodos(false);
  interface.close();
}

const handleMenu = function (cmd) {
  if (cmd === '1') {
    // Add a todo.
    interface.question('\nWhat should go on your list? ', add)
  } else if (cmd === '2') {
    // Remove a todo.
    displayTodos(true);
    interface.question('\nPlease pick a todo to remove: ', remove)
  } else if (cmd === '3') {
    // Mark a todo complete.
    displayTodos(true);
    interface.question('\nPlease pick a todo to mark complete: ', complete)
  } else if (cmd === '4') {
    // Mark a todo complete.
    displayTodos(true);
    interface.question('\nPlease pick a todo to mark uncomplete: ', uncomplete)
  } else if (cmd === '5') {
    displayTodos(true);
    interface.question('\nSelect a todo to toggle priority between 1 and 2: ', priority)
  } else if (cmd === '6') {
    displayTodos(true);
    interface.question('\nDELETE all completed todos Y or N: ', deleteComplete)
  } else {
    console.log('Quitting!');
    interface.close();
  }
}


loadTodos();
displayTodos(false);
interface.question(menu, handleMenu);
