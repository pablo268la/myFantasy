import bp from "body-parser";
import express, { Application } from "express";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import apiEquipos from "../routes/rutasEquipos";

const mongoose = require("mongoose");
const app: Application = express();

beforeAll(async () => {
	app.use(bp.json());
	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));
	app.use(apiEquipos);

	
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
