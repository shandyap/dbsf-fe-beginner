const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function searchBook() {
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const searchResult = books.filter(book => book.title.toLowerCase().includes(searchTitle));
  
  const incompletedBookShelfList = document.getElementById('incompleteBookshelfList');
  incompletedBookShelfList.innerHTML = '';
  const completedBookShelfList = document.getElementById('completeBookshelfList');
  completedBookShelfList.innerHTML = '';

  for (const bookItem of searchResult) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      incompletedBookShelfList.append(bookElement);
    } else {
      completedBookShelfList.append(bookElement);
    }
  }
}

function isChecked(){
  if(document.getElementById('inputBookIsComplete').checked){
    document.getElementById('inputBuku').innerText = 'Selesai dibaca';
  
  } else{
    document.getElementById('inputBuku').innerText = 'Belum selesai dibaca';
  }
}


function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = parseInt(document.getElementById('inputBookYear').value);
  const isComplete = document.getElementById('inputBookIsComplete').checked;
  const generatedID = generateId();
  const BookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete);
  const bookElement = makeBook(BookObject);
  books.push(BookObject);
  
  console.log(books);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(); 
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

document.addEventListener(RENDER_EVENT, function () {
  const incompletedBookShelfList = document.getElementById('incompleteBookshelfList');
  incompletedBookShelfList.innerHTML = '';
  const completedBookShelfList = document.getElementById('completeBookshelfList');
  completedBookShelfList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      incompletedBookShelfList.append(bookElement);
    } else {
      completedBookShelfList.append(bookElement);
    }
  }
});

function makeBook(BookObject) {
  const {id, title, author, year, isComplete} = BookObject;

  
  const textTitle = document.createElement('h3');
  textTitle.innerText = BookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = BookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = BookObject.year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('book_list');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('article');
  container.classList.add('book_item')
  container.append(textContainer);
  container.setAttribute('id', `book-${BookObject.id}`);

  if (BookObject.isComplete) {
    const buttonAction = document.createElement('div');
    buttonAction.classList.add('action');

    const greenButton = document.createElement('button');
    greenButton.classList.add('green');
    greenButton.innerText = 'Belum selesai dibaca';
    greenButton.addEventListener('click', function(){
      belumSelesaiDibaca(id);
    });

    const redButton = document.createElement('button');
    redButton.classList.add('red');
    redButton.innerText = 'Hapus buku';
    redButton.addEventListener('click', function(){
      hapusBuku(id);
    });

    const blueButton = document.createElement('button');
    blueButton.classList.add('blue');
    blueButton.innerText ='Edit Buku';
    blueButton.addEventListener('click', function(){
      EditBuku(id);
    })
    

    buttonAction.append(greenButton, redButton, blueButton);
    container.append(buttonAction);
  } else {
    const buttonAction = document.createElement('div');
    buttonAction.classList.add('action');

    const greenButton = document.createElement('button');
    greenButton.classList.add('green');
    greenButton.innerText = 'Selesai dibaca';
    greenButton.addEventListener('click', function(){
      selesaiDibaca(id);

    });

    const redButton = document.createElement('button');
    redButton.classList.add('red');
    redButton.innerText = 'Hapus buku';
    redButton.addEventListener('click', function(){
      hapusBuku(id);
    });

    const blueButton = document.createElement('button');
    blueButton.classList.add('blue');
    blueButton.innerText ='Edit Buku';
    blueButton.addEventListener('click', function(){
      EditBuku(id);
    })


    buttonAction.append(greenButton, redButton, blueButton);
    container.append(buttonAction);
  }
  return container
}

function selesaiDibaca(bookId){
  const bookTarget = findBook(bookId);

  if(bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function belumSelesaiDibaca(bookId){
  const bookTarget = findBook(bookId);

  if(bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function hapusBuku(bookId){
  const bookTarget = findBookIndex(bookId);

  if(bookTarget === -1) return;

  const modal = document.getElementById('deleteBookModal');
  modal.style.display = 'block';

  const deleteConfirm = document.getElementById('deleteBookConfirm');
  const deleteCancel = document.getElementById('deleteBookCancel');

  deleteConfirm.onclick = function() {
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    modal.style.display = 'none';
  }

  deleteCancel.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
}

function EditBuku(bookId){

}

function findBookIndex(bookId){
  for(const index in books){
    if(books[index].id === bookId){
      return index;
    }
  }
  return -1;
}

function findBook(bookId) {
  for (const bookItem of books){
    if(bookItem.id === bookId){
      return bookItem;
    }
  }

  return null
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser andatidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function() {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
