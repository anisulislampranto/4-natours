require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception! shutting down');
  process.exit(1);
});

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

const server = app.listen(port, () => {
  console.log(`listening to ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection! shutting down');
  server.close(() => {
    process.exit(1);
  });
});
