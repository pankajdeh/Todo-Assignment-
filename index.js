// Importing necessary modules and packages
const express = require("express");
const app = express();
const taskr = require("./Routes/taskr");
const subTaskr = require("./Routes/taskr");
const userr = require("./Routes/userr");

const dotenv = require("dotenv");
const database = require("./Config/database");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setting up port number
const PORT = process.env.PORT || 3000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();

 
// Middlewares
app.use(express.json());
app.use(express.urlencoded({

    extended: true
    
    }));
// app.use(
// 	cors({
// 		origin: "*",
// 		credentials: true,
// 	})
// );


// Setting up routes
app.use("/api/v1/task", taskr);
app.use("/api/v1/subtask",subTaskr);
app.use("/api/v1/user", userr);


// Testing the server
// app.get("/", (req, res) => {
// 	return res.json({
// 		success: true,
// 		message: "Your server is up and running ...",
// 	});
// });


// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.
