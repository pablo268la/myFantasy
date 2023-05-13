require("dotenv").config();
import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import { verifyUser } from "../controladores/usuariosController";
import { modeloEquipo } from "../model/equipo";
import { modeloJugador } from "../model/jugador";
import { modeloUsuario } from "../model/usuario";
import apiEquipos from "../routes/rutasEquipos";
import apiJugadores from "../routes/rutasJugador";
import apiLigas from "../routes/rutasLigas";
import apiMercado from "../routes/rutasMercado";
import apiPartidos from "../routes/rutasPartidos";
import apiPlantillas from "../routes/rutasPlantillas";
import apiPuntuaciones from "../routes/rutasPuntuaciones";
import apiUsuarios from "../routes/rutasUsuarios";
const mockingoose = require("mockingoose");

var server: Server;
const { v4: uuidv4 } = require("uuid");

let helmet = require("helmet");

const app: Application = express();

const mongoose = require("mongoose");
const connectionString =
	"mongodb+srv://pablo268la:iOv0N7wwYSI4Xiwy@cluster0.1n0snau.mongodb.net/?retryWrites=true&w=majority";

const options: cors.CorsOptions = {
	origin: ["http://localhost:3000"],
};

beforeAll(async () => {
	const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
	app.use(metricsMiddleware);

	app.use(bp.json());

	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));
	app.use(helmet.hidePoweredBy());

	app.use(apiJugadores);
	app.use(apiEquipos);
	app.use(apiUsuarios);
	app.use(apiLigas);
	app.use(apiPlantillas);
	app.use(apiMercado);
	app.use(apiPuntuaciones);
	app.use(apiPartidos);

	server = app.listen(5000);

	mongoose.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	mockingoose(modeloUsuario).toReturn(
		new Error("Error interno. Pruebe más tarde"),
		"findOne"
	);

	mockingoose(modeloEquipo)
		.toReturn(new Error("Error interno. Pruebe más tarde"), "findOne")
		.toReturn(new Error("Error interno. Pruebe más tarde"), "find");

	mockingoose(modeloJugador)
		.toReturn(new Error("Error interno. Pruebe más tarde"), "findOne")
		.toReturn(new Error("Error interno. Pruebe más tarde"), "find");
});

afterAll(async () => {
	server.close();
	mongoose.connection.close();
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
		const response: Boolean = await verifyUser(emailCorrecto, "");
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
