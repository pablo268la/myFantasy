require("dotenv").config();
import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import apiSofaScore from "./routes/routesSofascore";

const mongoose = require("mongoose");

const path = require("path");
const fs = require("fs");

let helmet = require("helmet");

const app: Application = express();

const connectionString = process.env.MONGO_DB_URI;

const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use(bp.urlencoded({ extended: true, limit: "8mb" }));
app.use(morgan("dev"));

app.use(apiSofaScore);

app.use(helmet.hidePoweredBy());

app
	.listen(5000, (): void => {
		console.log("Restapi listening on " + 5000);
	})
	.on("error", (error: Error) => {
		console.error("Error occured: " + error.message);
	});

mongoose
	.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		config: { autoIndex: false },
	})
	.then(async () => {
		console.log("Database connected");
	})
	.catch((err: Error) => {
		console.error(err);
	});
