const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to mongodb at', url);

mongoose.connect(url).then(() => {
  console.log('Connected to Monogodb');
}).catch((error) => {
  console.log('Failed to connect to MongoDB', error.message);
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (value) => /\d{3}-\d{3}-\d{4}/.test(value),
      message: (props) => `${props.value} is not a valid phone number. Should be in the format xxx-xxx-xxxx (hyphens included)`,
    },
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const objectRef = returnedObject;
    objectRef.id = objectRef._id.toString();
    delete objectRef._id;
    delete objectRef.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
