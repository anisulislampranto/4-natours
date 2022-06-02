const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.status(200).json({ text: "hello from the server side", app: "don" });
// });

// app.post("/", (req, res) => {
//   res.send("post here");
// })

app.get("/api/v1/tours", (req, res) => {});

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
