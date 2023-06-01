const express = require('express');

const notesRouter = require('./notes.js');
const viewRouter = require('./view.js');

const app = express();

app.use('/api', notesRouter);

app.use('/', viewRouter);

module.exports = app;
