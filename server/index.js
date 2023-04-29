const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const route = require("./routers/index");

const morgan = require("morgan");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
dbConnect();

route(app);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
