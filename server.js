require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./index');

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

// exports.connect = async () => {
//   try {
//     await mongoose.connect(DB, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

mongoose.connect(DB).then((con) => {
  console.log(con.connection);
  console.log('it is connected');
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour Must Have A Name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Tour Must Have A Price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
