require("dotenv").config();
import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import apiEquipos from "./routes/rutasEquipos";
import apiJugadores from "./routes/rutasJugador";
import apiLigas from "./routes/rutasLigas";
import apiMercado from "./routes/rutasMercado";
import apiPlantillas from "./routes/rutasPlantillas";
import apiPuntuaciones from "./routes/rutasPuntuaciones";
import apiSofaScore from "./routes/rutasSofascoreMarca";
import apiUsuarios from "./routes/rutasUsuarios";

const mongoose = require("mongoose");

const path = require("path");
const fs = require("fs");

let helmet = require("helmet");

const app: Application = express();

const connectionString = process.env.MONGO_DB_URI;

const { spawn } = require("child_process");

const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use(bp.urlencoded({ extended: true, limit: "8mb" }));
app.use(morgan("dev"));

app.use(apiSofaScore);
app.use(apiJugadores);
app.use(apiEquipos);
app.use(apiUsuarios);
app.use(apiLigas);
app.use(apiPlantillas);
app.use(apiMercado);
app.use(apiPuntuaciones);

app.use(helmet.hidePoweredBy());

app
	.listen(5000, (): void => {
		console.log("Restapi listening on " + 5000 + " " + connectionString);
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
/*
const python = spawn("python", ["python/env/crawler.py", "arg1", "arg2", "arg3"], {
	shell: true,
});
python.stderr.pipe(process.stdout);

python.stdout.on("data", function (data: any) {
	console.log("Pipe data from python script ...");
	console.log(data.toString());
});

python.on("close", (code: any) => {
	console.log(`child process close all stdio with code ${code}`);
});
*/
