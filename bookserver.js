const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());


let books = [];


const isValidISBN = (isbn) => {
  return typeof isbn === 'string' && /^[0-9-]+$/.test(isbn);
};

app.post('/book', (req, res) => {
  const { title, author, publisher, publishedDate, isbn } = req.body;

  
  if (!title || !author || !publisher || !publishedDate || !isbn) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!isValidISBN(isbn)) {
    return res.status(400).json({ error: 'Invalid ISBN format' });
  }

  const newBook = {
    id: books.length + 1,
    title,
    author,
    publisher,
    publishedDate,
    isbn,
  };
  books.push(newBook);
  res.status(201).json({
    message:"Addeds successfully" ,
    book:newBook
  });
});


app.get('/books', (req, res) => {
  res.json(books);
});


app.get('/books/:isbn', (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});


app.put('/books/:isbn', (req, res) => {
  const bookIndex = books.findIndex(b => b.isbn === req.params.isbn);
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const { title, author, publisher, publishedDate, isbn } = req.body;

  
  if (title) books[bookIndex].title = title;
  if (author) books[bookIndex].author = author;
  if (publisher) books[bookIndex].publisher = publisher;
  if (publishedDate) books[bookIndex].publishedDate = publishedDate;
  if (isbn) {
    if (!isValidISBN(isbn)) {
      return res.status(400).json({ error: 'Invalid ISBN format' });
    }
    books[bookIndex].isbn = isbn;
  }

  res.json(books[bookIndex]);
});

app.delete('/books/:isbn', (req, res) => {
  const bookIndex = books.findIndex(b => b.isbn === req.params.isbn);
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  books.splice(bookIndex, 1);
  res.status(204).send(); 
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
