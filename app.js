const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

mongoose.connect("mongodb+srv://NikolaMilicevic:" + process.env.MONGO_PASS + "@nikolamilicevic-zpnhb.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});


app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Handling CORS errors
app.use((req,res,next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	if(req.method === "OPTIONS"){
		res.header("Access-Control-Allow-Method", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});
//Handling CORS errors


app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

//Handle Error
app.use((req, res,next) => {
	const error = new Error("Not Found!");
	error.status = 404;
	next(error);
});

app.use((error, req,res,next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});
//Handle Error

module.exports = app;