document.addEventListener('DOMContentLoaded', () => {
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');
  const deleteNoteBtn = document.querySelector('.delete-note');
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
  
  const renderActiveNote = () => {
    hide(saveNoteBtn);
    hide(deleteNoteBtn);
  
    if (activeNote.id) {
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
      show(deleteNoteBtn);
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
    saveNote(newNote)
      .then((response) => response.json())
      .then(() => {
        getAndRenderNotes();
        renderActiveNote();
      })
      .catch((error) => {
        console.error('Error saving note:', error);
      });
  };
  
  const handleNoteDelete = () => {
    const noteId = activeNote.id;
    deleteNote(noteId)
      .then(() => {
        getAndRenderNotes();
        activeNote = {};
        renderActiveNote();
      })
      .catch((error) => {
        console.error('Error deleting note:', error);
      });
  };
  
  const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
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
  
  const renderNoteList = (notes) => {
    noteList.innerHTML = '';
  
    if (notes.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.classList.add('list-group-item');
      emptyMessage.textContent = 'No saved notes';
      noteList.appendChild(emptyMessage);
    } else {
      notes.forEach((note) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.setAttribute('data-note', JSON.stringify(note));
  
        const noteTitle = document.createElement('span');
        noteTitle.classList.add('list-item-title');
        noteTitle.textContent = note.title;
        noteTitle.addEventListener('click', handleNoteView);
  
        listItem.appendChild(noteTitle);
  
        noteList.appendChild(listItem);
      });
    }
  };
  
  const getAndRenderNotes = () => {
    getNotes()
      .then((response) => response.json())
      .then((data) => renderNoteList(data))
      .catch((error) => {
        console.error('Error retrieving notes:', error);
      });
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    saveNoteBtn.style.display = 'none';
    deleteNoteBtn.style.display = 'none';
  
    saveNoteBtn.addEventListener('click', handleNoteSave);
    deleteNoteBtn.addEventListener('click', handleNoteDelete);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
  
    handleNewNoteView();
    getAndRenderNotes();
  });
  

});
