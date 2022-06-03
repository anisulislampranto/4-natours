const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

// };

mongoose.connect(DB).then((con) => {
  // console.log(con.connection);
  console.log('DB connected');
});

// READ JSON FILE and parse it to js object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// delete all data from DB collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
