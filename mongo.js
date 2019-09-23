const mongoose = require('mongoose');

if ( process.argv.length < 3 ) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://fullstack:${password}@cluster0-9sasw.mongodb.net/notes-app?retryWrites=true&w=majority`

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

// const note = new Note({
//   content: 'HTML is Easy',
//   date: new Date(),
//   important: true,
// });

// note.save().then(result => {
//   console.log('note saved!', result);
//   mongoose.connection.close();
// })

Note.find({ important: true }).then(result => {
  mongoose.connection.close();
  result.forEach(note => {
    console.log(note);
  });
});