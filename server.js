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
  // console.log(con.connection);
  console.log('DB connected');
});

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
