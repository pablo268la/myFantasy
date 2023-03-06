import { RequestHandler } from "express";
import { modeloLiga } from "../model/liga";
import { IOferta } from "../model/oferta";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { modeloUsuario } from "../model/usuario";
import { shuffle } from "./plantillasController";
import { verifyUser } from "./usuariosController";

export const resetmercado: RequestHandler = async (req, res) => {
	try {
		const liga = await modeloLiga.findById(req.params.idLiga);

		if (!liga) return res.status(404).json({ message: "Liga no encontrada" });

		let out = liga.mercado.filter((venta) => {
			if (Date.parse(venta.fechaLimite) <= new Date().getTime()) {
				return venta;
			}
		});

		if (out.length === 0) {
			return res.status(200).json(liga);
		}

		let ins = liga.mercado.filter((venta) => {
			if (Date.parse(venta.fechaLimite) > new Date().getTime()) {
				return venta;
			}
		});

		let antiguasPropiedades = liga.propiedadJugadores;
		let nuevasPropiedades: IPropiedadJugador[] = [];

		antiguasPropiedades.map((propiedad) => {
			if (
				//Quitar check, valen todas las ventas
				propiedad.usuario.id === "-2" &&
				out.filter(
					(venta) => venta.jugador.jugador._id === propiedad.jugador._id
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
			if (propiedad.usuario.id === "-1" && ins.length < 10) {
				propiedad.usuario = new modeloUsuario({
					id: "-2",
					nombre: "liga",
					usuario: "liga",
					email: "liga",
					contraseña: "liga",
					ligas: [],
					admin: false,
				});
				ins.push({
					jugador: propiedad,
					ofertas: [],
					fechaLimite: new Date(
						new Date().getTime() + 24 * 60 * 60 * 1000
					).toISOString(),
				});
			}
			return propiedad;
		});

		liga.propiedadJugadores = nuevasPropiedades;
		liga.mercado = ins;

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

			mercado.map((jugadorEnVenta) => {
				if (jugadorEnVenta.jugador.jugador._id === idJugadorEnVenta) {
					if (jugadorEnVenta.ofertas.length !== 0) {
						jugadorEnVenta.ofertas.map((oferta) => {
							if (oferta.comprador.id === usuario.id) {
								return ofertaHecha;
							} else {
								return oferta;
							}
						});
					} else {
						jugadorEnVenta.ofertas.push(ofertaHecha);
					}

					j = jugadorEnVenta;
					return jugadorEnVenta;
				} else {
					return jugadorEnVenta;
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
