function initNoteApp() {
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');
  const newNoteBtn = document.querySelector('.new-note');
  const noteList = document.querySelector('.note-list');
  const trashList = document.querySelector('.trash-list');

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
    });

  const saveNote = (note) =>
    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });

  const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

  const restoreNote = (id) =>
    fetch(`/api/notes/restore/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
    saveNote(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const handleNoteDelete = (e) => {
    e.stopPropagation();
    const note = e.target.parentElement;
    const noteId = note.dataset.noteId;

    if (activeNote.id === noteId) {
      activeNote = {};
    }

    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const handleNoteRestore = (e) => {
    e.stopPropagation();
    const note = e.target.parentElement;
    const noteId = note.dataset.noteId;

    restoreNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const handleNoteView = (e) => {
    e.preventDefault();
    const dataset = e.target.dataset;
    const noteId = dataset.noteId || dataset.trashNoteId;
    const title = e.target.innerText;

    activeNote = {
      id: noteId,
      title: title,
      text: '',
      isTrashed: !!dataset.trashNoteId,
    };

    renderActiveNote();
  };

  const handleNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
  };

  const handleRenderSaveBtn = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  };

  const renderNoteList = (notes, isTrash = false) => {
    const targetList = isTrash ? trashList : noteList;
    targetList.innerHTML = '';

    if (notes.length === 0) {
      const noNotesHtml = `<li class="list-group-item">${isTrash ? 'No notes in trash' : 'No saved notes'}</li>`;
      targetList.innerHTML = noNotesHtml;
    } else {
      notes.forEach((note) => {
        const listItemHtml = `
          <li class="list-group-item">
            <span class="list-item-title" data-note-id="${note.id}" data-trash-note-id="${note.id}">${note.title}</span>
            <i class="fas fa-trash-alt float-right text-danger delete-note"></i>
          </li>`;
        targetList.insertAdjacentHTML('beforeend', listItemHtml);
      });
    }
  };

  const getAndRenderNotes = () => {
    getNotes()
      .then((response) => response.json())
      .then((data) => {
        const notes = data.filter((note) => !note.isTrashed);
        const trashNotes = data.filter((note) => note.isTrashed);
        renderNoteList(notes);
        renderNoteList(trashNotes, true);
      });
  };

  if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
  }

  getAndRenderNotes();
}

initNoteApp();
