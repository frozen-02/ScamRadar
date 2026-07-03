// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");

// require("dotenv").config();

// const app = express();

// const authRoutes = require("./routes/authRoute.js");
// const spamRoute = require("./routes/spamRoutes.js");

// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MONGODB connected"));

// app.use("/api/auth", authRoutes);

// app.use("/api/spam-detection", spamRoute);

// const PORT = 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
//const spamRoute = require("./routes/spamRoutes.js");
require("dotenv").config();

const app = express();

const authRoutes = require("./routes/authRoutes.js");
// const spamRoute = require("./routes/spamRoutes.js");

const { connectMongoDB } = require("./controllers/connectMongoDB.js");
const spamRoute = require("./routes/spamRoutes.js");
const reportRoute = require("./routes/reportRoutes.js");

const tokenRoutes = require("./routes/tokenRoute.js");

// Initialize Passport
require("./Config/passport.js")(passport);

connectMongoDB(process.env.MONGO_URL);

//Middlewares
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport middleware
app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/spam-detection", spamRoute);
app.use("/api/report", reportRoute);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "ScamRadar API is running!", timestamp: new Date().toISOString() });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// const PORT = 5000;

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
