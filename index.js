require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.static('build'));

const bodyParser = require('body-parser');
app.use(bodyParser.json())

const cors = require('cors');
app.use(cors());

const Note = require('./models/note');

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
});

app.get('/api/notes', (req, res) => {
  Note
    .find({})
    .then(notes => {
      res.json(notes.map(note => note.toJSON()));
    })
});

app.get('/api/notes/:id', (req, res, next) => {
  Note
    .findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/notes/:id', (req, res, next) => {
  Note
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
});

app.post('/api/notes', (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then(savedNote => {
    res.status(201).json(savedNote)
  })
});

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => {
      res.json(updatedNote.toJSON())
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformed id' })
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});