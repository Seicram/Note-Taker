const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.resolve(__dirname, 'public')));

// Route to handle the /api/notes GET request
app.get('/api/notes', (req, res) => {
  // Read the notes data from db.json file
  fs.readFile(path.resolve(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes data' });
    }

    try {
      const notes = JSON.parse(data); // Parse the JSON data
      return res.json(notes); // Respond with the notes data as JSON
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to parse notes data' });
    }
  });
});

// Catch-all route for serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
