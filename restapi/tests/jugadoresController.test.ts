import bp from "body-parser";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import * as jwt from "jsonwebtoken";
import morgan from "morgan";
import request, { Response } from "supertest";
import { modeloJugador } from "../model/jugador";
import { IUsuario } from "../model/usuario";
import apiJugadores from "../routes/rutasJugador";
import apiUsuarios from "../routes/rutasUsuarios";

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

	app.use(apiJugadores);
	app.use(apiUsuarios);
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

const usuarioAdmin: IUsuario = {
	id: "d796014e-717f-4cd9-9f66-422546a0116b",
	nombre: "Test",
	usuario: "TestFantasy",
	email: "test@test.com",
	contraseña: "$2b$10$HCAC1lBDt/uypoJw5f/rCe.yd4q23BnJFNx.s53JVF/VuOkEXXmBC",
	ligas: [],
	admin: true,
};
const tokenAdmin = jwt.sign(
	{ id: usuarioAdmin.id },
	process.env.JWT_SECRET || "secret"
);

const usuario2: IUsuario = {
	id: "d796014e-717f-4cd9-9f66-422546a0116a",
	nombre: "Test2",
	usuario: "TestFantasy2",
	email: "test2@test.com",
	contraseña: "$2b$10$HCAC1lBDt/uypoJw5f/rCe.yd4q23BnJFNx.s53JVF/VuOkEXXmBC",
	ligas: [],
	admin: false,
};
const token2 = jwt.sign(
	{ id: usuario2.id },
	process.env.JWT_SECRET || "secret"
);

describe("getJugadores", () => {
	/**
	 * Test: Devuelve 200 todos los jugadores
	 */
	it("200 todos los jugadores", async () => {
		const response: Response = await request(app).get("/jugadores");

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(27);
	});
});

describe("getJugadoresEquipo", () => {
	/*
	 * Test: Devuelve 200 los jugadores del equipo con el id indicado
	 */
	it("200 los jugadores del equipo con el id indicado", async () => {
		const response: Response = await request(app).get("/jugadoresEquipo/2820");

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(25);
	});
});

describe("getJugador", () => {
	/*
	 * Test: Devuelve 200 el jugador con el id indicado
	 */
	it("200 el jugador con el id indicado", async () => {
		const response: Response = await request(app).get("/jugadores/3306");

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			_id: "3306",
			nombre: "Karim Benzema",
			slug: "karim-benzema",
			posicion: "Delantero",
			valor: 26000000,
			puntos: 0,
			estado: "Dudoso",
			foto: "https://assets.laligafantasymarca.com/players/t186/p250/256x256/p250_t186_1_001_000.png",
			fantasyMarcaId: "250",
			equipo: {
				_id: "2829",
				nombre: "Real Madrid",
				slug: "real-madrid",
				shortName: "Real Madrid",
				escudo: "https://api.sofascore.app/api/v1/team/2829/image",
			},
		});
	});

	/*
	 * Test: Devuelve 404 si no existe el jugador
	 */
	it("404 si no existe el jugador", async () => {
		const response: Response = await request(app).get("/jugadores/0");

		expect(response.statusCode).toBe(404);
		expect(response.body).toEqual({
			message: "Jugador no encontrado",
		});
	});
});

describe("getJugadoresAntiguos", () => {
	/*
	 * Test: Devuelve 200 los jugadores antiguos del equipo con el id indicado
	 */
	it("200 los jugadores antiguos del equipo con el id indicado", async () => {
		const response: Response = await request(app).get(
			"/jugadores/antiguos/2846/5"
		);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(1);
		expect(response.body[0]).toEqual(
			expect.objectContaining({
				_id: "344847",
				equipo: {
					_id: "2819",
					escudo: "https://api.sofascore.app/api/v1/team/2819/image",
					nombre: "Villarreal",
					shortName: "Villarreal",
					slug: "villarreal",
				},
				estado: "Disponible",
				fantasyMarcaId: "1200",
				foto: "https://assets.laligafantasymarca.com/players/t449/p1200/256x256/p1200_t449_1_001_000.png",
				nombre: "Johan Mojica",
				posicion: "Defensa",
				puntos: 0,
				slug: "johan-mojica",
				valor: 2800000,
			})
		);
	});
});

describe("updateJugador", () => {
	/**
	 * Test: Devuelve 401 si usuario no autenticado
	 */
	it("401 si usuario no autenticado", async () => {
		const response: Response = await request(app).put("/jugadores/3306").set({
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
	it("401 si usuario no administrador", async () => {
		const response: Response = await request(app).put("/jugadores/1").set({
			email: usuario2.email,
			token: token2,
		});

		expect(response.statusCode).toBe(401);
		expect(response.body).toEqual({
			message: "Usuario no autorizado",
		});
	});

	/**
	 * Test: Devuelve 404 si no existe el jugador
	 */
	it("404 si no existe el jugador", async () => {
		const response: Response = await request(app).put("/jugadores/1").set({
			email: usuarioAdmin.email,
			token: tokenAdmin,
		});

		expect(response.statusCode).toBe(404);
		expect(response.body).toEqual({
			message: "Jugador no encontrado",
		});
	});

	/**
	 * Test: Devuelve 200 si actualiza el jugador
	 */
	it("200 si actualiza el jugador", async () => {
		const response: Response = await request(app)
			.put("/jugadores/3306")
			.set({
				email: usuarioAdmin.email,
				token: tokenAdmin,
			})
			.send({
				equipo: {
					_id: "2829",
					nombre: "Real Madrid",
					slug: "real-madrid",
					shortName: "Real Madrid",
					escudo: "https://api.sofascore.app/api/v1/team/2829/image",
				},
				puntos: 10,
			});

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				_id: "3306",
				nombre: "Karim Benzema",
				slug: "karim-benzema",
				posicion: "Delantero",
				valor: 26000000,
				estado: "Dudoso",
				foto: "https://assets.laligafantasymarca.com/players/t186/p250/256x256/p250_t186_1_001_000.png",
				fantasyMarcaId: "250",
				equipo: {
					_id: "2829",
					nombre: "Real Madrid",
					slug: "real-madrid",
					shortName: "Real Madrid",
					escudo: "https://api.sofascore.app/api/v1/team/2829/image",
				},
				puntos: 10,
			})
		);
	});

	/**
	 * Test: Devuelve 200 si actualiza el jugador y le cambia el equipo
	 */
	it("200 si actualiza el jugador y le cambia el equipo", async () => {
		const mockJuagador = new modeloJugador({
			_id: "0",
			nombre: "Foo",
			slug: "Foo",
			posicion: "Delantero",
			valor: 0,
			estado: "Disponible",
			foto: "",
			fantasyMarcaId: "0",
			equipo: {
				_id: "2829",
				nombre: "Real Madrid",
				slug: "real-madrid",
				shortName: "Real Madrid",
				escudo: "https://api.sofascore.app/api/v1/team/2829/image",
			},
			puntos: 0,
		});

		await mockJuagador.save();

		const response: Response = await request(app)
			.put("/jugadores/0")
			.set({
				email: usuarioAdmin.email,
				token: tokenAdmin,
			})
			.send({
				equipo: {
					_id: "2817",
					nombre: "Barcelona",
					slug: "barcelona",
					shortName: "Barcelona",
					escudo: "https://api.sofascore.app/api/v1/team/2817/image",
				},
				puntos: 10,
			});

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				_id: "0",
				nombre: "Foo",
				slug: "Foo",
				posicion: "Delantero",
				valor: 0,
				estado: "Disponible",
				foto: "",
				fantasyMarcaId: "0",
				equipo: {
					_id: "2817",
					nombre: "Barcelona",
					slug: "barcelona",
					shortName: "Barcelona",
					escudo: "https://api.sofascore.app/api/v1/team/2817/image",
				},
				puntos: 10,
			})
		);

		await modeloJugador.deleteOne({ _id: "0" }).then((res) => {
			console.log(res);
		});
	});

	/**
	 * Test: Devuelve 500 si error interno. Caso: No hay equipo._id en el response
	 */
	it("500 si error interno. Caso: No hay equipo._id en el response", async () => {
		const response: Response = await request(app)
			.put("/jugadores/3306")
			.set({
				email: usuarioAdmin.email,
				token: tokenAdmin,
			})
			.send({
				puntos: 10,
			});

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			message: "Error interno. Pruebe más tarde",
		});
	});
});
