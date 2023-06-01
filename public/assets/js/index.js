function initNoteApp() {
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');
  const newNoteBtn = document.querySelector('.new-note');
  const noteList = document.querySelector('.list-group');

  const show = (elem) => {
    elem.style.display = 'inline';
  };

  const hide = (elem) => {
    elem.style.display = 'none';
  };

  let activeNote = {};

  const getNotes = () =>
    fetch('/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());

  const saveNote = (note) =>
    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    }).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });

  const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });

  const restoreNote = (id) =>
    fetch(`/api/notes/restore/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });

  const renderActiveNote = () => {
    hide(saveNoteBtn);

    if (activeNote.id) {
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    }
  };

  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    };

    saveNoteBtn.disabled = true;
    saveNoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    saveNote(newNote)
      .then(() => {
        noteTitle.focus();
        saveNoteBtn.disabled = false;
        saveNoteBtn.innerHTML = '<i class="fas fa-save"></i> Save';
      })
      .catch((error) => {
        console.error(error);
        saveNoteBtn.disabled = false;
        saveNoteBtn.innerHTML = '<i class="fas fa-save"></i> Save';
      });
  };

  const handleNoteDelete = (e) => {
    e.stopPropagation();
    const note = e.target.parentElement;
    const noteId = note.dataset.noteId;

    if (activeNote.id === noteId) {
      activeNote = {};
    }

    deleteNote(noteId);
  };

  const handleNoteRestore = (e) => {
    e.stopPropagation();
    const note = e.target.parentElement;
    const noteId = note.dataset.noteId;

    restoreNote(noteId);
  };

  const handleNoteView = (e) => {
    e.preventDefault();
    const dataset = e.target.dataset;
    const noteId = dataset.noteId || dataset.trashNoteId;
    const title = e.target.innerHTML;

    activeNote = {
      id: noteId,
      title: title,
      text: '',
    };

    renderActiveNote();
  };

  const renderNoteList = (notes) => {
    noteList.innerHTML = '';

    if (notes.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.classList.add('list-group-item', 'text-center');
      emptyMessage.textContent = 'No notes found.';
      noteList.appendChild(emptyMessage);
    } else {
      notes.forEach((note) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.dataset.noteId = note.id;

        const noteTitle = document.createElement('h5');
        noteTitle.classList.add('mb-1');
        noteTitle.textContent = note.title;
        listItem.appendChild(noteTitle);

        const noteText = document.createElement('p');
        noteText.classList.add('mb-1', 'note-preview');
        noteText.textContent = note.text.length > 50 ? note.text.slice(0, 50) + '...' : note.text;
        listItem.appendChild(noteText);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'float-right', 'delete-note');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', handleNoteDelete);
        listItem.appendChild(deleteButton);

        noteList.appendChild(listItem);
      });
    }
  };

  const getAndRenderNotes = () => getNotes().then(renderNoteList);

  const handleNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
  };

  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);

  noteList.addEventListener('click', (e) => {
    if (e.target.matches('.list-group-item')) {
      handleNoteView(e);
    } else if (e.target.matches('.delete-note')) {
      handleNoteDelete(e);
    } else if (e.target.matches('.restore-note')) {
      handleNoteRestore(e);
    }
  });

  getAndRenderNotes();
}

initNoteApp();
