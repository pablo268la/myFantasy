require("dotenv").config();
import bp from "body-parser";
import cors from "cors";
import express, { Request, RequestHandler, Response } from "express";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import client from "prom-client";
import responseTime from "response-time";
import swaggerDocs from "./docs/swagger";
import { restResponseTimeHistogram, restResponseTimeSummary } from "./monitoring/prometheus/metrics";
import apiEquipos from "./routes/rutasEquipos";
import apiJugadores from "./routes/rutasJugador";
import apiLigas from "./routes/rutasLigas";
import apiMercado from "./routes/rutasMercado";
import apiPartidos from "./routes/rutasPartidos";
import apiPlantillas from "./routes/rutasPlantillas";
import apiPuntuaciones from "./routes/rutasPuntuaciones";
import apiUsuarios from "./routes/rutasUsuarios";

const mongoose = require("mongoose");
let helmet = require("helmet");

const app = express();

const connectionString = process.env.MONGO_DB_URI;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use(bp.urlencoded({ extended: true, limit: "8mb" }));
app.use(morgan("dev"));

app.use(
	responseTime((req: Request, res: Response, time: number) => {
		if (req?.route?.path) {
			restResponseTimeHistogram.observe(
				{
					method: req.method,
					route: req.route.path,
					status_code: res.statusCode,
				},
				time * 1000
			);

			restResponseTimeSummary.observe(
				{
					method: req.method,
					route: req.route.path,
					status_code: res.statusCode,
				},
				time * 1000
			);
		}
	})
);

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
		swaggerDocs(app, 5000);
		console.log("Restapi listening on " + 5000 + " " + connectionString);
	})
	.on("error", (error: Error) => {
		console.error("Error occured: " + error.message);
	});
