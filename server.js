const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");

//Load env vara
dotenv.config({ path: "./config/config.env" });

//ConnectDB();
connectDB();

//Route files
const campgrouds = require("./routes/campgrounds");
const bookings = require("./routes/bookings");
const auth = require("./routes/auth");

const app = express();

//Body parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://camp-ground-project.vercel.app",
      "https://swp-2-frontend.vercel.app",
      "https://camp-ground-project-git-test-phoovichs-projects.vercel.app",
      "https://camp-ground-project-4hbr3yp9x-phoovichs-projects.vercel.app",
      "https://se-frontend-one.vercel.app",
    ],
    credentials: true,
  }),
);

app.use("/api/v1/campgrounds", campgrouds);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);

const PORT = process.env.PORT || 5003;

const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT,
  ),
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server & exit process
  server.close(() => process.exit(1));
});
