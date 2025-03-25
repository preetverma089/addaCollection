const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookie_parser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const db = require("./config/db");
const userRoutes = require("./routes/user.routes");
dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookie_parser());
app.use(morgan());
db.connectDB();
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
const PORT = process.env.PORT || 4100;

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Server is working",
  });
});
app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => {
  console.log(`server is started at port${PORT}`);
});
