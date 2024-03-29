import bp from "body-parser";
import express, { Application } from "express";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import apiPartidos from "../routes/rutasPartidos";
import apiUsuarios from "../routes/rutasUsuarios";
import {
	token2,
	tokenAdmin,
	usuario2,
	usuarioAdmin,
} from "./testsObjectsHelper";

const mongoose = require("mongoose");
const randomstring = require("randomstring");
const app: Application = express();

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

describe("getPartido", () => {
	/**
	 * Test: Devuelve 200 un partido
	 */
	it("Devuelve 200 un partido", async () => {
		const response: Response = await request(app).get("/partidos/10408559");

		expect(response.statusCode).toBe(200);
		expect(response.body.local.nombre).toBe("Osasuna");
		expect(response.body.visitante.nombre).toBe("Sevilla");
		expect(response.body.resultadoLocal).toBe(2);
		expect(response.body.resultadoVisitante).toBe(1);
		expect(response.body.jornada).toBe(1);
	});

	/**
	 * Test: Devuelve 404 si no hay un partido
	 */
	it("Devuelve 404 si no hay un partido", async () => {
		const response: Response = await request(app).get("/partidos/0");

		expect(response.statusCode).toBe(404);
		expect(response.body.message).toBe("Partido no encontrado");
	});
});

describe("getPartidosJornada", () => {
	/**
	 * Test: Devuelve 200 los partidos de una jornada
	 */
	it("Devuelve 200 los partidos de una jornada", async () => {
		const response: Response = await request(app).get("/partidos/jornada/1");

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(10);
		expect(response.body[0].local.nombre).toBe("Osasuna");
		expect(response.body[0].visitante.nombre).toBe("Sevilla");
		expect(response.body[0].resultadoLocal).toBe(2);
		expect(response.body[0].resultadoVisitante).toBe(1);
		expect(response.body[0].jornada).toBe(1);
	});

	/**
	 * Test: Devuelve 404 si no hay partidos en una jornada
	 */
	it("Devuelve 404 si no hay partidos en una jornada", async () => {
		const response: Response = await request(app).get("/partidos/jornada/0");

		expect(response.statusCode).toBe(404);
		expect(response.body.message).toBe("Partidos no encontrados");
	});
});

describe("getPuntuacionesPartido", () => {
	/**
	 * Test: Devuelve 200 las puntuaciones de un partido
	 */
	it("Devuelve 200 las puntuaciones de un partido", async () => {
		const response: Response = await request(app).get(
			"/partidos/puntuaciones/10408559"
		);

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(46);
		expect(response.body[0].idPartido).toBe("10408559");
		expect(response.body[0].semana).toBe(1);
		expect(response.body[0].idEquipo).toBe("2833");
		expect(response.body[0].idEquipoRival).toBe("2820");
	});

	/**
	 * Test: Devuelve 404 si no hay puntuaciones de un partido
	 */
	it("Devuelve 404 si no hay puntuaciones de un partido", async () => {
		const response: Response = await request(app).get(
			"/partidos/puntuaciones/0"
		);

		expect(response.statusCode).toBe(404);
		expect(response.body.message).toBe("Partido no encontrado");
	});
});

describe("getPartidosEquipo", () => {
	/**
	 * Test: Devuelve 200 los partidos de un equipo
	 */
	it("Devuelve 200 los partidos de un equipo", async () => {
		const response: Response = await request(app).get("/partidos/equipo/2820");

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(38);
		expect(response.body[0].local.nombre).toBe("Osasuna");
		expect(response.body[0].visitante.nombre).toBe("Sevilla");
		expect(response.body[0].jornada).toBe(1);
	});

	/**
	 * Test: Devuelve 404 si no hay partidos de un equipo
	 */
	it("Devuelve 404 si no hay partidos de un equipo", async () => {
		const response: Response = await request(app).get("/partidos/equipo/0");

		expect(response.statusCode).toBe(404);
		expect(response.body.message).toBe("Partidos no encontrados");
	});
});

describe("updatePartido", () => {
	/**
	 * Test: Devuelve 401 si usuario no autenticado
	 */
	it("Devuelve 401 si usuario no autenticado", async () => {
		const response: Response = await request(app)
			.put("/partidos/10408559")
			.send({ resultadoLocal: 3, resultadoVisitante: 2 });

		expect(response.statusCode).toBe(401);
		expect(response.body.message).toBe("Usuario no autenticado");
	});

	/**
	 * Test: Devuelve 403 si usuario no administrador
	 */
	it("Devuelve 403 si usuario no administrador", async () => {
		const response: Response = await request(app)
			.put("/partidos/10408559")
			.set("email", usuario2.email)
			.set("token", token2)
			.send({ resultadoLocal: 3, resultadoVisitante: 2 });

		expect(response.statusCode).toBe(403);
		expect(response.body.message).toBe("Usuario no administrador");
	});

	/**
	 * Test: Devuelve 200 si partido actualizado
	 */
	it("Devuelve 200 si partido actualizado", async () => {
		const newLink = randomstring.generate(10);
		const response: Response = await request(app)
			.put("/partidos/10408559")
			.set("email", usuarioAdmin.email)
			.set("token", tokenAdmin)
			.send({ linkSofaScore: newLink });

		expect(response.statusCode).toBe(200);
		expect(response.body.linkSofaScore).toBe(newLink);
	});

	/**
	 * Test: Devuelve 404 si no hay partido
	 */
	it("Devuelve 404 si no hay partido", async () => {
		const response: Response = await request(app)
			.put("/partidos/0")
			.set("email", usuarioAdmin.email)
			.set("token", tokenAdmin)
			.send({ resultadoLocal: 3, resultadoVisitante: 2 });

		expect(response.statusCode).toBe(404);
		expect(response.body.message).toBe("Partido no encontrado");
	});
});
