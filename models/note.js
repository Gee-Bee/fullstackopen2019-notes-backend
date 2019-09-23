const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error);
  });

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports =  mongoose.model('Note', noteSchema);