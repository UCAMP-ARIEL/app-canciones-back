const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();

app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API para proyecto canciones");
});

app.use("/lyrics", require("./router/lyrics"));

app.listen(process.env.PORT, () => {
  console.log(`El servidor esta corriendo en el puerto ${process.env.PORT}`);
});
