// Event listener for the "Get Started" button
const getStartedBtn = document.querySelector('#get-started-btn');
getStartedBtn.addEventListener('click', () => {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('note-taker-page').style.display = 'block';
});

// Note Taker page elements
const noteTitleInput = document.querySelector('.note-title');
const noteTextInput = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const noteList = document.querySelector('.list-group');

let activeNote = null;

// Fetch notes from the server and render them
const getAndRenderNotes = () => {
  getNotes()
    .then((notes) => renderNoteList(notes))
    .catch((error) => console.error(error));
};

// Render the list of notes
const renderNoteList = (notes) => {
  noteList.innerHTML = '';

  notes.forEach((note) => {
    const noteItem = createNoteListItem(note);
    noteList.appendChild(noteItem);
  });
};

// Create a list item for a note
const createNoteListItem = (note) => {
  const noteItem = document.createElement('li');
  noteItem.classList.add('list-group-item');
  noteItem.setAttribute('data-note-id', note.id);

  const noteTitle = document.createElement('h5');
  noteTitle.classList.add('note-title');
  noteTitle.textContent = note.title || 'Untitled';

  const noteText = document.createElement('p');
  noteText.classList.add('note-text');
  noteText.textContent = note.text || '';

  noteItem.appendChild(noteTitle);
  noteItem.appendChild(noteText);

  return noteItem;
};

// Fetch notes from the server
const getNotes = () => {
  return fetch('/api/notes')
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return [];
    });
};

// Save a note to the server
const saveNote = (note) => {
  return fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

// Delete a note from the server
const deleteNote = (noteId) => {
  return fetch(`/api/notes/${noteId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

// Restore a note on the server
const restoreNote = (noteId) => {
  return fetch(`/api/notes/restore/${noteId}`, {
    method: 'PUT',
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

// Render the active note in the input fields
const renderActiveNote = () => {
  if (activeNote) {
    noteTitleInput.value = activeNote.title || '';
    noteTextInput.value = activeNote.text || '';
  } else {
    noteTitleInput.value = '';
    noteTextInput.value = '';
  }
};

// Save the note when the save button is clicked
const handleNoteSave = () => {
  const noteTitle = noteTitleInput.value.trim();
  const noteText = noteTextInput.value.trim();

  if (noteTitle || noteText) {
    const newNote = {
      title: noteTitle,
      text: noteText,
    };

    saveNote(newNote)
      .then(() => {
        activeNote = null;
        getAndRenderNotes();
        renderActiveNote();
      })
      .catch((error) => console.error(error));
  }
};

// Delete a note when the delete button is clicked
const handleNoteDelete = (e) => {
  const noteId = e.target.parentElement.dataset.noteId;

  deleteNote(noteId)
    .then(() => {
      activeNote = null;
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch((error) => console.error(error));
};

// Restore a note when the restore button is clicked
const handleNoteRestore = (e) => {
  const noteId = e.target.parentElement.dataset.noteId;

  restoreNote(noteId)
    .then(() => {
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch((error) => console.error(error));
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  getAndRenderNotes();
  renderActiveNote();
});

saveNoteBtn.addEventListener('click', handleNoteSave);

newNoteBtn.addEventListener('click', () => {
  activeNote = null;
  renderActiveNote();
});

noteList.addEventListener('click', (e) => {
  if (e.target.matches('li')) {
    const noteId = e.target.dataset.noteId;
    const noteTitle = e.target.querySelector('.note-title').textContent;
    const noteText = e.target.querySelector('.note-text').textContent;

    activeNote = {
      id: noteId,
      title: noteTitle,
      text: noteText,
    };

    renderActiveNote();
  } else if (e.target.matches('.delete-note')) {
    handleNoteDelete(e);
  } else if (e.target.matches('.restore-note')) {
    handleNoteRestore(e);
  }
});
