const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.querySelector("#load-btn");
const statusText = document.querySelector("#status");
const list = document.querySelector("#notes-list");
const noteForm = document.querySelector("#note-form");
const submitBtn = document.querySelector("#submit-btn");

function setStatus(message, type) {
  statusText.textContent = message;
  statusText.className = type ? `status-${type}` : "";
}

// One reusable function for every request.
async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`);
  }
  // DELETE may return an empty body, so parse carefully.
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  return { data, status: response.status };
}

function showNote(note) {
  const li = document.createElement("li");
  li.classList.add("note");

  const info = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = note.title;

  const body = document.createElement("p");
  body.textContent = note.body;

  info.append(title, body);
  li.appendChild(info);
  list.appendChild(li);
}

function showEmptyState() {
  list.innerHTML = "";
  const li = document.createElement("li");
  li.textContent = "No notes yet. Click Load notes or create one.";
  list.appendChild(li);
}

function addNoteToTop(note) {
  const li = document.createElement("li");
  li.classList.add("note");

  const info = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = note.title;

  const body = document.createElement("p");
  body.textContent = note.body || "";

  info.append(title, body);
  li.appendChild(info);

  list.prepend(li);
}



async function createNote(event) {
  event.preventDefault();

  const titleInput = document.querySelector("#title-input");
  const bodyInput = document.querySelector("#body-input");

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    setStatus("Please enter a note title.", "error");
    titleInput.focus();
    return;
  }

  if (title.length > 100) {
    setStatus("Title must not exceed 100 characters.", "error");
    titleInput.focus();
    return;
  }

  submitBtn.disabled = true;
  setStatus("Creating note...", "loading");

  try {
    const { data: note, status } = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        body: body,
        userId: 1
      })
    });

    list.querySelectorAll(".empty-state").forEach(item => item.remove());

    addNoteToTop(note);

    setStatus(
      `Note created (status ${status}, id ${note.id}).`,
      "success"
    );

    noteForm.reset();
  } catch (error) {
    setStatus("Could not create the note. Please try again.", "error");
    console.error(error);
  } finally {
    submitBtn.disabled = false;
  }
}


async function loadNotes() {
  setStatus("Loading notes...", "loading");
  loadBtn.disabled = true;
  list.innerHTML = "";

  try {
    const { data: notes } = await request(`${API_URL}?_limit=10`);
    if (notes.length === 0) {
      showEmptyState();
      setStatus("No notes found.", "success");
    } else {
      notes.forEach(showNote);
      setStatus(`Loaded ${notes.length} notes from the server.`, "success");
    }
  } catch (error) {
    setStatus("Could not load notes. Please try again.", "error");
    console.error(error);
  } finally {
    loadBtn.disabled = false;
  }
}

loadBtn.addEventListener("click", loadNotes);
showEmptyState();
noteForm.addEventListener("submit", createNote);
