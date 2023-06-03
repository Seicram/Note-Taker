const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');

const router = express.Router();

// GET route for retrieving all notes
router.get('/', async (req, res) => {
  try {
    const notes = await readFromFile('./db/db.json');
    res.json(JSON.parse(notes));
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});

// POST route for creating a new note
router.post('/', async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({ error: 'Title and text are required' });
    }

    const newNote = {
      id: uuidv4(),
      title,
      text,
    };

    await readAndAppend('./db/db.json', newNote);
    res.json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// DELETE route for deleting a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await readFromFile('./db/db.json');
    const parsedNotes = JSON.parse(notes);
    const updatedNotes = parsedNotes.filter((note) => note.id !== id);
    await writeToFile('./db/db.json', updatedNotes);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
