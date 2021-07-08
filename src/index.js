import './css/ress.min.css';
import './styles.scss';

const floatAddBtn = document.getElementsByClassName('c-floatAddBtn')[0];
const addBtn = document.getElementsByClassName('c-addBtn')[0];
const todoList = document.getElementsByClassName('p-todoList')[0];

//ステータスタブ分け＆タスクがないときの処理
const statusFilter = () => {
    const todoItem = document.querySelectorAll('.c-card');

    //タブで表示ON・OFF
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
    }).length; //表示されているタスクの数を取得
    const editBtn = document.getElementsByClassName('c-edit')[0]; //編集ボタン
    const message = document.getElementsByClassName('p-notask')[0]; //タスクがないときのメッセージ

    if (count === 0) {
        editBtn.style.display = 'none';
        addBtn.style.display = 'none';
        message.style.display = 'block';
    } else {
        editBtn.style.display = 'block';
        addBtn.style.display = 'inline-flex';
        message.style.display = 'none';
    }
};

//ロード時にステータス確認（合ってるのか...？）
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

//入力フィールドを出現させる
const addInputField = () => {
    const activeTab = document.getElementsByClassName('is-active')[0];
    const allTab = document.querySelector('[data-status="all"]');

    //Doneの場合はAllに移動する
    if (activeTab.dataset.status === 'done') {
        allTab.click();
    }
    const inputField = `<li class="p-todoList__item c-card -input" data-status="todo">
        <div class="c-card__inner">
            <button class="c-card__check"></button>
            <input type="text" class="c-card__input">
        </div>
        <button class="c-card__reEdit">
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

//タスクとして確定
const addTask = (e) => {
    if (e.target.classList[0] === 'c-card__input') {
        const input = e.target;
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
        statusFilter(); //ステータス振り分けし直し
        releaseEdit(); //編集状態は解除する
    }
};

//追加ボタンクリックで入力フィールド出現
addBtn.addEventListener('click', () => {
    releaseEdit();
    addInputField();
});
//追加ボタンクリックで入力フィールド出現
floatAddBtn.addEventListener('click', () => {
    releaseEdit();
    addInputField();
});
//入力後エンターでフォーカスアウト
todoList.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && e.target.classList[0] === 'c-card__input') {
        const input = todoList.getElementsByClassName('-input')[0];
        const inputField = input.getElementsByClassName('c-card__input')[0];
        inputField.blur();
    }
});
//フォーカスアウトでタスク確定
todoList.addEventListener('focusout', (e) => addTask(e));

//編集（削除）可能にする
const enableEdit = () => {
    const todoItem = document.querySelectorAll('.c-card');
    todoItem.forEach((item) => {
        item.classList.add('-edit');
    });
    editBtn.classList.add('is-active');
};

//編集解除
const releaseEdit = () => {
    const todoItem = document.querySelectorAll('.c-card');
    todoItem.forEach((item) => {
        item.classList.remove('-edit');
    });
    editBtn.classList.remove('is-active');
};

//編集ボタンクリック時の動き
const editBtn = document.getElementsByClassName('c-edit')[0];
editBtn.addEventListener('click', (e) => {
    if (!editBtn.classList.contains('is-active')) {
        enableEdit();
    } else {
        releaseEdit();
    }
});

// //削除のダイアログ表示・非表示
// const dialog = document.getElementById('js-dialog');
// const dispDialog = (removeItem) => {
//     dialog.classList.add('is-active');
//     dialog.dataset = removeItem;
// };
// const hideDialog = () => {
//     dialog.classList.remove('is-active');
// };

// //削除・キャンセル
// dialog.addEventListener('click', (e) => {
//     const target = e.target.getAttribute('id');
//     switch (target) {
//         case 'yes':
//             hideDialog();
//             removeItem.parentNode.removeChild(removeItem);
//             statusFilter();
//             break;
//         case 'cancel':
//             hideDialog();
//             break;
//         default:
//     }
// });

//チェック・削除・修正各ボタンクリック
todoList.addEventListener('click', (e) => {
    const target = e.target.classList[0];
    switch (target) {
        case 'c-card__check':
            if (e.target.classList.contains('-checked')) {
                e.target.closest('.c-card').dataset.status = 'todo';
                e.target.classList.remove('-checked');
            } else {
                e.target.closest('.c-card').dataset.status = 'done';
                e.target.classList.add('-checked');
            }
            statusFilter();
            break;
        case 'c-card__remove':
            const removeItem = e.target.parentNode;
            // dispDialog(removeItem);
            removeItem.parentNode.removeChild(removeItem);
            statusFilter();
            break;
        case 'c-card__reEdit':
            const task = e.target.parentNode.getElementsByClassName(
                'c-card__body'
            )[0];
            const taskContent = task.textContent;
            const input = `<input type="text" class="c-card__input" value="${taskContent}">`;
            task.parentNode.insertAdjacentHTML('beforeend', input);
            task.parentNode.removeChild(task);
            e.target.closest('.c-card').classList.add('-input');

            const len = taskContent.length;
            document.getElementsByClassName('c-card__input')[0].focus();
            document
                .getElementsByClassName('c-card__input')[0]
                .setSelectionRange(len, len); //カーソルを一番後ろにする
            break;
        default:
    }
});
