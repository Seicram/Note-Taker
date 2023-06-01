const express = require('express');
const view = express.Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

// GET Route for retrieving all the notes
view.get('/notes', async (req, res) => {
  try {
    console.info(`${req.method} notes request received`);
    const data = await readFromFile('../db/db.json');
    const parsedData = JSON.parse(data); // Parse the JSON data
    res.json(parsedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = view;
