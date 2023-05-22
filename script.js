// Retrieve saved notes from localStorage on page load
window.addEventListener('load', function () {
    var savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    var noteList = document.getElementById('noteList');
  
    // Render the saved notes
    for (var i = 0; i < savedNotes.length; i++) {
      var noteItem = document.createElement('li');
      noteItem.textContent = savedNotes[i];
      noteList.appendChild(noteItem);
    }
  });
