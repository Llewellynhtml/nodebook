const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

const booksFilePath = path.join(__dirname, "books.json");

app.use(express.json());

const readBooksFromFile = () => {
  try {
    const data = fs.readFileSync(booksFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeBooksToFile = (books) => {
  fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2), "utf8");
};

app.post("/book", (req, res) => {
  try {
    const { title, author, publisher, publishedDate, isbn } = req.body;

    if (!title || !author || !publisher || !publishedDate || !isbn) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const books = readBooksFromFile();

    if (!/^[0-9-]+$/.test(isbn)) {
      return res.status(400).json({ error: "Invalid ISBN format" });
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
    writeBooksToFile(books);

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(400).json({ error: "Invalid JSON format" });
  }
});

app.get("/books", (req, res) => {
  const books = readBooksFromFile();
  res.json(books);
});

app.get("/books/:isbn", (req, res) => {
  const books = readBooksFromFile();
  const book = books.find((b) => b.isbn === req.params.isbn);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.json(book);
});

app.put("/books/:isbn", (req, res) => {
  const books = readBooksFromFile();
  const bookIndex = books.findIndex((b) => b.isbn === req.params.isbn);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, author, publisher, publishedDate, isbn } = req.body;

  if (title) books[bookIndex].title = title;
  if (author) books[bookIndex].author = author;
  if (publisher) books[bookIndex].publisher = publisher;
  if (publishedDate) books[bookIndex].publishedDate = publishedDate;
  if (isbn) {
    if (!/^[0-9-]+$/.test(isbn)) {
      return res.status(400).json({ error: "Invalid ISBN format" });
    }
    books[bookIndex].isbn = isbn;
  }

  writeBooksToFile(books);
  res.json(books[bookIndex]);
});

app.delete("/books/:isbn", (req, res) => {
  const books = readBooksFromFile();
  const bookIndex = books.findIndex((b) => b.isbn === req.params.isbn);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(bookIndex, 1);
  writeBooksToFile(books);
  res.status(204).send();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
