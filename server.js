const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for serving static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes for serving static files
app.get('/api/notes', (req, res) => {
  // Read the contents of the db.json file
  fs.readFile('note taker/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Route for saving a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  // Read the db.json file and parse the contents
  fs.readFile('note taker/db/db.json', 'utf8', (err, data) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }

    // Add the new note to the array of note objects
    const notes = JSON.parse(data);
    notes.push(newNote);

    // Write the updated array of note objects to the db.json file
    fs.writeFile('note taker/db/db.json', JSON.stringify(notes), (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save note.' });
      }
      res.json(newNote);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
