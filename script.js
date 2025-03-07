const notesContainer = document.getElementById('notesContainer');
const saveNoteButton = document.getElementById('saveNote');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentDiv = document.getElementById('noteContent');
const toggleThemeButton = document.getElementById('toggleTheme');
const emojiPicker = document.getElementById('emojiPicker');
const bgColorPicker = document.getElementById('bgColorPicker');
const textColorPicker = document.getElementById('textColorPicker');

let currentNoteColor = '';
let currentTextColor = '';  
let editNote = null; 

// Load saved theme from localStorage
document.body.classList.add(localStorage.getItem('theme') || 'light');
toggleThemeButton.textContent = document.body.classList.contains('dark') ? 'Dark 🌙' : 'Light 🌞';

toggleThemeButton.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.classList.replace(currentTheme, newTheme);
  localStorage.setItem('theme', newTheme);
  toggleThemeButton.textContent = newTheme === 'light' ? ' Light 🌞' : 'Dark 🌙';
});

// Background color picker event
bgColorPicker.addEventListener('input', (e) => {
  currentNoteColor = e.target.value;
  noteContentDiv.style.backgroundColor = currentNoteColor;
});

// Text color picker event
textColorPicker.addEventListener('input', (e) => {
  currentTextColor = e.target.value;  // Store the selected text color
  noteContentDiv.style.color = currentTextColor;  // Apply it to the editing area
});

// Emoji picker event
emojiPicker.addEventListener('change', (e) => {
  const emoji = e.target.value;
  document.execCommand('insertText', false, emoji);
});

// Function to create a note element
function createNoteElement(title, content, color, textColor) {
  const note = document.createElement('div');
  note.className = 'note';
  if (color) note.style.backgroundColor = color;

  const noteHeader = document.createElement('div');
  noteHeader.className = 'note-header';

  const noteTitle = document.createElement('h3');
  noteTitle.textContent = title;
  noteTitle.style.overflow = 'hidden';
  noteTitle.style.textOverflow = 'ellipsis';
  noteTitle.style.whiteSpace = 'nowrap';
  noteTitle.style.maxWidth = '200px';
  noteTitle.style.display = 'inline-block';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    note.remove();
    saveNotesToLocalStorage();
  });

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.style.backgroundColor = 'red';
  editBtn.addEventListener('click', () => {
    noteTitleInput.value = title;
    noteContentDiv.innerHTML = content;
    currentNoteColor = color;
    currentTextColor = textColor;  // Set the text color for editing
    noteContentDiv.style.backgroundColor = color;
    noteContentDiv.style.color = textColor;  // Apply the text color to the editing area
    container.style.display = "block";
    toggleButton.style.display = "none";
    editNote = note; // Save reference to the note to edit
  });

  const noteContent = document.createElement('div');
  noteContent.className = 'note-content';
  noteContent.setAttribute('contenteditable', true);
  noteContent.innerHTML = content;
  noteContent.style.height = "50px";
  noteContent.style.color = textColor;  // Apply the saved text color here

  const noteTime = document.createElement('div');
  noteTime.className = 'note-time';
  const currentTime = new Date().toLocaleString();
  noteTime.textContent = currentTime;
  noteTime.style.position = 'absolute';
  noteTime.style.bottom = '5px';
  noteTime.style.right = '5px';
  noteTime.style.fontSize = '12px';
  noteTime.style.color = 'black';

  noteHeader.appendChild(noteTitle);
  noteHeader.appendChild(deleteBtn);
  noteHeader.appendChild(editBtn);
  note.appendChild(noteHeader);
  note.appendChild(noteContent);
  note.appendChild(noteTime);

  notesContainer.appendChild(note);
}

// Save all notes to localStorage
function saveNotesToLocalStorage() {
  const notes = [];
  const noteElements = document.querySelectorAll('.note');
  noteElements.forEach(noteElement => {
    const title = noteElement.querySelector('.note-header h3').textContent;
    const content = noteElement.querySelector('.note-content').innerHTML;
    const color = noteElement.style.backgroundColor;
    const textColor = noteElement.querySelector('.note-content').style.color; // Get the text color
    const time = noteElement.querySelector('.note-time').textContent;
    notes.push({ title, content, color, textColor, time });
  });
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Load notes from localStorage
function loadNotesFromLocalStorage() {
  const savedNotes = JSON.parse(localStorage.getItem('notes'));
  if (savedNotes) {
    savedNotes.forEach(note => {
      createNoteElement(note.title, note.content, note.color, note.textColor); // Pass text color as well
    });
  }
}

// Load notes when the page loads
window.onload = loadNotesFromLocalStorage;

const toggleButton = document.getElementById('btn');
const container = document.getElementById('myContainer');

// Show container and hide toggle button
toggleButton.addEventListener('click', () => {
  container.style.display = "block";
  toggleButton.style.display = "none";
});

// Save note button event
saveNoteButton.addEventListener('click', () => {
  const title = noteTitleInput.value.trim();
  const content = noteContentDiv.innerHTML.trim();

  // Validation
  if (!title) {
    alert('Title cannot be empty! Please enter at least one letter.');
    return;
  }
  if (!content) {
    alert('Note content cannot be empty!');
    return;
  }

  if (!editNote) {
    // Create a new note
    createNoteElement(title, content, currentNoteColor, currentTextColor);  // Pass the text color
  } else {
    // Update the existing note
    editNote.querySelector('.note-header h3').textContent = title;
    editNote.querySelector('.note-content').innerHTML = content;
    editNote.style.backgroundColor = currentNoteColor;
    editNote.querySelector('.note-content').style.color = currentTextColor;  // Update text color
    editNote = null; // Reset edit state
  }

  saveNotesToLocalStorage();

  // Clear input fields
  noteTitleInput.value = '';
  noteContentDiv.innerHTML = '';
  noteContentDiv.style.backgroundColor = '';
  noteContentDiv.style.color = '';  // Reset text color
  currentNoteColor = '';
  currentTextColor = '';

  // Hide container and show toggle button
  container.style.display = "none";
  toggleButton.style.display = "inline-block";
});

const deleteAllBtn = document.getElementById('deleteAllBtn');

deleteAllBtn.addEventListener('click', function () {
  const confirmDelete = window.confirm("Are you sure you want to delete all notes?");
  
  if (confirmDelete) {
    notesContainer.innerHTML = ""; 
    alert("All notes have been deleted!");
  } else {
    alert("Delete operation canceled.");
  }
});