import { RequestHandler } from "express";
import { modeloLiga } from "../model/liga";
import { IOferta } from "../model/oferta";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { modeloUsuario } from "../model/usuario";
import { modeloVenta } from "../model/venta";
import { shuffle } from "./plantillasController";
import { verifyUser } from "./usuariosController";

export const resetmercado: RequestHandler = async (req, res) => {
	try {
		const liga = await modeloLiga.findById(req.params.idLiga);

		if (!liga) return res.status(404).json({ message: "Liga no encontrada" });

		let mercadoOut = liga.mercado.filter((propiedadJugador) => {
			if (
				Date.parse(propiedadJugador.venta.fechaLimite) <= new Date().getTime()
			) {
				return propiedadJugador;
			}
		});

		if (mercadoOut.length === 0) {
			return res.status(200).json(liga);
		}

		let mercadoIns = liga.mercado.filter((propiedadJugador) => {
			if (
				Date.parse(propiedadJugador.venta.fechaLimite) > new Date().getTime()
			) {
				return propiedadJugador;
			}
		});

		let antiguasPropiedades = liga.propiedadJugadores;
		let nuevasPropiedades: IPropiedadJugador[] = [];

		antiguasPropiedades.map((propiedad) => {
			if (
				//Quitar check, valen todas las ventas
				propiedad.usuario.id === "-2" &&
				mercadoOut.filter(
					(propiedadJugador) =>
						propiedadJugador.jugador._id === propiedad.jugador._id
				).length > 0
			) {
				//TODO - Valorar ofertas
				propiedad.usuario = new modeloUsuario({
					id: "-1",
					nombre: "liga",
					usuario: "liga",
					email: "liga",
					contraseña: "liga",
					ligas: [],
					admin: false,
				});
			}
			nuevasPropiedades.push(propiedad);
		});

		nuevasPropiedades = shuffle(nuevasPropiedades).map((propiedad) => {
			if (propiedad.usuario.id === "-1" && mercadoIns.length < 10) {
				propiedad.usuario = new modeloUsuario({
					id: "-2",
					nombre: "liga",
					usuario: "liga",
					email: "liga",
					contraseña: "liga",
					ligas: [],
					admin: false,
				});
				propiedad.venta = new modeloVenta({
					enVenta: true,
					ofertas: [],
					fechaLimite: new Date(
						new Date().getTime() + 24 * 60 * 60 * 1000
					).toISOString(),
				});

				mercadoIns.push(propiedad);
			}
			return propiedad;
		});

		liga.propiedadJugadores = nuevasPropiedades;
		liga.mercado = mercadoIns;

		await liga.save();
		res.status(200).json(liga);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

export const hacerPuja: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	const idLiga = req.params.idLiga;
	const ofertaHecha: IOferta = req.body.oferta;
	const idJugadorEnVenta = req.body.jugadorEnVenta.jugador.jugador._id;

	const usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);

	try {
		if (usuario && verified) {
			const liga = await modeloLiga.findById(idLiga);
			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });

			let mercado = liga.mercado;

			let j;

			mercado.map((propiedadJugadorMercado) => {
				if (propiedadJugadorMercado.jugador._id === idJugadorEnVenta) {
					if (propiedadJugadorMercado.venta.ofertas.length !== 0) {
						propiedadJugadorMercado.venta.ofertas.map((oferta) => {
							if (oferta.comprador.id === usuario.id) {
								return ofertaHecha;
							} else {
								return oferta;
							}
						});
					} else {
						propiedadJugadorMercado.venta.ofertas.push(ofertaHecha);
					}

					j = propiedadJugadorMercado;
					return propiedadJugadorMercado;
				} else {
					return propiedadJugadorMercado;
				}
			});

			await liga.save();
			return res.status(200).json(j);
		} else {
			res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

export const añadirJugadorMercado: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	const idLiga = req.params.idLiga;
	const propiedadJugador = req.body.propiedadJugador;

	const usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);

	try {
		if (usuario && verified) {
			const liga = await modeloLiga.findById(idLiga);
			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });

			let mercado = liga.mercado;

			propiedadJugador.venta = new modeloVenta({
				enVenta: true,
				ofertas: [],
				fechaLimite: new Date(
					new Date().getTime() + 24 * 60 * 60 * 1000
				).toISOString(),
			});

			mercado.push(propiedadJugador);
			liga.mercado = mercado;

			await liga.save();
			return res.status(200).json(propiedadJugador);
		} else {
			res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};
