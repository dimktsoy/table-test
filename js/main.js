const IS_ACTIVE = 'isActive';
const DATA_IS_ACTIVE = 'data-is-active';
const url = './data.json';
const container = document.getElementById('users');

fetch('./data.json')
  .then((response) => response.json())
  .then((data) => {
    const dataResult = data.reduce((acc, { parentId, ...props }) => {
      const found = acc.find((user) => user.parentId === parentId);
      if (!found) {
        acc.push({ parentId, users: [props] });
      } else {
        found.users.push(props);
      }
      return acc;
    }, []);
    addTable(container, createTable(dataResult));
  })
  .catch((error) => console.log(error));

// Обработчик для кнопки, показать / скрыть строку
function handleButtonToggle(event) {
  const button = event.currentTarget;

  button.classList.toggle('open');

  if (button.classList.contains('open')) {
    button.textContent = '-';
  } else {
    button.textContent = '+';
  }

  button.closest('tbody').classList.toggle('expanded');
}

// Обработчик для чекбокса, фильтрация по свойству isActive
function handleCheckboxFilter(event) {
  const table = document.querySelector('.table');

  const isActiveFalseItems = table.querySelectorAll(
    `[${DATA_IS_ACTIVE}="false"]`
  );

  isActiveFalseItems.forEach((item) => {
    item.classList.toggle('hidden');
  });

  for (const tbody of table.tBodies) {
    if (!tbody.querySelectorAll(`[${DATA_IS_ACTIVE}="true"]`).length) {
      tbody.classList.toggle('hidden');
    }
  }
}

// Создание кнопки и добавление обработчика
function createButton() {
  const button = document.createElement('button');

  button.className = 'button';
  button.type = 'button';
  button.textContent = '+';
  button.addEventListener('click', handleButtonToggle);

  return button;
}

// Создание чекбокса и добавление обработчика
function createCheckbox() {
  const input = document.createElement('input');

  input.type = 'checkbox';
  input.addEventListener('change', handleCheckboxFilter);

  return input;
}

// Создание thead
function createThead(user) {
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  for (const key of Object.keys(user)) {
    const th = document.createElement('th');

    th.textContent = user[key];

    if (user[key] === IS_ACTIVE) {
      th.append(createCheckbox());
    }

    tr.append(th);
  }

  const thFirst = document.createElement('th');
  thFirst.textContent = 'parentId';
  tr.prepend(thFirst);
  thead.append(tr);

  return thead;
}

// Создание tbody
function createTbody(data) {
  const tbody = document.createElement('tbody');

  for (const user of data.users) {
    const tr = document.createElement('tr');

    for (const key of Object.keys(user)) {
      const td = document.createElement('td');
      td.textContent = user[key];
      tr.append(td);

      if (key === IS_ACTIVE) {
        tr.setAttribute(DATA_IS_ACTIVE, user[key]);
      }
    }

    const tdParentId = document.createElement('td');
    tdParentId.textContent = data.parentId;
    tr.prepend(tdParentId);
    tbody.append(tr);
  }

  if (data.users.length > 1) {
    const tr = document.createElement('tr');
    const tdParentId = document.createElement('td');
    const countUserProps = Object.keys(data.users[0]).length + 1;

    tdParentId.colSpan = countUserProps;
    tdParentId.innerHTML = `<span class="text-parent">${data.parentId}</span>`;
    tdParentId.append(createButton());
    tr.append(tdParentId);
    tbody.prepend(tr);
  }

  return tbody;
}

// Создание таблицы
function createTable(data) {
  if (!data.length) {
    return;
  }

  const user = Object.keys(data[0].users[0]);
  const table = document.createElement('table');

  table.className = 'table';

  table.append(createThead(user));

  data.forEach((item) => {
    table.append(createTbody(item));
  });

  return table;
}

function addTable(container, table) {
  return container.append(table);
}
