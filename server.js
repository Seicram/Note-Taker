const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API routes

// Read the notes from the db.json file
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }

    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse notes data.' });
    }
  });
});

// Save a new note to the db.json file
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }

    try {
      const notes = JSON.parse(data);

      // Generate a unique id for the new note
      const newNoteId = Date.now().toString();
      newNote.id = newNoteId;

      notes.push(newNote);

      fs.writeFile(
        path.join(__dirname, 'db/db.json'),
        JSON.stringify(notes),
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to save note.' });
          }

          res.json(newNote);
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse notes data.' });
    }
  });
});

// Delete a note from the db.json file
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }

    try {
      let notes = JSON.parse(data);

      notes = notes.filter((note) => note.id !== noteId);

      fs.writeFile(
        path.join(__dirname, 'db/db.json'),
        JSON.stringify(notes),
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete note.' });
          }

          res.sendStatus(204);
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse notes data.' });
    }
  });
});

// HTML routes

// Return the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Return the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

