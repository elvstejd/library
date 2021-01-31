let myLibrary = [];

const bookTitle = document.getElementById('title');
const bookAuthor = document.getElementById('author-form');
const bookPages = document.getElementById('pages');
const bookRead = document.getElementById('read-status');
const addBookForm = document.getElementById('add-book');
const library = document.querySelector('.library');
const newBook = document.querySelector('#open-add');
const modal = document.querySelector('.modal-overlay');

window.addEventListener('DOMContentLoaded', () => {
    getBooksFromLocalStorage();
    displayBooks();
});

addBookForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addBookToLibrary();
    displayBooks();
    modal.classList.remove('show-modal');
});

newBook.addEventListener('click', function() {
    modal.classList.add('show-modal');
});

modal.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        modal.classList.remove('show-modal');
    }
});

library.addEventListener('click', function(e) {
    if (e.target.id === 'del') {
        const bookId = e.target.parentElement.parentElement.dataset.id;
        deleteBook(bookId);
        displayBooks();
    }

    if (e.target.id === 'mark-read') {
        const bookId = e.target.parentElement.parentElement.dataset.id;
        const book = e.target.parentElement.parentElement.classList.toggle('read');
        changeReadStatus(bookId);
    }
    if (e.target.parentElement.id === 'mark-read') {
        const bookId = e.target.parentElement.parentElement.parentElement.dataset.id;
        const book = e.target.parentElement.parentElement.parentElement.classList.toggle('read');
        changeReadStatus(bookId);
        console.log(bookId)
    }
});

function clearBookForm() {
    bookTitle.value = "";
    bookAuthor.value = "";
    bookPages.value = "";
    bookRead.checked = false;
}

function displayBooks() {
    if (myLibrary.length === 0) {
        library.innerHTML = `<div class="empty-notice">
        <h1>Your library is empty, try adding books with the top right button.</h1>
    </div>
    `;
        return;
    } 
    let books = myLibrary.map((book) => {
        const classValue = book.read ? "book read" : "book";
        return  `<div class="${classValue}" data-id="${book.id}">
        <div class="info-container">
            <h3 id="book-title">${book.title}</h3>
            <span id="by">by</span>
            <span id="author">${book.author}</span>
        </div>
        <span id="pages-read">${book.pages}</span>
        <div class="btn-container">
            <button type="button" class="btn" id="mark-read">Mark as <span id="yes-read">Read</span><span id="not-read">Not Read</span></button>
            <button type="button" class="btn-second" id="del" >Delete</button>
        </div>
    </div>`;
    }).join("");
    library.innerHTML = books;
}

function Book(id, title, author, pages, read) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function() {
    const newState = this.read ? false : true;
    this.read = newState;
}

function addBookToLibrary() {
    const newBook = new Book();
    let idFromDate = Date.now();

    newBook.id = idFromDate;
    newBook.title = bookTitle.value;
    newBook.author = bookAuthor.value;
    newBook.pages = bookPages.value;
    newBook.read = bookRead.checked;

    clearBookForm();
    myLibrary.push(newBook);
    saveBooksToLocalStorage();
}

function deleteBook(id) {
    myLibrary = myLibrary.filter((book) => {
        return book.id != id;
    });
    saveBooksToLocalStorage();
}

function changeReadStatus(id) {
    const bookIndex = myLibrary.findIndex((book) => book.id === Number.parseInt(id));
    myLibrary[bookIndex].read = !myLibrary[bookIndex].read;
    saveBooksToLocalStorage();
}

function saveBooksToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(myLibrary));
}

function getBooksFromLocalStorage() {
    myLibrary = localStorage.getItem("books") ? JSON.parse(localStorage.getItem("books")) : [];
}
