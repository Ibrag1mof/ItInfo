const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("config");
const mongoose = require("mongoose");
const routes = require("./routes/index.routes");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const PORT = config.get("port") || 3030;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.set("View engine", "ejs");
app.use(express.static("styles"));
app.use(routes);
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(config.get("dbUri"));
    app.listen(PORT, () => {
      console.log(`Server ${PORT}da ishga tushdi`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
