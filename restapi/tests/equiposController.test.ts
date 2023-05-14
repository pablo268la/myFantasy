import bp from "body-parser";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import apiEquipos from "../routes/rutasEquipos";
const mongoose = require("mongoose");
const helmet = require("helmet");

const app: Application = express();
var server: Server;

const connectionString =
	"mongodb+srv://pablo268la:iOv0N7wwYSI4Xiwy@cluster0.1n0snau.mongodb.net/?retryWrites=true&w=majority";

beforeAll(async () => {
	const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
	app.use(metricsMiddleware);

	app.use(bp.json());

	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));

	app.use(apiEquipos);
	app.use(helmet.hidePoweredBy());

	server = app.listen(5000);

	mongoose.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

afterAll(async () => {
	server.close();
	mongoose.connection.close();
});

describe("getEquipos", () => {
	/**
	 * Test: Devuelve 200 todos los equipos
	 */
	it("200 todos los equipos", async () => {
		const response: Response = await request(app).get("/equipos");

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(20);
	});
});

describe("getEquipo", () => {
	/*
	 * Test: Devuelve 200 el equipo con el id indicado
	 */
	it("200 el equipo con el id indicado", async () => {
		const response: Response = await request(app).get("/equipos/2820");

		expect(response.statusCode).toBe(200);

		expect(response.body.id).toEqual("2820");
		expect(response.body.nombre).toEqual("Osasuna");
	});

	/*
	 * Test: Devuelve 404 si no existe el equipo con el id indicado
	 */
	it("404 si no existe el equipo con el id indicado", async () => {
		const response: Response = await request(app).get("/equipos/999999");

		expect(response.statusCode).toBe(404);
		expect(response.body.message).toBe("Equipo no encontrado");
	});
});
