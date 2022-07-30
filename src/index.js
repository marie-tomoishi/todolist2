import './css/ress.min.css';
import './styles.scss';
import { Tween24, Ease24 } from 'tween24';

const addBtn = document.querySelectorAll('.js-add');
const screens = document.getElementById('screens');
const todo = document.getElementById('todo');
const done = document.getElementById('done');
const tabGroup = document.getElementById('tabGroup');
const tabItems = [...tabGroup.children];
const makeRemoveableBtn = document.getElementById('makeRemoveableBtn');

//ステータスタブ分け＆タスクがないときの処理
const countItem = () => {
    const activeTab = document.getElementById('js-active').dataset.status;
    const activeList = document.getElementById(activeTab);
    const count = activeList.childElementCount;
    const message = activeList.parentNode.lastElementChild;
    const removeableBtn = activeList.parentNode.firstElementChild;
    if (count === 0) {
        removeableBtn.style.display = 'none';
        message.style.display = 'block';
    } else {
        removeableBtn.style.display = 'block';
        message.style.display = 'none';
    }
};

//タブ切り替え
tabGroup.addEventListener('click', (e) => {
    const activeType = e.target.dataset.status;
    const activeTab = tabItems.filter((item) => {
        return item.getAttribute('id') === 'js-active';
    });
    const left = '-100%';
    activeTab[0].classList.remove('is-active');
    activeTab[0].removeAttribute('id');
    e.target.setAttribute('id', 'js-active');
    e.target.classList.add('is-active');
    if (activeType === 'todo') {
        screens.style.left = 0;
    } else if (activeType === 'done') {
        screens.style.left = left;
    }
    countItem();
});

//追加ボタンクリックの処理
[...addBtn].forEach((btn) => {
    btn.addEventListener('click', () => {
        // releaseEdit();
        addInputField();
    });
});

//入力フィールドを出現させる
const addInputField = () => {
    const activeTab = tabItems.filter((item) => {
        return item.getAttribute('id') === 'js-active';
    });
    const todoTab = document.querySelector('[data-status="todo"]');
    //Doneのタブがアクティブな場合は、ToDoに変更する
    if (activeTab[0].dataset.status === 'done') {
        todoTab.click();
    }
    const inputField = `<li class="p-todoList__item c-card" id="input">
        <div class="c-card__inner">
            <button class="c-card__check"></button>
            <input type="text" class="c-card__input">
        </div>
    </li>`;
    todo.insertAdjacentHTML('beforeend', inputField); //入力フィールド挿入
    [...addBtn].forEach((btn) => btn.setAttribute('disabled', true)); //追加ボタン無効
    document.getElementsByClassName('c-card__input')[0].focus(); //入力フィールドにフォーカス
    countItem();
};

//入力後エンターでフォーカスアウト・タスク確定
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && e.target.classList.contains('c-card__input')) {
        e.target.blur();
    }
});
//フォーカスアウトでタスク確定
todo.addEventListener('focusout', (e) => addTask(e));

//タスクとして確定
const addTask = (e) => {
    if (e.target.classList.contains('c-card__input')) {
        const input = e.target;
        const todoValue = input.value;

        const li = document.createElement('li');
        li.className = 'p-todoList__item c-card';

        const div = document.createElement('div');
        div.className = 'c-card__inner';

        const p = document.createElement('p');
        p.className = 'c-card__body';
        p.innerHTML = todoValue;

        const checkBtn = document.createElement('button');
        checkBtn.className = 'c-card__check';
        checkBtn.addEventListener('click', () => {
            deleteItem(checkBtn.closest('.c-card'));
            const value = checkBtn.nextElementSibling.textContent;
            p.innerHTML = value;
            if (checkBtn.classList.contains('-checked')) {
                todo.appendChild(li);
                checkBtn.classList.remove('-checked');
            } else {
                done.appendChild(li);
                checkBtn.classList.add('-checked');
            }
        });

        div.appendChild(checkBtn);
        div.appendChild(p);

        const reEditBtn = document.createElement('button');
        reEditBtn.className = 'c-card__reEdit';
        reEditBtn.innerHTML = '<i class="icon-edit-2"></i>';
        reEditBtn.addEventListener('click', () => {
            reEditBtn.parentNode.id = 'input';
            const target = reEditBtn.previousSibling.lastElementChild;
            const text = target.textContent;
            const input = document.createElement('input');
            input.className = 'c-card__input';
            input.value = text;
            deleteItem(target);
            reEditBtn.previousSibling.appendChild(input);
            [...addBtn].forEach((btn) => btn.setAttribute('disabled', true)); //追加ボタン無効
            document.getElementsByClassName('c-card__input')[0].focus(); //入力フィールドにフォーカス
        });

        const removeBtn = document.createElement('button');
        removeBtn.className = 'c-card__remove';
        removeBtn.innerHTML = '<i class="icon-trash-2"></i>';
        removeBtn.addEventListener('click', () => {
            const itemWidth = removeBtn.parentNode.clientWidth;
            Tween24.tween(removeBtn.parentNode, 0.3, Ease24._3_CubicIn)
                .x(itemWidth)
                .scaleY(0.8)
                .play();
            setTimeout(() => {
                deleteItem(removeBtn.parentNode);
                countItem();
            }, 300);
        });

        li.appendChild(div);
        li.appendChild(reEditBtn);
        li.appendChild(removeBtn);

        //入力されている場合はtodoに追加
        if (todoValue !== '') {
            todo.appendChild(li);
        }
        todo.removeChild(input.closest('#input'));
        [...addBtn].forEach((btn) => btn.removeAttribute('disabled')); //追加ボタンの無効解除
    }
    countItem();
};

const deleteItem = (target) => {
    target.parentNode.removeChild(target);
    countItem();
};

// //編集ボタンクリック時の動き
makeRemoveableBtn.addEventListener('click', (e) => {
    const todoItem = document.querySelectorAll('.c-card');
    makeRemoveableBtn.classList.toggle('is-active');
    todoItem.forEach((item) => item.classList.toggle('-edit'));
});
