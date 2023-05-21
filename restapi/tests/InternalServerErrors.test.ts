require("dotenv").config();
import bp from "body-parser";
import express, { Application } from "express";
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
	await mongoose.connection.close();
});

const emailCorrecto = "test@test.com";

describe("Usuarios", () => {
	it("500 si hay error en el servidor", async () => {
		const response: Response = await request(app).get("/usuario/noExiste");

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	it("500 si hay error en el servidor", async () => {
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

	it("500 si hay error en el servidor", async () => {
		const response: Response = await request(app).post("/token").send({
			email: "No existe este usuario",
			contraseña: "contraseñaIncorrecta",
		});

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});

	it("False si hay error en el servidor", async () => {
		const response: boolean = await verifyUser(emailCorrecto, "");
		expect(response).toBe(false);
	});
});

describe("Equipos", () => {
	testGet500Error("/equipos");

	testGet500Error("/equipos/2820");
});

describe("Jugadores", () => {
	testGet500Error("/jugadores");

	testGet500Error("/jugadoresEquipo/2820");

	testGet500Error("/jugadores/1");

	testGet500Error("/jugadores/antiguos/2820/1");

	testPut500Error("/jugadores/3306");
});

describe("Ligas", () => {
	testGet500Error("/ligas/1");

	testGet500Error("/ligas/random/new");

	testGet500Error("/ligas/usuario/1");

	testPost500Error("/ligas");

	testPost500Error("/ligas/1");

	testDelete500Error("/ligas/1/1");
});

describe("Plantillas", () => {
	testGet500Error("/plantillas/1/1");

	testPost500Error("/plantillas/update");
});

describe("Partidos", () => {
	testGet500Error("/partidos/1");

	testGet500Error("/partidos/jornada/1");

	testGet500Error("/partidos/equipo/1");

	testGet500Error("/partidos/puntuaciones/1");

	testPut500Error("/partidos/10408559");
});

describe("Puntuaciones", () => {
	testGet500Error("/puntuaciones/1");

	testGet500Error("/puntuaciones/1/1");

	testPost500Error("/puntuaciones");
});

describe("Mercado", () => {
	testGet500Error("/mercado/resetmercado/1");

	testPost500Error("/mercado/pujar/1");

	testPost500Error("/mercado/anadir/1");

	testPost500Error("/mercado/aceptaroferta/1");

	testPost500Error("/mercado/rechazaroferta/1");

	testDelete500Error("/mercado/eliminar/1/1");

	testDelete500Error("/mercado/eliminarPuja/1/1");
});

function testDelete500Error(path: string) {
	it("Devuelve 500 si hay error en el servidor", async () => {
		const response: Response = await request(app).delete(path);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
}

function testPost500Error(path: string) {
	it("Devuelve 500 si hay error en el servidor", async () => {
		const response: Response = await request(app).post(path);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
}

function testGet500Error(path: string) {
	it("Devuelve 500 si hay error en el servidor", async () => {
		const response: Response = await request(app).get(path);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
}

function testPut500Error(path: string) {
	it("Devuelve 500 si hay error en el servidor", async () => {
		const response: Response = await request(app).put(path);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
}
