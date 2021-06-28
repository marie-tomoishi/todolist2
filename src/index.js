import './css/ress.min.css';
import './styles.scss';

const floatAddBtn = document.getElementsByClassName('c-floatAddBtn')[0];
const addBtn = document.getElementsByClassName('c-addBtn')[0];
const todoList = document.getElementsByClassName('p-todoList')[0];

//ステータスタブ分け＆タスクがないときの処理
const statusFilter = () => {
    const todoItem = document.querySelectorAll('.c-card');
    todoItem.forEach((item) => {
        const itemStatus = item.dataset.status;
        const tabStatus = document.getElementsByClassName('is-active')[0]
            .dataset.status;
        switch (tabStatus) {
            case 'all':
                item.style.display = 'block';
                break;
            case itemStatus:
                item.style.display = 'block';
                break;
            default:
                item.style.display = 'none';
        }
    });

    const count = [...todoItem].filter((x) => {
        return x.style.display === 'block';
    }).length;
    const editBtn = document.getElementsByClassName('c-edit')[0];
    const message = document.getElementsByClassName('p-notask')[0];
    if (count === 0) {
        editBtn.style.display = 'none';
        addBtn.style.display = 'none';
        message.style.display = 'block';
    } else {
        editBtn.style.display = 'block';
        addBtn.style.display = 'block';
        message.style.display = 'none';
    }
};

statusFilter();

//タブ切り替え
const tabItem = document.querySelectorAll('.c-tab__item');
tabItem.forEach((item) => {
    item.addEventListener('click', (e) => {
        const target = e.target;
        document
            .getElementsByClassName('is-active')[0]
            .classList.remove('is-active');
        target.classList.add('is-active');
        statusFilter();
    });
});

//入力フィールド出現
const addInputField = () => {
    const activeTab = document.getElementsByClassName('is-active')[0];
    const allTab = document.querySelector('[data-status="all"]');
    if (activeTab.dataset.status === 'done') {
        allTab.click();
    }
    const inputField = `<li class="p-todoList__item c-card -input" data-status="todo">
        <div class="c-card__inner">
            <button class="c-card__check"></button>
            <input type="text" class="c-card__input">
        </div>
        <button class="c-card__edit">
            <i class="icon-edit-2"></i>
        </button>
        <button class="c-card__remove">
            <i class="icon-trash-2"></i>
        </button>
    </li>`;
    todoList.insertAdjacentHTML('beforeend', inputField);
    addBtn.setAttribute('disabled', true);
    floatAddBtn.setAttribute('disabled', true);
    document.getElementsByClassName('c-card__input')[0].focus();
};

//タスク追加
const addTask = (event) => {
    if (event.target.classList[0] === 'c-card__input') {
        const input = event.target;
        const todoValue = input.value;
        const body = `<p class="c-card__body">${todoValue}</p>`;
        const inputField = document.querySelector('.-input');
        if (todoValue === '') {
            todoList.removeChild(inputField);
        }
        input.parentNode.insertAdjacentHTML('beforeend', body);
        if (inputField.classList.contains('-input')) {
            inputField.classList.remove('-input');
        }
        input.parentNode.removeChild(input);
        addBtn.removeAttribute('disabled');
        floatAddBtn.removeAttribute('disabled');
        statusFilter();
    }
};

//ボタンクリックでタスクを追加、フォーカスアウト・エンターで確定
addBtn.addEventListener('click', () => addInputField());
floatAddBtn.addEventListener('click', () => addInputField());
todoList.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && e.target.classList[0] === 'c-card__input') {
        const input = todoList.getElementsByClassName('-input')[0];
        const inputField = input.getElementsByClassName('c-card__input')[0];
        inputField.blur();
    }
});
todoList.addEventListener('focusout', (e) => addTask(e));

//チェック
todoList.addEventListener('click', (e) => {
    if (e.target.classList[0] === 'c-card__check') {
        const target = e.target;
        if (target.classList.contains('-checked')) {
            target.closest('.c-card').dataset.status = 'todo';
            target.classList.remove('-checked');
        } else {
            target.closest('.c-card').dataset.status = 'done';
            target.classList.add('-checked');
        }
        statusFilter();
    }
});

//編集ボタンクリック
const editBtn = document.getElementsByClassName('c-edit')[0];
editBtn.addEventListener('click', (e) => {
    const todoItem = document.querySelectorAll('.c-card');
    todoItem.forEach((item) => {
        if (e.target.classList.contains('is-active')) {
            item.classList.remove('-edit');
            e.target.classList.remove('is-active');
            addBtn.removeAttribute('disabled');
            floatAddBtn.removeAttribute('disabled');
        } else {
            item.classList.add('-edit');
            addBtn.setAttribute('disabled', true);
            floatAddBtn.setAttribute('disabled', true);
            e.target.classList.add('is-active');
        }
    });
});

//削除
// todoList.addEventListener('click', (e) => {
//     if (e.target.classList[0] === 'c-card__remove') {
//         const removeBtn = e.target;
//         const removeItem = removeBtn.parentNode;
//         removeItem.parentNode.removeChild(removeItem);
//         statusFilter();
//     }
// });
