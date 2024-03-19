const library = [];

class Book {
  constructor(title, author, pages, read = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read ? 'read' : 'unread';
  }

  toggleRead() {
    this.read = this.read === 'unread' ? 'read' : 'unread';
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
const showButton = document.getElementById('show-dialog-btn');
const closeButton = document.getElementById('close-dialog-btn');
const newBookForm = document.querySelector('form');

showButton.addEventListener('click', () => {
  dialog.showModal();
});

closeButton.addEventListener('click', () => {
  dialog.close();
  newBookForm.reset();
});

function createCell(content) {
  const cell = document.createElement('td');
  const cellContent = document.createTextNode(content);
  cell.appendChild(cellContent);

  return cell;
}

function setIcon(content) {
  const icon = document.createElement('span');
  icon.classList.add('material-symbols-outlined');

  switch (content) {
    case 'delete':
      icon.textContent = 'delete';
      break;
    case 'read':
      icon.textContent = 'check_circle';
      break;
    case 'unread':
      icon.textContent = 'circle';
      break;
  }

  return icon;
}

function createButtonCell(content, btnClass, bookIndex) {
  const cell = document.createElement('td');
  const btn = document.createElement('button');

  let btnContent = setIcon(content);

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

    const isActive = field === document.activeElement;
    field.style.borderColor = `var(--border-${isActive ? 'green' : 'gray'})`;
  }
}

const titleField = document.getElementById('title');
const authorField = document.getElementById('author');
const pagesField = document.getElementById('pages');

[titleField, authorField, pagesField].forEach((field) => {
  field.addEventListener('input', () => applyValidationStyling(field));

  field.addEventListener('focus', () => {
    if (field.value !== '') applyValidationStyling(field); // wait to apply styling until user has interacted with the field
  });

  field.addEventListener('blur', () => {
    if (field.value !== '') applyValidationStyling(field); // wait to apply styling until user has interacted with the field
  });
});

function validateField(field) {
  applyValidationStyling(field);
  return field.value !== ''; // returns false if invalid, otherwise returns true
}

newBookForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const titleValid = validateField(titleField);
  const authorValid = validateField(authorField);
  const pagesValid = validateField(pagesField);

  if (titleValid && authorValid && pagesValid) {
    const title = titleField.value;
    const author = authorField.value;
    const pages = pagesField.value;

    const newBook = new Book(title, author, pages);

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

function toggleBookReadIcon() {
  const currentBook = library[this.dataset.bookIndex];

  if (currentBook.read === 'read') this.replaceChildren(setIcon('unread'));
  else this.replaceChildren(setIcon('read'));

  currentBook.toggleRead();
}

function updateReadBookBtnEventListeners() {
  let readBookBtns = document.querySelectorAll('.read-book');

  readBookBtns.forEach((btn) => {
    btn.removeEventListener('click', toggleBookReadIcon);
    btn.addEventListener('click', toggleBookReadIcon);
  });
}
