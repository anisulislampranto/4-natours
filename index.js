const express = require("express");
const fs = require("fs");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
// app.get("/", (req, res) => {
//   res.status(200).json({ text: "hello from the server side", app: "don" });
// });

// app.post("/", (req, res) => {
//   res.send("post here");
// })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});
app.get("/api/v1/tours/:id", (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Invalid Id",
  //   });
  // }

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid Id",
    });
  }

  console.log(tour);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: "success", data: { tour: newTour } });
    }
  );

  res.send("data posted");
});

app.delete("/api/v1/tours/:id", (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid Id",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
