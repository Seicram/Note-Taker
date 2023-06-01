const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes

// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const data = await fs.readFile('./db/db.json', 'utf8');
    const notes = JSON.parse(data);
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save a new note
app.post('/api/notes', async (req, res) => {
  try {
    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text,
    };

    const data = await fs.readFile('./db/db.json', 'utf8');
    const notes = JSON.parse(data);
    notes.push(newNote);

    await fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4));
    res.json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const data = await fs.readFile('./db/db.json', 'utf8');
    let notes = JSON.parse(data);

    notes = notes.filter((note) => note.id !== req.params.id);

    await fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4));
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Restore a deleted note
app.put('/api/notes/restore/:id', async (req, res) => {
  try {
    const dbData = await fs.readFile('./db/db.json', 'utf8');
    const deletedData = await fs.readFile('./db/deleted.json', 'utf8');

    const notes = JSON.parse(dbData);
    const deletedNotes = JSON.parse(deletedData);

    const restoredNote = deletedNotes.find((note) => note.id === req.params.id);

    if (restoredNote) {
      notes.push(restoredNote);
      const filteredDeletedNotes = deletedNotes.filter((note) => note.id !== req.params.id);

      await fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4));
      await fs.writeFile('./db/deleted.json', JSON.stringify(filteredDeletedNotes, null, 4));

      res.json({ message: 'Note restored' });
    } else {
      res.status(404).json({ error: 'Note not found in deleted notes' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
