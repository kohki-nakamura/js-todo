const addButton = document.querySelector('#addButton');
addButton.addEventListener('click', () => {
  showAlert('追加ボタンクリック', 'これで確認できました', 'もう閉じて良いですよ');
});

function showAlert(header, subheader, message) {
  const alert = document.createElement('ion-alert');
  alert.header = header;
  alert.subHeader = subheader;
  alert.message = message;
  alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      handler: () => {
        const todo = {};
        todo.title = document.querySelector('#new-todo').value;
        todo.due = new Date(document.querySelector('#new-due').value);
        todo.done = false;
        todo.id = 'todo' + (new Date).getTime().toString();
        todos.push(todo);
        addToDo(todo);
      }
    }
  ];
  alert.inputs = [{
    name: 'todo',
    id: 'new-todo',
    placeholder: 'やらなきゃいけないことは何？'
  },
  {
    name: 'due',
    id: 'new-due',
    type: 'date',
  }
];

  document.body.appendChild(alert);
  return alert.present();
}

const todos = [
  {
    id: 'todo1',
    title: '部屋の掃除',
    due: new Date(2021, 9, 31),
    done: false
  },
  {
    id: 'todo2',
    title: 'ゴミ捨て',
    due: new Date(2021, 9, 31),
    done: false
  },
  {
    id: 'todo3',
    title: '風呂の掃除',
    due: new Date(2021, 9, 31),
    done: false
  },
  {
    id: 'todo4',
    title: '屋根の掃除',
    due: new Date(2021, 9, 31),
    done: false
  },
  {
    id: 'todo5',
    title: '窓の掃除',
    due: new Date(2021, 9, 31),
    done: false
  },
  {
    id: 'todo6',
    title: '犬小屋の掃除',
    due: new Date(2021, 9, 31),
    done: false
  },
  {
    id: 'todo7',
    title: '朝飯を食う',
    due: new Date(2021, 9, 31),
    done: true
  },
  {
    id: 'todo8',
    title: '昼飯を食う',
    due: new Date(2021, 9, 31),
    done: true
  },
  {
    id: 'todo9',
    title: '晩飯を食う',
    due: new Date(2021, 9, 31),
    done: true
  },
];

writeAllToDos(todos);

function writeToDos(todos) {
  const todoList = document.querySelector('#todos');
  const doneList = document.querySelector('#done');
  for (let todo of todos) {
    const todoItem = document.createElement('ion-item')
    todoItem.innerHTML = `
      <ion-label>
        <h2>${todo.title}</h2>
        <h3>${todo.due.toDateString()}</h3>
      </ion-label>
      <ion-checkbox ${( todo.done ? 'checked' : '' )} color="primary" slot="start"></ion-checkbox>
    `
    if (todo.done) {
      // 完了している時は、doneListへ
      doneList.appendChild(todoItem);
    } else {
      // 完了していないものは、todoListへ
      todoList.appendChild(todoItem);
    }
  }
}

function writeAllToDos(todos) {
  for (let todo of todos) {
    addToDo(todo);
  }
}

function addToDo(todo) {
  const todoList = document.querySelector('#todos');
  const doneList = document.querySelector('#done');

  const todoItemWithSliding = document.createElement('ion-item-sliding');
  todoItemWithSliding.id = todo.id;
  todoItemWithSliding.innerHTML = `
  <ion-item-sliding>
    <ion-item onClick="onItemClicked('${todo.id}')">
      <ion-label>
        <h2>${todo.title}</h2>
        <h3>${todo.due.toDateString()}</h3>
      </ion-label>
      <ion-checkbox ${( todo.done ? 'checked' : '' )} color="primary" slot="start"</ion-checkbox>
    </ion-item>
    <ion-item-options side="end">
      <ion-item-option color="danger" expandable onClick="deleteToDo('${todo.id}')">
        削除
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
  `

  if (todo.done) {
    // 完了している時は、doneListへ
    doneList.appendChild(todoItemWithSliding);
  } else {
    // 完了していないものは、todoListへ
    todoList.appendChild(todoItemWithSliding);
  }
}

function deleteToDo(todoId) {
  todos.splice(todos.findIndex(el => el.id === todoId), 1);
  document.querySelector(`#${todoId}`).remove();
}

function onItemClicked(todoId) {
  const todo = todos.find(el => el.id === todoId); // 元のtodoデータを取得
  todo.done = !todo.done; // todo の状態を変更
  document.querySelector(`#${todoId}`).remove(); // 今表示されているところを削除
  addToDo(todo); // addToDoを呼び出し
}