// Get DOM elements
const viewNotesLink = document.getElementById("viewNotes");
const noteList = document.getElementById("noteList");
const noteTitleInput = document.getElementById("noteTitle");
const noteTextInput = document.getElementById("noteText");
const saveNoteButton = document.getElementById("saveNote");

// Create an array to store the notes
let notes = [];

// Function to update the note list
function updateNoteList() {
  noteList.innerHTML = "";
  notes.forEach((note, index) => {
    const noteItem = document.createElement("li");
    noteItem.className = "note-item";
    noteItem.textContent = note.title;
    noteItem.addEventListener("click", () => {
      displayNoteDetails(index);
    });
    noteList.appendChild(noteItem);
  });
}

// Function to display note details when a note is clicked
function displayNoteDetails(index) {
  const selectedNote = notes[index];
  noteTitleInput.value = selectedNote.title;
  noteTextInput.value = selectedNote.text;
}

// Function to save a new note
function saveNote() {
  const title = noteTitleInput.value;
  const text = noteTextInput.value;
  if (title && text) {
    const newNote = { title, text };
    notes.push(newNote);
    updateNoteList();
    clearNoteInputs();
  }
}

// Function to clear note inputs
function clearNoteInputs() {
  noteTitleInput.value = "";
  noteTextInput.value = "";
}

// Event listeners
viewNotesLink.addEventListener("click", () => {
  noteTitleInput.value = "";
  noteTextInput.value = "";
  saveNoteButton.style.display = "none";
  updateNoteList();
});

noteTitleInput.addEventListener("input", () => {
  saveNoteButton.style.display = "block";
});

noteTextInput.addEventListener("input", () => {
  saveNoteButton.style.display = "block";
});

saveNoteButton.addEventListener("click", saveNote);