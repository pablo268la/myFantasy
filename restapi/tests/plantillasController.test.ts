import bp from "body-parser";
import express, { Application } from "express";
import * as jwt from "jsonwebtoken";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import { modeloLiga } from "../model/liga";
import { IPlantillaUsuario } from "../model/plantillaUsuario";
import { IUsuario, modeloUsuario } from "../model/usuario";
import apiLigas from "../routes/rutasLigas";
import apiPlantillas from "../routes/rutasPlantillas";

const mongoose = require("mongoose");
const app: Application = express();

let plantillaUsuario: IPlantillaUsuario;

beforeAll(async () => {
	app.use(bp.json());
	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));
	app.use(apiLigas);
	app.use(apiPlantillas);

	
	const container: MongoDBContainer = new MongoDBContainer().withReuse();
	const startedContainer = await container.start();
	await mongoose.connect(startedContainer.getConnectionString(), {
		directConnection: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		config: { autoIndex: false },
	});

	await request(app)
		.post("/ligas")
		.set({ email: usuarioAdmin.email, token: tokenAdmin })
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

	await request(app)
		.post("/ligas/1234")
		.set({ email: usuarioAdmin.email, token: tokenAdmin })
		.then((res) => {
			plantillaUsuario = res.body;
		});

	await request(app)
		.post("/ligas/1234")
		.set({ email: usuario2.email, token: token2 });
});

afterAll(async () => {
	await modeloLiga.deleteOne({ id: "1234" });
	await modeloUsuario.deleteOne({ id: usuario4.id });

	
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

describe("plantillas/liga/usuario", () => {
	/**
	 * Test: Devuelve 401 si el usuario no está autenticado
	 */
	it("Devuelve 401 si el usuario no está autenticado", async () => {
		const response: Response = await request(app).get("/plantillas/1234/0");

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: "Usuario no autenticado" });
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.get("/plantillas/12345/" + usuarioAdmin.id)
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Liga no encontrada" });
	});

	/**
	 * Test: Devuelve 404 si la plantilla no existe
	 */
	it("Devuelve 404 si la plantilla no existe", async () => {
		await new modeloUsuario(usuario4).save();

		const response: Response = await request(app)
			.get("/plantillas/1234/" + usuario4.id)
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Plantilla no encontrada" });
	});

	/**
	 * Test: Devuelve 200 si la plantilla existe
	 */
	it("Devuelve 200 si la plantilla existe", async () => {
		const response: Response = await request(app)
			.get("/plantillas/1234/" + usuarioAdmin.id)
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		expect(response.status).toBe(200);
		expect(response.body.usuario.id).toBe(usuarioAdmin.id);
		expect(response.body.idLiga).toBe("1234");
	});
});

describe("plantillas/update", () => {
	/**
	 * Test: Devuelve 401 si el usuario no está autenticado
	 */
	it("Devuelve 401 si el usuario no está autenticado", async () => {
		const response: Response = await request(app).post("/plantillas/update");

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ message: "Usuario no autenticado" });
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.post("/plantillas/update")
			.set({ email: usuarioAdmin.email, token: tokenAdmin })
			.send({
				idLiga: "12345",
			});

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Liga no encontrada" });
	});

	/**
	 * Test: Devuelve 404 si la plantilla no existe
	 */
	it("Devuelve 404 si la plantilla no existe", async () => {
		const response: Response = await request(app)
			.post("/plantillas/update")
			.set({ email: usuario4.email, token: token4 })
			.send({
				plantilla: {
					id: "foo",
				},
				idLiga: "1234",
			});

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Plantilla no encontrada" });
	});

	/**
	 * Test: Devuelve 200 si la plantilla existe
	 */
	it("Devuelve 200 si la plantilla existe", async () => {
		const dinero = new Date().getTime() / 100;
		plantillaUsuario.dinero = dinero;
		const response: Response = await request(app)
			.post("/plantillas/update")
			.set({ email: usuarioAdmin.email, token: tokenAdmin })
			.send({
				plantilla: plantillaUsuario,
				idLiga: "1234",
			});

		expect(response.status).toBe(200);
		expect(response.body.usuario.id).toBe(usuarioAdmin.id);
		expect(response.body.idLiga).toBe("1234");
		expect(response.body.dinero).toBe(dinero);
	});
});
