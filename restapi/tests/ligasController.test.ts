import bp from "body-parser";
import express, { Application } from "express";
import * as jwt from "jsonwebtoken";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import * as UUID from "uuid";
import { modeloAlineacionJugador } from "../model/alineacionJugador";
import { ILiga, modeloLiga } from "../model/liga";
import { modeloPlantillaUsuario } from "../model/plantillaUsuario";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { IUsuario, modeloUsuario } from "../model/usuario";
import apiLigas from "../routes/rutasLigas";
import apiUsuarios from "../routes/rutasUsuarios";

const randomstring = require("randomstring");
const mongoose = require("mongoose");

const app: Application = express();

beforeAll(async () => {
	app.use(bp.json());
	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));
	app.use(apiLigas);
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
	await modeloUsuario.deleteOne({ email: usuario4.email });
	await modeloUsuario.deleteOne({ email: usuario5Ligas.email });
	await modeloLiga.deleteOne({ id: "1234" });
	await modeloLiga.deleteOne({ id: "5678" });

	
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

const usuario5Ligas: IUsuario = {
	id: "d796014e-717f-4cd9-9f66-422546a0116c",
	nombre: "Test3",
	usuario: "TestFantasy3",
	email: "test3@test.com",
	contraseña: "$2b$10$HCAC1lBDt/uypoJw5f/rCe.yd4q23BnJFNx.s53JVF/VuOkEXXmBC",
	ligas: ["1", "2", "3", "4", "5"],
	admin: false,
};
const token5ligas = jwt.sign(
	{ id: usuario5Ligas.id },
	process.env.JWT_SECRET || "secret"
);

const usuario4: IUsuario = {
	id: "d796014e-717f-4cd9-9f66-422546a0116d",
	nombre: "Test4",
	usuario: "TestFantasy4",
	email: "test4@test.com",
	contraseña: "$2b$10$HCAC1lBDt/uypoJw5f/rCe.yd4q23BnJFNx.s53JVF/VuOkEXXmBC",
	ligas: [],
	admin: false,
};
const token4 = jwt.sign(
	{ id: usuario4.id },
	process.env.JWT_SECRET || "secret"
);

describe("createLiga", () => {
	/**
	 * Test: Devuelve 201 si se crea la liga correctamente
	 */
	it("Devuelve 201 si se crea la liga correctamente", async () => {
		await new modeloUsuario(usuario4).save();

		const response: Response = await request(app)
			.post("/ligas")
			.set({ email: usuario4.email, token: token4 })
			.send({
				liga: {
					id: "1234",
					nombre: "Liga de prueba",
					plantillasUsuarios: [],
					propiedadJugadores: [],
					maxJugadores: 3,
					enlaceInvitacion: "join-to:1234",
					mercado: [],
				},
			});

		expect(response.status).toBe(201);
		expect(response.body.nombre).toEqual("Liga de prueba");
		expect(response.body.maxJugadores).toEqual(3);
		expect(response.body.enlaceInvitacion).toEqual("join-to:1234");
		expect(response.body.mercado).toHaveLength(10);
	});
});

describe("añadirUsuarioALiga", () => {
	/**
	 * Test: Devuelve 401 si el usuario no está autenticado
	 */
	it("Devuelve 401 si el usuario no está autenticado", async () => {
		const response: Response = await request(app).post("/ligas/1234");

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: "Usuario no autenticado" });
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.post("/ligas/NoLiga")
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Liga no encontrada" });
	});

	/**
	 * Test: Devuelve 200 si el usuario se añade correctamente
	 */
	it("Devuelve 200 si el usuario se añade correctamente", async () => {
		const response: Response = await request(app)
			.post("/ligas/1234")
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(200);
	});

	/**
	 * Test: Devuelve 409 si el usuario ya pertenece a la liga
	 */
	it("Devuelve 409 si el usuario ya pertenece a la liga", async () => {
		const response: Response = await request(app)
			.post("/ligas/1234")
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario ya pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 409 si el usuario ya pertenece a 5 ligas
	 */
	it("Devuelve 409 si el usuario ya pertenece a 5 ligas", async () => {
		await new modeloUsuario(usuario5Ligas).save();

		const response: Response = await request(app)
			.post("/ligas/1234")
			.set({ email: usuario5Ligas.email, token: token5ligas });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "No puedes participar en más de 5 ligas",
		});
	});

	/**
	 * Test: Devuelve 409 si la liga está llena
	 */
	it("Devuelve 409 si la liga está llena", async () => {
		await crearLigaLLena();
		const response: Response = await request(app)
			.post("/ligas/5678")
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Liga completa",
		});
	});
});

describe("getLiga", () => {
	/**
	 * Test: Devuelve 401 si el usuario no está autenticado
	 */
	it("Devuelve 401 si el usuario no está autenticado", async () => {
		const response: Response = await request(app).get("/ligas/1234");

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: "Usuario no autenticado" });
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.get("/ligas/NoLiga")
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Liga no encontrada" });
	});

	/**
	 * Test: Devuelve 409 si el usuario no pertenece a la liga
	 */
	it("Devuelve 409 si el usuario no pertenece a la liga", async () => {
		const response: Response = await request(app)
			.get("/ligas/1234")
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario no pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 200 si la liga existe y el usuario pertenece a ella
	 */
	it("Devuelve 200 si la liga existe y el usuario pertenece a ella", async () => {
		const response: Response = await request(app)
			.get("/ligas/1234")
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(200);
		expect(response.body.nombre).toEqual("Liga de prueba");
		expect(response.body.maxJugadores).toEqual(3);
		expect(response.body.enlaceInvitacion).toEqual("join-to:1234");
		expect(response.body.mercado).toHaveLength(10);
		expect(response.body.plantillasUsuarios).toHaveLength(1);
	});
});

describe("getLigasUsuario", () => {
	/**
	 * Test: Devuelve 401 si el usuario no está autenticado
	 */
	it("Devuelve 401 si el usuario no está autenticado", async () => {
		const response: Response = await request(app).get(
			"/ligas/usuario/" + usuario4.id
		);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: "Usuario no autenticado" });
	});

	/**
	 * Test: Devuelve 401 si el usuario no está autorizado
	 */
	it("Devuelve 401 si el usuario no está autorizado", async () => {
		const response: Response = await request(app)
			.get("/ligas/usuario/" + usuario4.id)
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: "Usuario no autorizado" });
	});

	/**
	 * Test: Devuelve 200 si el usuario existe
	 */
	it("Devuelve 200 si el usuario existe", async () => {
		const response: Response = await request(app)
			.get("/ligas/usuario/" + usuario4.id)
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(200);
		expect(response.body).toHaveLength(1);
		expect(response.body[0].nombre).toEqual("Liga de prueba");
		expect(response.body[0].maxJugadores).toEqual(3);
		expect(response.body[0].enlaceInvitacion).toEqual("join-to:1234");
		expect(response.body[0].mercado).toHaveLength(10);
		expect(response.body[0].plantillasUsuarios).toHaveLength(1);
	});
});

describe("getRandomLiga", () => {
	/**
	 * Test: Devuelve 401 si el usuario no está autenticado
	 */
	it("Devuelve 401 si el usuario no está autenticado", async () => {
		const response: Response = await request(app).get("/ligas/random/new");

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: "Usuario no autenticado" });
	});

	/**
	 * Test: Devuelve 200 si hay ligas disponibles para unirse
	 */
	it("Devuelve 200 si hay ligas disponibles para unirse", async () => {
		const response: Response = await request(app)
			.get("/ligas/random/new")
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		expect(response.status).toBe(200);
		expect(response.body.nombre).toEqual("Liga de prueba");
		expect(response.body.maxJugadores).toEqual(3);
		expect(response.body.enlaceInvitacion).toEqual("join-to:1234");
		expect(response.body.mercado).toHaveLength(10);
		expect(response.body.plantillasUsuarios).toHaveLength(1);
	});

	/**
	 * Test: Devuelve 404 si no hay ligas disponibles para unirse
	 */
	it("Devuelve 404 si no hay ligas disponibles para unirse", async () => {
		const response: Response = await request(app)
			.get("/ligas/random/new")
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "No hay ligas disponibles" });
	});
});

describe("eliminarUsuarioDeLiga", () => {
	/**
	 * Test: Devuelve 401 si el usuario no está autenticado
	 */
	it("Devuelve 401 si el usuario no está autenticado", async () => {
		const response: Response = await request(app).delete(
			"/ligas/1234/" + usuario4.id
		);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: "Usuario no autenticado" });
	});

	/**
	 * Test: Devuelve 401 si el usuario no está autorizado
	 */
	it("Devuelve 401 si el usuario no está autorizado", async () => {
		const response: Response = await request(app)
			.delete("/ligas/1234/" + usuarioAdmin.id)
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: "Usuario no autorizado" });
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.delete("/ligas/NoLiga/" + usuario4.id)
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Liga no encontrada" });
	});

	/**
	 * Test: Devuelve 409 si el usuario no pertenece a la liga
	 */
	it("Devuelve 409 si el usuario no pertenece a la liga", async () => {
		const response: Response = await request(app)
			.delete("/ligas/1234/" + usuarioAdmin.id)
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario no pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 204 si el usuario se elimina correctamente
	 */
	it("Devuelve 204 si el usuario se elimina correctamente", async () => {
		// Añadiendo ofertas para comprobar que las elimina
		let liga = (await modeloLiga.findOne({ id: "1234" })) as ILiga;
		liga.mercado = liga.mercado.map((propiedad) => {
			propiedad.venta.ofertas = [
				{
					comprador: usuario4,
					valorOferta: 100,
					estado: "ACTIVA",
					privada: false,
				},
			];
			return propiedad;
		}) as IPropiedadJugador[];

		await modeloLiga.updateOne({ id: "1234" }, liga);

		const response: Response = await request(app)
			.delete("/ligas/1234/" + usuario4.id)
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(204);
	});
});

const crearLigaLLena = async () => {
	const liga = new modeloLiga({
		id: "5678",
		nombre: "Liga de prueba",
		plantillasUsuarios: [],
		propiedadJugadores: [],
		maxJugadores: 3,
		enlaceInvitacion: "join-to:5678",
		mercado: [],
	});

	const alineacionJugador = new modeloAlineacionJugador({
		id: UUID.v4(),
		porteros: [],
		defensas: [],
		medios: [],
		delanteros: [],
		formacion: "4-3-3",
		guardadoEn: new Date().toISOString(),
		idLiga: liga.id,
	});
	const plantillaUsuario = new modeloPlantillaUsuario({
		id: UUID.v4(),
		idLiga: liga.id,
		usuario: {
			id: randomstring.generate(10),
			nombre: randomstring.generate(10),
			usuario: randomstring.generate(10),
			email: randomstring.generate(10),
			contraseña: randomstring.generate(10),
			ligas: [],
			admin: false,
		},
		alineacionJugador: alineacionJugador,
		alineacionesJornada: [],
		valor: 0,
		puntos: 0,
		dinero: 100000000,
	});

	liga.plantillasUsuarios.push(plantillaUsuario);
	liga.plantillasUsuarios.push(plantillaUsuario);
	liga.plantillasUsuarios.push(plantillaUsuario);
	await liga.save();
};
