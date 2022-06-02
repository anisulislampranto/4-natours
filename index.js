const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();

const port = process.env.PORT || 5000;
// (1) MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));

// (1.1) CUSTOMIZE MEDDLEWARE
app.use((req, res, next) => {
  console.log("this is middlewere");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// (2) ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getAllUsers = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
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
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};
const getUser = (req, res) => {
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
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
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
};
const createUser = (req, res) => {
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
};

const deleteTour = (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: "failed delete",
      message: "Invalid Id",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const deleteUser = (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: "failed delete",
      message: "Invalid Id",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

// (3) ROUTES
// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createTour);
// app.get("/api/v1/tours/:id", getTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// CREATING ROUTER
const tourRouter = express.Router();
const userRouter = express.Router();

// TOURES
tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).delete(deleteTour);

// USERS
userRouter.route("/api/v1/users").get(getAllUsers).post(createUser);
userRouter.route("/api/v1/users/:id").get(getUser).delete(deleteUser);

// MOUNTING NEW ROUTER FOR A ROUTE || MIDDLEWARE FOR ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
