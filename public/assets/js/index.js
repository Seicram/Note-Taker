const noteTitleInput = document.querySelector('.note-title');
const noteTextInput = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const noteList = document.querySelector('.list-group');

let activeNote = {};

const getAndRenderNotes = () => {
  return getNotes()
    .then((notes) => renderNoteList(notes))
    .catch((error) => console.error(error));
};

const renderNoteList = (notes) => {
  noteList.innerHTML = '';

  const noteItems = notes.map((note) => {
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
  });

  noteList.append(...noteItems);
};

const getNotes = () =>
  fetch('/api/notes')
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return [];
    });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));

const deleteNote = (noteId) =>
  fetch(`/api/notes/${noteId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));

const restoreNote = (noteId) =>
  fetch(`/api/notes/restore/${noteId}`, {
    method: 'PUT',
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));

const renderActiveNote = () => {
  noteTitleInput.value = activeNote.title || '';
  noteTextInput.value = activeNote.text || '';
};

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
        activeNote = {};
        noteTitleInput.value = '';
        noteTextInput.value = '';
        getAndRenderNotes();
        renderActiveNote();
      })
      .catch((error) => console.error(error));
  }
};

const handleNoteDelete = (e) => {
  const noteId = e.target.parentElement.dataset.noteId;

  deleteNote(noteId)
    .then(() => {
      activeNote = {};
      noteTitleInput.value = '';
      noteTextInput.value = '';
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch((error) => console.error(error));
};

const handleNoteRestore = (e) => {
  const noteId = e.target.parentElement.dataset.noteId;

  restoreNote(noteId)
    .then(() => {
      getAndRenderNotes();
      renderActiveNote();
    })
    .catch((error) => console.error(error));
};

saveNoteBtn.addEventListener('click', handleNoteSave);
newNoteBtn.addEventListener('click', () => {
  activeNote = {};
  noteTitleInput.value = '';
  noteTextInput.value = '';
  renderActiveNote();
});

noteList.addEventListener('click', (e) => {
  if (e.target.matches('li')) {
    const noteId = e.target.dataset.noteId;
    activeNote = {
      id: noteId,
      title: e.target.querySelector('.note-title').textContent,
      text: e.target.querySelector('.note-text').textContent,
    };
    renderActiveNote();
  } else if (e.target.matches('.delete-note')) {
    handleNoteDelete(e);
  } else if (e.target.matches('.restore-note')) {
    handleNoteRestore(e);
  }
});

const initNoteApp = () => {
  getAndRenderNotes();
  renderActiveNote();
};

initNoteApp();
