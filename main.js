const subject = new rxjs.Subject();
const { filter, map, scan, tap, mergeMap } = rxjs.operators;

const WRITE_TODOS = '[ToDo Page] Load ToDos';
const DELETE_TODOS = '[ToDo Page] Delete ToDo';
const TOGGLE_STATUS = '[ToDo Page] Toggle ToDo Status';

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

// 追加用のイベント処理
subject.pipe(
  filter(action => action.type === WRITE_TODOS),
  mergeMap(action => rxjs.from(action.payload)),
  tap(todo => addToDo(todo))
).subscribe()

// 削除用のイベント処理
subject.pipe(
  filter(action => action.type === DELETE_TODOS),
  map(action => action.payload),
  tap(todo => document.querySelector(`#${todo.id}`).remove()),
).subscribe()

// トグル用のイベント処理
subject.pipe(
  filter(action => action.type === TOGGLE_STATUS),
  map(action => action.payload),
  tap(todo => subject.next({
    type: DELETE_TODOS,
    payload: todo,
  })),
  tap(todo => subject.next({
    type: WRITE_TODOS,
    payload: [todo]
  }))
).subscribe()

// ToDo 追加用のアラート表示
const addButton = document.querySelector('#addButton');
rxjs.fromEvent(addButton, 'click')
  .pipe(
    tap(e => showAlert('タスク追加', '', 'やらなきゃいけないことは何？'))
  ).subscribe()

// todo 削除
function onDeleteClicked(todoId) {
  const todo = todos.find(el => el.id === todoId);
  todos.splice(todos.findIndex(el => el.id === todoId), 1);
  const action = {
    type: DELETE_TODOS,
    payload: todo
  };
  subject.next(action);
}

// ToDo の Done 状態をトグルするイベント、リスナは onClick 属性で登録
function onItemClicked(todoId) {
  const todo = todos.find(el => el.id === todoId);
  todo.done = !todo.done;
  const action = {
    type: TOGGLE_STATUS,
    payload: todo
  };
  subject.next(action)
}

const action = {
  type: WRITE_TODOS,
  payload: todos
};

subject.next(action);

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