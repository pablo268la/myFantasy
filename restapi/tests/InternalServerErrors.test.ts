require("dotenv").config();
import bp from "body-parser";
import express, { Application } from "express";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import { verifyUser } from "../controladores/usuariosController";
import { modeloEquipo } from "../model/equipo";
import { modeloJugador } from "../model/jugador";
import { modeloLiga } from "../model/liga";
import { modeloPartido } from "../model/partido";
import { modeloUsuario } from "../model/usuario";
import apiEquipos from "../routes/rutasEquipos";
import apiJugadores from "../routes/rutasJugador";
import apiLigas from "../routes/rutasLigas";
import apiMercado from "../routes/rutasMercado";
import apiPartidos from "../routes/rutasPartidos";
import apiPlantillas from "../routes/rutasPlantillas";
import apiPuntuaciones from "../routes/rutasPuntuaciones";
import apiUsuarios from "../routes/rutasUsuarios";

const app: Application = express();
let server: Server;
const mockingoose = require("mockingoose");
const mongoose = require("mongoose");

beforeAll(async () => {
	app.use(bp.json());
	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));
	app.use(apiJugadores);
	app.use(apiEquipos);
	app.use(apiUsuarios);
	app.use(apiLigas);
	app.use(apiPlantillas);
	app.use(apiMercado);
	app.use(apiPuntuaciones);
	app.use(apiPartidos);

	server = app.listen(5000);

	const container: MongoDBContainer = new MongoDBContainer().withReuse();
	const startedContainer = await container.start();
	await mongoose.connect(startedContainer.getConnectionString(), {
		directConnection: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		config: { autoIndex: false },
	});

	mockingoose(modeloUsuario)
		.toReturn(new Error("Error interno. Pruebe más tarde"), "findOne")
		.toReturn(new Error("Error interno. Pruebe más tarde"), "find");

	mockingoose(modeloEquipo)
		.toReturn(new Error("Error interno. Pruebe más tarde"), "findOne")
		.toReturn(new Error("Error interno. Pruebe más tarde"), "find");

	mockingoose(modeloJugador)
		.toReturn(new Error("Error interno. Pruebe más tarde"), "findOne")
		.toReturn(new Error("Error interno. Pruebe más tarde"), "find");

	mockingoose(modeloLiga)
		.toReturn(new Error("Error interno. Pruebe más tarde"), "findOne")
		.toReturn(new Error("Error interno. Pruebe más tarde"), "find");

	mockingoose(modeloPartido)
		.toReturn(new Error("Error interno. Pruebe más tarde"), "findOne")
		.toReturn(new Error("Error interno. Pruebe más tarde"), "find");
});

afterAll(async () => {
	server.close();
	await mongoose.connection.close();
});

const emailCorrecto = "test@test.com";

describe("Usuarios", () => {
	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/usuario/noExiste");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).post("/usuario").send({
			id: "1",
			nombre: "Prueba",
			usuario: "Usuario de prueba",
			contraseña: "SoyNuevo123",
			email: "test@test.com",
			ligas: [],
			admin: false,
		});

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).post("/token").send({
			email: "No existe este usuario",
			contraseña: "contraseñaIncorrecta",
		});

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve False si el servidor esta caido
	 */
	it("False si el servidor esta caido", async () => {
		const response: boolean = await verifyUser(emailCorrecto, "");
		expect(response).toBe(false);
	});
});

describe("Equipos", () => {
	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/equipos");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/equipos/2820");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
});

describe("Jugadores", () => {
	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/jugadores");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/jugadoresEquipo/2820");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/jugadores/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get(
			"/jugadores/antiguos/2820/1"
		);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
});

describe("Ligas", () => {
	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/ligas/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/ligas/random/new");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/ligas/usuario/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).post("/ligas");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).post("/ligas/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
});

describe("Plantillas", () => {
	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/plantillas/1/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).post("/plantillas/update");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
});

describe("Partidos", () => {
	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response: Response = await request(app).get("/partidos/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response = await request(app).get("/partidos/jornada/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response = await request(app).get("/partidos/equipo/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si el servidor esta caido
	 */
	it("500 si el servidor esta caido", async () => {
		const response = await request(app).get("/partidos/puntuaciones/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si hay error en el servidor
	 */
	it("Devuelve 500 si hay error en el servidor", async () => {
		const response: Response = await request(app).put("/partidos/10408559");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
});

describe("Puntuaciones", () => {
	/**
	 * Test: Devuelve 500 si hay error en el servidor
	 */
	it("Devuelve 500 si hay error en el servidor", async () => {
		const response: Response = await request(app).get("/puntuaciones/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si hay error en el servidor
	 */
	it("Devuelve 500 si hay error en el servidor", async () => {
		const response: Response = await request(app).get("/puntuaciones/1/1");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	/**
	 * Test: Devuelve 500 si hay error en el servidor
	 */
	it("Devuelve 500 si hay error en el servidor", async () => {
		const response: Response = await request(app).post("/puntuaciones");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
});
