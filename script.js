const library = [];

class Book {
  constructor(title = 'Unknown', author = 'Unknown', pages = 0, read = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read ? 'read' : 'unread';
  }
}

function addBookToLibrary(book) {
  library.push(book);

  const table = document.querySelector('table tbody');
  const bookIndex = library.indexOf(book);

  table.appendChild(createBookInfoRow(book, bookIndex));

  updateDeleteBookBtnEventListeners();
  updateReadBookBtnEventListeners();
}

const endersGame = new Book("Ender's Game", 'Orson Scott Card', 324, true);
const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);
const theBible = new Book('The Bible', 'God', 1042, true);

addBookToLibrary(endersGame);
addBookToLibrary(theHobbit);
addBookToLibrary(theBible);

const dialog = document.querySelector('dialog');
const showButton = document.querySelector('#show-dialog-btn');
const closeButton = document.querySelector('#close-dialog-btn');

showButton.addEventListener('click', () => {
  dialog.showModal();
});

closeButton.addEventListener('click', () => {
  dialog.close();
});

function createCell(content) {
  const cell = document.createElement('td');
  const cellContent = document.createTextNode(content);
  cell.appendChild(cellContent);

  return cell;
}

function createButtonCell(content, btnClass, bookIndex) {
  const cell = document.createElement('td');
  const btn = document.createElement('button');
  let btnContent = document.createTextNode(content);

  if (content === 'delete') {
    let xmlns = 'http://www.w3.org/2000/svg';
    let boxWidth = 24;
    let boxHeight = 24;

    let svgElem = document.createElementNS(xmlns, 'svg');
    svgElem.setAttributeNS(
      null,
      'viewBox',
      '0 0 ' + boxWidth + ' ' + boxHeight
    );
    svgElem.setAttributeNS(null, 'width', boxWidth);
    svgElem.setAttributeNS(null, 'height', boxHeight);
    svgElem.style.display = 'block';

    let path = document.createElementNS(xmlns, 'path');

    path.setAttributeNS(
      null,
      'd',
      'M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z'
    );
    path.setAttributeNS(null, 'fill', '#fff');
    svgElem.appendChild(path);

    btnContent = svgElem;
  }

  btn.classList.add(btnClass);
  btn.dataset.bookIndex = bookIndex;
  btn.appendChild(btnContent);
  cell.appendChild(btn);

  return cell;
}

function createBookInfoRow(book, bookIndex) {
  const row = document.createElement('tr');

  row.dataset.bookIndex = bookIndex;

  row.appendChild(createCell(book.title));
  row.appendChild(createCell(book.author));
  row.appendChild(createCell(book.pages));

  row.appendChild(createButtonCell('delete', 'delete-book', bookIndex));
  row.appendChild(createButtonCell(book.read, 'read-book', bookIndex));

  return row;
}

function applyValidationStyling(field) {
  const errorMessage = field.nextElementSibling;

  if (field.value === '') {
    errorMessage.style.display = 'block';
    field.style.borderColor = 'var(--primary-red)';
  } else {
    errorMessage.style.display = 'none';

    field.style.borderColor =
      field === document.activeElement ? 'var(--border-green)' : 'var(--border-gray)';
  }
}

const titleField = document.getElementById('title');
const authorField = document.getElementById('author');
const pagesField = document.getElementById('pages');

[titleField, authorField, pagesField].forEach((field) => {
  field.addEventListener('input', () => applyValidationStyling(field));

  field.addEventListener('focus', () => {
    if (field.value !== '') applyValidationStyling(field);
  });

  field.addEventListener('blur', () => {
    if (field.value !== '') applyValidationStyling(field);
  });
});

function validateField(field) {
  applyValidationStyling(field);
  return field.value !== ''; // returns false if invalid, otherwise returns true
}

const newBookForm = document.querySelector('form');

newBookForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const titleValid = validateField(titleField);
  const authorValid = validateField(authorField);
  const pagesValid = validateField(pagesField);

  if (titleValid && authorValid && pagesValid) {
    const title = titleField.value;
    const author = authorField.value;
    const pages = pagesField.value;
    const read = document.getElementById('read').checked;

    const newBook = new Book(title, author, pages, read);

    addBookToLibrary(newBook);

    newBookForm.reset(); // clears form
    dialog.close();
  }
});

function updateDeleteBookBtnEventListeners() {
  let deleteBookBtns = document.querySelectorAll('.delete-book');

  deleteBookBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const bookIndex = this.dataset.bookIndex;
      delete library[bookIndex];

      const bookRow = btn.parentElement.parentElement;
      bookRow.remove();
    });
  });
}

function markBookAsRead() {
  this.textContent = this.textContent === 'read' ? 'unread' : 'read';
}

function updateReadBookBtnEventListeners() {
  let readBookBtns = document.querySelectorAll('.read-book');

  readBookBtns.forEach((btn) => {
    btn.removeEventListener('click', markBookAsRead);
    btn.addEventListener('click', markBookAsRead);
  });
}
