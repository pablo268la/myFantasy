import bp from "body-parser";
import express, { Application } from "express";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import { createPuntuacionJugadorVacia } from "../helpers/puntuacionHelper";
import { modelPuntuacionJugador } from "../model/puntuacion/puntuacionJugador";
import apiPuntuaciones from "../routes/rutasPuntuaciones";
import apiUsuarios from "../routes/rutasUsuarios";
import {
	token2,
	tokenAdmin,
	usuario2,
	usuarioAdmin,
} from "./testsObjectsHelper";

const mongoose = require("mongoose");
const app: Application = express();

beforeAll(async () => {
	app.use(bp.json());
	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));
	app.use(apiPuntuaciones);
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
	await modelPuntuacionJugador.deleteOne({ id: "3306-1" });

	await mongoose.connection.close();
});

describe("getPuntuacionesJugador", () => {
	/**
	 * Test: Devuelve 200 todas las puntuaciones de un jugador
	 */
	it("200 todas las puntuaciones de un jugador", async () => {
		const response: Response = await request(app).get("/puntuaciones/3306");

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(38);
		expect(response.body[0].idJugador).toBe("3306");
		expect(response.body[0].idPartido).toBe("10408712");
		expect(response.body[0].semana).toBe(1);
		expect(response.body[0].puntos).toBe(11);
		expect(response.body[0].idEquipo).toBe("2829");
		expect(response.body[0].idEquipoRival).toBe("2858");
		expect(response.body[37].idJugador).toBe("3306");
		expect(response.body[37].idPartido).toBe("");
		expect(response.body[37].semana).toBe(38);
		expect(response.body[37].puntos).toBe(0);
		expect(response.body[37].idEquipo).toBe("2829");
		expect(response.body[37].idEquipoRival).toBe("");
	});

	/**
	 * Test: Devuelve 200 array vacio si no existe el jugador
	 */
	it("200 array vacio si no existe el jugador", async () => {
		const response: Response = await request(app).get("/puntuaciones/0");

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(0);
	});
});

describe("getPuntuacionesJugadorJornada", () => {
	/**
	 * Test: Devuelve 200 la puntuacion de un jugador en una jornada
	 */
	it("200 la puntuacion de un jugador en una jornada", async () => {
		const response: Response = await request(app).get("/puntuaciones/3306/1");

		expect(response.statusCode).toBe(200);
		expect(response.body.idJugador).toBe("3306");
		expect(response.body.idPartido).toBe("10408712");
		expect(response.body.puntos).toBe(11);
		expect(response.body.idEquipo).toBe("2829");
		expect(response.body.idEquipoRival).toBe("2858");
	});

	/**
	 * Test: Devuelve 200 la puntuacion de un jugador vacia en una jornada aun por jugar
	 */
	it("200 la puntuacion de un jugador vacia en una jornada aun por jugar", async () => {
		const response: Response = await request(app).get("/puntuaciones/3306/38");

		expect(response.statusCode).toBe(200);
		expect(response.body.idJugador).toBe("3306");
		expect(response.body.idPartido).toBe("");
		expect(response.body.puntos).toBe(0);
		expect(response.body.idEquipo).toBe("2829");
		expect(response.body.idEquipoRival).toBe("");
	});

	/**
	 * Test: Devuelve 404 si no existe jugador
	 */
	it("404 si no existe jugador", async () => {
		const response: Response = await request(app).get("/puntuaciones/0/0");

		expect(response.statusCode).toBe(404);
		expect(response.body.message).toBe("Jugador no encontrado");
	});

	/**
	 * Test: Devuelve 404 si no existe jornada
	 */
	it("404 si no existe jornada", async () => {
		const response: Response = await request(app).get("/puntuaciones/3306/0");

		expect(response.statusCode).toBe(404);
		expect(response.body.message).toBe("Semana no encontrada");
	});
});

describe("updateJugador", () => {
	/**
	 * Test: Devuelve 401 si usuario no autenticado
	 */
	it("401 si usuario no autenticado", async () => {
		const response: Response = await request(app).post("/puntuaciones").set({
			email: "",
			token: "",
		});

		expect(response.statusCode).toBe(401);
		expect(response.body).toEqual({
			message: "Usuario no autenticado",
		});
	});

	/**
	 * Test: Devuelve 401 si usuario no administrador
	 */
	it("403 si usuario no administrador", async () => {
		const response: Response = await request(app).post("/puntuaciones").set({
			email: usuario2.email,
			token: token2,
		});

		expect(response.statusCode).toBe(403);
		expect(response.body).toEqual({
			message: "Usuario no administrador",
		});
	});

	/**
	 * Test: Devuelve 404 si no existe el jugador
	 */
	it("404 si no existe el jugador", async () => {
		const response: Response = await request(app)
			.post("/puntuaciones")
			.set({
				email: usuarioAdmin.email,
				token: tokenAdmin,
			})
			.send(createPuntuacionJugadorVacia("0", 1, "0"));

		expect(response.statusCode).toBe(404);
		expect(response.body).toEqual({
			message: "Jugador no encontrado",
		});
	});

	/**
	 * Test: Devuelve 200 si crea una nueva puntuacion
	 */
	it("200 si crea una nueva puntuacion", async () => {
		const p = createPuntuacionJugadorVacia("3306", 10, "2829");
		p.idPartido = "1";
		p.idEquipoRival = "1";
		const response: Response = await request(app)
			.post("/puntuaciones")
			.set({
				email: usuarioAdmin.email,
				token: tokenAdmin,
			})
			.send(p);

		expect(response.statusCode).toBe(200);
		expect(response.statusCode).toBe(200);
		expect(response.body.idJugador).toBe("3306");
		expect(response.body.idPartido).toBe("1");
		expect(response.body.semana).toBe(10);
		expect(response.body.puntos).toBe(0);
		expect(response.body.idEquipo).toBe("2829");
		expect(response.body.idEquipoRival).toBe("1");
	});

	/**
	 * Test: Devuelve 200 si actualiza una puntuacion
	 */
	it("200 si actualiza una puntuacion", async () => {
		const p = createPuntuacionJugadorVacia("3306", 10, "2829");
		p.idPartido = "1";
		p.idEquipoRival = "1234";
		const response: Response = await request(app)
			.post("/puntuaciones")
			.set({
				email: usuarioAdmin.email,
				token: tokenAdmin,
			})
			.send(p);

		expect(response.statusCode).toBe(200);
		expect(response.statusCode).toBe(200);
		expect(response.body.idJugador).toBe("3306");
		expect(response.body.idPartido).toBe("1");
		expect(response.body.semana).toBe(10);
		expect(response.body.puntos).toBe(0);
		expect(response.body.idEquipo).toBe("2829");
		expect(response.body.idEquipoRival).toBe("1234");
	});
});
