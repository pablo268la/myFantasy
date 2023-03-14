import { RequestHandler } from "express";
import { modeloLiga } from "../model/liga";
import { IOferta } from "../model/oferta";
import { modeloUsuario } from "../model/usuario";
import { modeloVenta } from "../model/venta";
import { shuffle } from "./plantillasController";
import { verifyUser } from "./usuariosController";

export const resetmercado: RequestHandler = async (req, res) => {
	try {
		const liga = await modeloLiga.findById(req.params.idLiga);

		if (!liga) return res.status(404).json({ message: "Liga no encontrada" });

		let newMercado = liga.mercado.filter((propiedadJugador) => {
			if (
				Date.parse(propiedadJugador.venta.fechaLimite) > new Date().getTime()
			) {
				return propiedadJugador;
			}
		});

		let fromLaLiga = liga.mercado.filter((propiedadJugador) => {
			return propiedadJugador.usuario.id === "-1";
		});

		shuffle(
			liga.propiedadJugadores.filter((propiedadJugador) => {
				return propiedadJugador.usuario.id === "-1";
			})
		)
			.slice(0, 10 - fromLaLiga.length)
			.forEach((propiedadJugador) => {
				propiedadJugador.venta = new modeloVenta({
					enVenta: true,
					ofertas: [],
					fechaLimite: new Date(
						new Date().getTime() + 24 * 60 * 60 * 1000
					).toISOString(),
				});
				newMercado.push(propiedadJugador);
			});

		liga.mercado = newMercado;
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
	const idJugadorEnVenta = req.body.jugadorEnVenta.jugador._id;

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
