const express = require("express");
const app = express();
const port = 3000;
const useragent = require("express-useragent");
app.use(useragent.express());
app.use(express.json());

//log files writing
const fs = require("fs");
const morgan = require("morgan");

var accessLogStream = fs.createWriteStream("./logs/access.log", {
	flags: "a"
});
app.use(
	morgan("combined", {
		stream: accessLogStream
	})
); //log files writing
const mongoose = require("./config/db-config");

app.get("/", (req, res) => {
	res.send("Welcome to URL Shrotner");
});

const { urls } = require("./app/controllers/bookmark_controler");
const { userrouters } = require("./app/controllers/user_controler");

app.use("/", urls);
app.use("/users", userrouters);

app.use(function(req, res) {
	// res.sendStatus(404);
	res.status(404);
	res.send("The resource you are looking for doesn’t exist.");
});

app.listen(port, () => {
	console.log("listining from", port);
});
