import bp from "body-parser";
import express, { Application } from "express";
import * as jwt from "jsonwebtoken";
import morgan from "morgan";
import request, { Response } from "supertest";
import { MongoDBContainer } from "testcontainers";
import { ILiga, modeloLiga } from "../model/liga";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { IUsuario, modeloUsuario } from "../model/usuario";
import apiLigas from "../routes/rutasLigas";
import apiMercado from "../routes/rutasMercado";
import apiUsuarios from "../routes/rutasUsuarios";

const mongoose = require("mongoose");

const app: Application = express();

beforeAll(async () => {
	app.use(bp.json());
	app.use(bp.urlencoded({ extended: false }));
	app.use(morgan("dev"));
	app.use(apiLigas);
	app.use(apiUsuarios);
	app.use(apiMercado);

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
	await modeloLiga.deleteOne({ id: "1234" });

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

let liga: ILiga;
let idJugadorAPujar: string;
let jugadorAlMercado: IPropiedadJugador;

describe("pujar", () => {
	/**
	 * Test: Devuelve 401 si usuario no autenticado
	 */
	it("Devuelve 401 si usuario no autenticado", async () => {
		const response: Response = await request(app).post("/mercado/pujar/1234");

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: "Usuario no autenticado",
		});
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.post("/mercado/pujar/1234")
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			message: "Liga no encontrada",
		});
	});

	/**
	 * Test: Devuelve 200 si se hace una puja correctamente
	 */
	it("Devuelve 200 si se hace una puja correctamente", async () => {
		await new modeloUsuario(usuario4).save();

		const newLiga: Response = await request(app)
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

		liga = newLiga.body;
		idJugadorAPujar = liga.mercado[0].jugador.id;

		await request(app)
			.post("/ligas/1234")
			.set({ email: usuario4.email, token: token4 });

		const response: Response = await request(app)
			.post("/mercado/pujar/1234")
			.set({ email: usuario4.email, token: token4 })
			.send({
				idJugadorEnVenta: idJugadorAPujar,
				oferta: {
					comprador: usuario4,
					valorOferta: 100,
					estado: "ACTIVA",
					privada: false,
				},
			});

		expect(response.status).toBe(200);
		expect(response.body.venta.ofertas).toHaveLength(1);
		expect(response.body.venta.ofertas[0].valorOferta).toBe(100);
		expect(response.body.venta.ofertas[0].comprador.id).toBe(usuario4.id);
	});

	/**
	 * Test: Devuelve 409 usuario no pertenece a esta liga
	 */
	it("Devuelve 409 usuario no pertenece a esta liga", async () => {
		const response: Response = await request(app)
			.post("/mercado/pujar/1234")
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario no pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 200 si se hace una puja correctamente sobre jugador con mas pujas
	 */
	it("Devuelve 200 si se hace una puja correctamente sobre jugador con mas pujas", async () => {
		await request(app)
			.post("/ligas/1234")
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		const response: Response = await request(app)
			.post("/mercado/pujar/1234")
			.set({ email: usuarioAdmin.email, token: tokenAdmin })
			.send({
				idJugadorEnVenta: idJugadorAPujar,
				oferta: {
					comprador: usuarioAdmin,
					valorOferta: 130,
					estado: "ACTIVA",
					privada: false,
				},
			});

		expect(response.status).toBe(200);
		expect(response.body.venta.ofertas).toHaveLength(2);
		expect(response.body.venta.ofertas[0].valorOferta).toBe(100);
		expect(response.body.venta.ofertas[0].comprador.id).toBe(usuario4.id);
		expect(response.body.venta.ofertas[1].valorOferta).toBe(130);
		expect(response.body.venta.ofertas[1].comprador.id).toBe(usuarioAdmin.id);
	});

	/**
	 * Test: Devuelve 200 si actualiza la puja correctamente
	 */
	it("Devuelve 200 si actualiza la puja correctamente", async () => {
		const response: Response = await request(app)
			.post("/mercado/pujar/1234")
			.set({ email: usuario4.email, token: token4 })
			.send({
				idJugadorEnVenta: idJugadorAPujar,
				oferta: {
					comprador: usuario4,
					valorOferta: 150,
					estado: "ACTIVA",
					privada: false,
				},
			});

		expect(response.status).toBe(200);
		expect(response.body.venta.ofertas).toHaveLength(2);
		expect(response.body.venta.ofertas[0].valorOferta).toBe(150);
		expect(response.body.venta.ofertas[0].comprador.id).toBe(usuario4.id);
		expect(response.body.venta.ofertas[1].valorOferta).toBe(130);
		expect(response.body.venta.ofertas[1].comprador.id).toBe(usuarioAdmin.id);
	});
});

describe("eliminarPuja", () => {
	/**
	 * Test: Devuelve 401 si usuario no autenticado
	 */
	it("Devuelve 401 si usuario no autenticado", async () => {
		const response: Response = await request(app).delete(
			"/mercado/eliminarPuja/1234/" + idJugadorAPujar
		);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: "Usuario no autenticado",
		});
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.delete("/mercado/eliminarPuja/NoLiga/" + idJugadorAPujar)
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			message: "Liga no encontrada",
		});
	});

	/**
	 * Test: Devuelve 409 si el usuario no pertenece a la liga
	 */
	it("Devuelve 409 si el usuario no pertenece a la liga", async () => {
		const response: Response = await request(app)
			.delete("/mercado/eliminarPuja/1234/" + idJugadorAPujar)
			.set({ email: usuario2.email, token: token2 });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario no pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 204 si se elimina la puja correctamente
	 */
	it("Devuelve 204 si se elimina la puja correctamente", async () => {
		const response: Response = await request(app)
			.delete("/mercado/eliminarPuja/1234/" + idJugadorAPujar)
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(204);
	});
});

describe("añadirJugadorMercado", () => {
	/**
	 * Test: Devuelve 401 si usuario no autenticado
	 */
	it("Devuelve 401 si usuario no autenticado", async () => {
		const response: Response = await request(app).post("/mercado/anadir/1234");

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: "Usuario no autenticado",
		});
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.post("/mercado/anadir/NoLiga")
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			message: "Liga no encontrada",
		});
	});

	/**
	 * Test: Devuelve 409 si el usuario no pertenece a la liga
	 */
	it("Devuelve 409 si el usuario no pertenece a la liga", async () => {
		const response: Response = await request(app)
			.post("/mercado/anadir/1234")
			.set({ email: usuario2.email, token: token2 });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario no pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 200 si se añade el jugador correctamente
	 */
	it("Devuelve 200 si se añade el jugador correctamente", async () => {
		liga = (await modeloLiga.findOne({ id: "1234" })) as ILiga;
		jugadorAlMercado = liga.plantillasUsuarios[0].alineacionJugador.medios[0];
		const response: Response = await request(app)
			.post("/mercado/anadir/1234")
			.set({ email: usuario4.email, token: token4 })
			.send({ propiedadJugador: jugadorAlMercado });

		const l = (await modeloLiga.findOne({ id: "1234" })) as ILiga;
		expect(response.status).toBe(200);
		expect(l.mercado).toHaveLength(11);
		expect(l.mercado[10].jugador.id).toBe(jugadorAlMercado.jugador.id);
		expect(l.mercado[10].jugador.nombre).toBe(jugadorAlMercado.jugador.nombre);
		expect(l.mercado[10].jugador.posicion).toBe(
			jugadorAlMercado.jugador.posicion
		);
		expect(l.mercado[10].jugador.valor).toBe(jugadorAlMercado.jugador.valor);
		expect(l.mercado[10].usuario.id).toBe(usuario4.id);
	});
});

describe("eliminarJugadorMercado", () => {
	/**
	 * Test: Devuelve 401 si usuario no autenticado
	 */
	it("Devuelve 401 si usuario no autenticado", async () => {
		const response: Response = await request(app).delete(
			"/mercado/eliminar/1234/" + jugadorAlMercado.jugador.id
		);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: "Usuario no autenticado",
		});
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.delete("/mercado/eliminar/NoLiga/" + jugadorAlMercado.jugador.id)
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			message: "Liga no encontrada",
		});
	});

	/**
	 * Test: Devuelve 409 si el usuario no pertenece a la liga
	 */
	it("Devuelve 409 si el usuario no pertenece a la liga", async () => {
		const response: Response = await request(app)
			.delete("/mercado/eliminar/1234/" + jugadorAlMercado.jugador.id)
			.set({ email: usuario2.email, token: token2 });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario no pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 403 si el usuario no es dueño del jugador
	 */
	it("Devuelve 403 si el usuario no es dueño del jugador", async () => {
		const response: Response = await request(app)
			.delete("/mercado/eliminar/1234/" + jugadorAlMercado.jugador.id)
			.set({ email: usuarioAdmin.email, token: tokenAdmin });

		expect(response.status).toBe(403);
		expect(response.body).toEqual({
			message: "Usuario no es dueño del jugador",
		});
	});

	/**
	 * Test: Devuelve 204 si se elimina el jugador correctamente
	 */
	it("Devuelve 204 si se elimina el jugador correctamente", async () => {
		const response: Response = await request(app)
			.delete("/mercado/eliminar/1234/" + jugadorAlMercado.jugador.id)
			.set({ email: usuario4.email, token: token4 });

		const l = (await modeloLiga.findOne({ id: "1234" })) as ILiga;
		expect(response.status).toBe(204);
		expect(l.mercado).toHaveLength(10);
		for (const i in l.mercado) {
			expect(l.mercado[i].jugador.id).not.toBe(jugadorAlMercado.jugador.id);
		}
	});
});

describe("rechazarOferta", () => {
	/**
	 * Test: Devuelve 401 si usuario no autenticado
	 */
	it("Devuelve 401 si usuario no autenticado", async () => {
		const response: Response = await request(app).post(
			"/mercado/rechazarOferta/1234"
		);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: "Usuario no autenticado",
		});
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.post("/mercado/rechazarOferta/NoLiga")
			.set({ email: usuario4.email, token: token4 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			message: "Liga no encontrada",
		});
	});

	/**
	 * Test: Devuelve 409 si el usuario no pertenece a la liga
	 */
	it("Devuelve 409 si el usuario no pertenece a la liga", async () => {
		const response: Response = await request(app)
			.post("/mercado/rechazarOferta/1234")
			.set({ email: usuario2.email, token: token2 });

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario no pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 200 si se rechaza la oferta correctamente
	 */
	it("Devuelve 200 si se rechaza la oferta correctamente", async () => {
		await request(app)
			.post("/mercado/anadir/1234")
			.set({ email: usuario4.email, token: token4 })
			.send({ propiedadJugador: jugadorAlMercado });

		await request(app)
			.post("/mercado/pujar/1234")
			.set({ email: usuarioAdmin.email, token: tokenAdmin })
			.send({
				idJugadorEnVenta: jugadorAlMercado.jugador.id,
				oferta: {
					comprador: usuarioAdmin,
					valorOferta: 120,
					estado: "ACTIVA",
					privada: false,
				},
			});

		let l = (await modeloLiga.findOne({ id: "1234" })) as ILiga;
		expect(l.mercado).toHaveLength(11);
		expect(l.mercado[10].venta.ofertas).toHaveLength(1);

		const response: Response = await request(app)
			.post("/mercado/rechazarOferta/1234")
			.set({ email: usuario4.email, token: token4 })
			.send({
				idComprador: usuarioAdmin.id,
				idJugadorEnVenta: jugadorAlMercado.jugador.id,
			});

		l = (await modeloLiga.findOne({ id: "1234" })) as ILiga;

		expect(response.status).toBe(200);
		expect(response.body.venta.ofertas).toHaveLength(0);
		expect(l.mercado).toHaveLength(11);
	});
});

describe("aceptarOferta", () => {
	/**
	 * Test: Devuelve 401 si usuario no autenticado
	 */
	it("Devuelve 401 si usuario no autenticado", async () => {
		const response: Response = await request(app).post(
			"/mercado/aceptaroferta/1234"
		);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			message: "Usuario no autenticado",
		});
	});

	/**
	 * Test: Devuelve 404 si la liga no existe
	 */
	it("Devuelve 404 si la liga no existe", async () => {
		const response: Response = await request(app)
			.post("/mercado/aceptaroferta/NoLiga")
			.set({ email: usuario4.email, token: token4 })
			.send({
				idComprador: usuarioAdmin.id,
			});

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			message: "Liga no encontrada",
		});
	});

	/**
	 * Test: Devuelve 404 si usuario comprador no encontrado
	 */
	it("Devuelve 404 si usuario comprador no encontrado", async () => {
		const response: Response = await request(app)
			.post("/mercado/aceptaroferta/1234")
			.set({ email: usuario4.email, token: token4 })
			.send({
				idComprador: "NoUsuario",
			});

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			message: "Usuario comprador no encontrado",
		});
	});

	/**
	 * Test: Devuelve 409 si el usuario no pertenece a la liga
	 */
	it("Devuelve 409 si el usuario no pertenece a la liga", async () => {
		const response: Response = await request(app)
			.post("/mercado/aceptaroferta/1234")
			.set({ email: usuario2.email, token: token2 })
			.send({
				idComprador: usuarioAdmin.id,
			});

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario no pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 409 si el usuario comprador no pertenece a la liga
	 */
	it("Devuelve 409 si el usuario comprador no pertenece a la liga", async () => {
		const response: Response = await request(app)
			.post("/mercado/aceptaroferta/1234")
			.set({ email: usuarioAdmin.email, token: tokenAdmin })
			.send({
				idComprador: usuario2.id,
			});

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			message: "Usuario comprador no pertenece a esta liga",
		});
	});

	/**
	 * Test: Devuelve 404 si el jugador no esta en el mercado
	 */
	it("Devuelve 404 si el jugador no esta en el mercado", async () => {
		const response: Response = await request(app)
			.post("/mercado/aceptarOferta/1234")
			.set({ email: usuario4.email, token: token4 })
			.send({
				idComprador: usuarioAdmin.id,
				idJugadorEnVenta: "NoJugador",
			});

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			message: "El jugador no esta en el mercado",
		});
	});

	/**
	 * Test: Devuelve 200 si se acepta la oferta correctamente
	 */
	it("Devuelve 200 si se acepta la oferta correctamente", async () => {
		await request(app)
			.post("/mercado/pujar/1234")
			.set({ email: usuarioAdmin.email, token: tokenAdmin })
			.send({
				idJugadorEnVenta: jugadorAlMercado.jugador.id,
				oferta: {
					comprador: usuarioAdmin,
					valorOferta: 120,
					estado: "ACTIVA",
					privada: false,
				},
			});

		const response: Response = await request(app)
			.post("/mercado/aceptarOferta/1234")
			.set({ email: usuario4.email, token: token4 })
			.send({
				idComprador: usuarioAdmin.id,
				idJugadorEnVenta: jugadorAlMercado.jugador.id,
			});

		const l = (await modeloLiga.findOne({ id: "1234" })) as ILiga;

		expect(response.status).toBe(200);
		expect(response.body.usuario.id).toBe(usuarioAdmin.id);
		expect(l.plantillasUsuarios[1].dinero).toBe(100000000 - 120);
		expect(l.plantillasUsuarios[0].dinero).toBe(100000000 + 120);
		expect(l.mercado).toHaveLength(10);
		expect(
			l.plantillasUsuarios[1].alineacionJugador.medios[
				l.plantillasUsuarios[1].alineacionJugador.medios.length - 1
			].jugador.id
		).toBe(jugadorAlMercado.jugador.id);
		for (const i in l.plantillasUsuarios[0].alineacionJugador.medios) {
			expect(
				l.plantillasUsuarios[0].alineacionJugador.medios[i].jugador.id
			).not.toBe(jugadorAlMercado.jugador.id);
		}
	});
});
