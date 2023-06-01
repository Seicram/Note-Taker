const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { writeToFile, readFromFile, appendToFile } = require('./fileSystem');

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
    const notes = await readFromFile('./db/db.json');
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
    await appendToFile('./db/db.json', newNote);
    res.json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const notes = await readFromFile('./db/db.json');
    const filteredNotes = notes.filter((note) => note.id !== req.params.id);
    await writeToFile('./db/db.json', filteredNotes);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Restore a deleted note
app.put('/api/notes/restore/:id', async (req, res) => {
  try {
    const deletedNotes = await readFromFile('./db/deleted.json');
    const restoredNote = deletedNotes.find((note) => note.id === req.params.id);

    if (restoredNote) {
      const notes = await readFromFile('./db/db.json');
      const updatedNotes = [...notes, restoredNote];
      await writeToFile('./db/db.json', updatedNotes);

      const filteredDeletedNotes = deletedNotes.filter((note) => note.id !== req.params.id);
      await writeToFile('./db/deleted.json', filteredDeletedNotes);

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
