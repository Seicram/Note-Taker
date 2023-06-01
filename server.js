const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api);

// Serve static files from the "public" directory
app.use(express.static(path.resolve(__dirname, 'public')));

// GET Route for notes file. This comes first since the asterik will catch everything else.
app.get('/notes', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'public', 'notes.html'))
);

// GET Route for "index.html" file. Catches everything other than /notes.
app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
