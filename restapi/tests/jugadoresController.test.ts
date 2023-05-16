import bp from "body-parser";
import express, { Application } from "express";
import * as jwt from "jsonwebtoken";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import { modeloJugador } from "../model/jugador";
import { IUsuario } from "../model/usuario";
import apiJugadores from "../routes/rutasJugador";
import apiUsuarios from "../routes/rutasUsuarios";

const mongoose = require("mongoose");
const app: Application = express();

beforeAll(async () => {
	app.use(bp.json());
	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));
	app.use(apiJugadores);
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
	await modeloJugador.deleteOne({ id: "0" });

	
	await mongoose.connection.close();
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

		expect(response.body.id).toEqual("3306");
		expect(response.body.nombre).toEqual("Karim Benzema");
		expect(response.body.equipo.id).toEqual("2829");
		expect(response.body.equipo.nombre).toEqual("Real Madrid");
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
		expect(response.body[0].id).toEqual("344847");
		expect(response.body[0].nombre).toEqual("Johan Mojica");
		expect(response.body[0].equipo.id).toEqual("2819");
		expect(response.body[0].equipo.nombre).toEqual("Villarreal");
		expect(response.body[0].jugadorAntiguo.equipo.id).toEqual("2846");
		expect(response.body[0].jugadorAntiguo.equipo.nombre).toEqual("Elche CF");
		expect(response.body[0].jugadorAntiguo.jornadaTraspaso).toEqual(4);
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
		const randomPoints = new Date().getTime() / 100000;

		const response: Response = await request(app)
			.put("/jugadores/3306")
			.set({
				email: usuarioAdmin.email,
				token: tokenAdmin,
			})
			.send({
				equipo: {
					id: "2829",
					nombre: "Real Madrid",
					slug: "real-madrid",
					shortName: "Real Madrid",
					escudo: "https://api.sofascore.app/api/v1/team/2829/image",
				},
				puntos: randomPoints,
			});

		expect(response.statusCode).toBe(200);
		expect(response.body.id).toEqual("3306");
		expect(response.body.nombre).toEqual("Karim Benzema");
		expect(response.body.equipo.id).toEqual("2829");
		expect(response.body.equipo.nombre).toEqual("Real Madrid");
		expect(response.body.puntos).toEqual(randomPoints);
	});

	/**
	 * Test: Devuelve 200 si actualiza el jugador y le cambia el equipo
	 */
	it("200 si actualiza el jugador y le cambia el equipo", async () => {
		const mockJuagador = new modeloJugador({
			id: "0",
			nombre: "Foo",
			slug: "Foo",
			posicion: "Delantero",
			valor: 0,
			estado: "Disponible",
			foto: "",
			fantasyMarcaId: "0",
			equipo: {
				id: "2829",
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
					id: "2817",
					nombre: "Barcelona",
					slug: "barcelona",
					shortName: "Barcelona",
					escudo: "https://api.sofascore.app/api/v1/team/2817/image",
				},
				puntos: 10,
			});

		expect(response.statusCode).toBe(200);

		expect(response.body.id).toEqual("0");
		expect(response.body.nombre).toEqual("Foo");
		expect(response.body.equipo.id).toEqual("2817");
		expect(response.body.equipo.nombre).toEqual("Barcelona");
		expect(response.body.jugadorAntiguo.equipo.id).toEqual("2829");
		expect(response.body.jugadorAntiguo.equipo.nombre).toEqual("Real Madrid");
		expect(response.body.jugadorAntiguo.jornadaTraspaso).toEqual(1);
	});

	/**
	 * Test: Devuelve 500 si error interno. Caso: No hay equipo.id en el response
	 */
	it("500 si error interno. Caso: No hay equipo.id en el response", async () => {
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
