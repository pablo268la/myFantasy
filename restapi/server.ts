require("dotenv").config();
import bp from "body-parser";
import cors from "cors";
import express, { RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import apiEquipos from "./routes/rutasEquipos";
import apiJugadores from "./routes/rutasJugador";
import apiLigas from "./routes/rutasLigas";
import apiMercado from "./routes/rutasMercado";
import apiPartidos from "./routes/rutasPartidos";
import apiPlantillas from "./routes/rutasPlantillas";
import apiPuntuaciones from "./routes/rutasPuntuaciones";
//import apiSofaScore from "./routes/rutasSofascoreMarca";
import apiUsuarios from "./routes/rutasUsuarios";

import swaggerDocs from "./docs/swagger";
import mockRutas from "./routes/rutasMock";

const mongoose = require("mongoose");

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let helmet = require("helmet");

const app = express();

const connectionString = process.env.MONGO_DB_URI;

const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use(bp.urlencoded({ extended: true, limit: "8mb" }));
app.use(morgan("dev"));

//app.use(apiSofaScore);
app.use(apiJugadores);
app.use(apiEquipos);
app.use(apiUsuarios);
app.use(apiLigas);
app.use(apiPlantillas);
app.use(apiMercado);
app.use(apiPuntuaciones);
app.use(apiPartidos);

app.use(helmet.hidePoweredBy());

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

app
	.listen(5000, (): void => {
		console.log("Restapi listening on " + 5000 + " " + connectionString);
		mockRutas(app);
		swaggerDocs(app, 5000);
	})
	.on("error", (error: Error) => {
		console.error("Error occured: " + error.message);
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
