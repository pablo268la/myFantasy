import bp from "body-parser";
import express, { Application } from "express";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import { modeloPartido } from "../model/partido";
import apiPartidos from "../routes/rutasPartidos";
import apiUsuarios from "../routes/rutasUsuarios";

const mongoose = require("mongoose");
const app: Application = express();
const mockingoose = require("mockingoose");

beforeAll(async () => {
	app.use(bp.json());
	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));

	app.use(apiPartidos);
	app.use(apiUsuarios);

	const container: MongoDBContainer = new MongoDBContainer().withReuse();
	const startedContainer = await container.start();
	await mongoose.connect(startedContainer.getConnectionString(), {
		directConnection: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		config: { autoIndex: false },
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("getJoranda", () => {
	/**
	 * Test: Devuelve 200 y la jornada actual
	 */
	it("Devuelve 200 y la jornada actual", async () => {
		mockingoose(modeloPartido).toReturn(
			[
				{ jornada: 1, fecha: new Date() },
				{ jornada: 2, fecha: new Date() },
				{ jornada: 3, fecha: new Date() },
				{
					jornada: 4,
					fecha: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
				},
                {
					jornada: 5,
					fecha: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
				},
			],

			"find"
		);

		const response: Response = await request(app).get("/jornada");

		expect(response.statusCode).toBe(200);
		expect(response.body).toBe(4);
	});

	/**
	 * Test: Devuelve 200 y -1 si no hay mas jornadas
	 */
	it("Devuelve 200 y -1 si no hay mas jornadas", async () => {
		mockingoose(modeloPartido).toReturn(
			[
				{ jornada: 1, fecha: new Date() },
				{ jornada: 2, fecha: new Date() },
				{ jornada: 3, fecha: new Date() },
			],
			"find"
		);

		const response: Response = await request(app).get("/jornada");

		expect(response.statusCode).toBe(200);
		expect(response.body).toBe(-1);
	});
});
