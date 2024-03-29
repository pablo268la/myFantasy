import bp from "body-parser";
import express, { Application } from "express";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import { verifyUser } from "../controladores/usuariosController";
import { IUsuario, modeloUsuario } from "../model/usuario";
import apiUsuarios from "../routes/rutasUsuarios";

const app: Application = express();
const mongoose = require("mongoose");

beforeAll(async () => {
	app.use(bp.json());
	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));
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

const emailCorrecto = "test@test.com";
const contraseñaCorrecta = "Prueba123";

const usuarioEmailRepetido: IUsuario = {
	id: "1",
	nombre: "Prueba",
	usuario: "Usuario de prueba",
	contraseña: "SoyNuevo123",
	email: "test@test.com",
	ligas: [],
	admin: false,
};

const nuevoUsuario: IUsuario = {
	id: "1",
	nombre: "Prueba",
	usuario: "Usuario de prueba",
	contraseña: "SoyNuevo123",
	email: "prueba@test.com",
	ligas: [],
	admin: false,
};

describe("getUsuario", () => {
	/**
	 * Test: Devuelve 200 si el usuario existe
	 */
	it("200 cuando existe usuario", async () => {
		const response: Response = await request(app).get(
			"/usuario/" + emailCorrecto
		);

		expect(response.statusCode).toBe(200);
		expect(response.body.nombre).toEqual("Test");
		expect(response.body.usuario).toEqual("TestFantasy");
		expect(response.body.email).toEqual(emailCorrecto);
		expect(response.body.ligas).toEqual(["1234"]);
		expect(response.body.admin).toEqual(true);
	});

	/**
	 * Test: Devuelve 404 si el usuario no existe
	 */
	it("404 cuando no existe usuario", async () => {
		const response: Response = await request(app).get("/usuario/noExiste");

		expect(response.statusCode).toBe(404);
		expect(response.body).toEqual({
			message: "Usuario no encontrado",
		});
	});
});

describe("createUsuario", () => {
	/**
	 * Test: Devuelve 201 si crea el usuario
	 */
	it("200 si crea el usuario", async () => {
		const response: Response = await request(app)
			.post("/usuario")
			.send(nuevoUsuario);

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual(
			expect.objectContaining({
				nombre: "Prueba",
				usuario: "Usuario de prueba",
				email: "prueba@test.com",
				ligas: [],
				admin: false,
			})
		);

		// Borrar usuario para no ensuciar
		await modeloUsuario.deleteOne({ email: nuevoUsuario.email });
	});

	/**
	 * Test: Devuelve 409 si ya existe el usuario (mismo correo)
	 */
	it("409 si ya existe el usuario", async () => {
		const response: Response = await request(app)
			.post("/usuario")
			.send(usuarioEmailRepetido);

		expect(response.statusCode).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario ya existe",
		});
	});
});

let verifiedToken = "";

describe("requestToken", () => {
	/**
	 * Test: Devuelve 200 y el token
	 */
	it("200 si usuario y contraseña correcta", async () => {
		const response: Response = await request(app)
			.post("/token")
			.send({ email: emailCorrecto, contraseña: contraseñaCorrecta });

		expect(response.statusCode).toBe(200);
		verifiedToken = response.body;
		expect(verifiedToken).toBeDefined();
	});

	/**
	 * Test: Devuelve 404 si usuario no existe
	 */
	it("404 si usuario no existe", async () => {
		const response: Response = await request(app).post("/token").send({
			email: "No existe este usuario",
			contraseña: "contraseñaIncorrecta",
		});

		expect(response.statusCode).toBe(404);
		expect(response.body).toEqual({
			message: "Usuario no existe",
		});
	});

	/**
	 * Test: Devuelve 401 si contraseña incorrecta
	 */
	it("401 si contraseña incorrecta", async () => {
		const response: Response = await request(app)
			.post("/token")
			.send({ email: emailCorrecto, contraseña: "contraseñaIncorrecta" });

		expect(response.statusCode).toBe(401);
		expect(response.body).toEqual({
			message: "Contraseña incorrecta",
		});
	});
});

describe("verifyUser", () => {
	/**
	 * Test: Devuelve True si token válido
	 */
	it("True si token válido para usuario", async () => {
		const response: boolean = await verifyUser(emailCorrecto, verifiedToken);

		expect(response).toBe(true);
	});

	/**
	 * Test: Devuelve False si token no válido
	 */
	it("False si token no válido para usuario", async () => {
		const response: boolean = await verifyUser(
			emailCorrecto,
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5YzZhZGVlLWY4YzEtNGMzNS1iNGVlLTU4NzE5MmZmMjA1MiIsImlhdCI6MTY4MzkwNTQ0OH0.SVYHLLZNHPwBA0-Cyil1-2q7reNottfiGd4DoYgYw1I"
		);

		expect(response).toBe(false);
	});
});
