import { RequestHandler } from "express";
import {
	añadirJugadorAPlantilla,
	quitarJugadorDePlantilla,
} from "../helpers/mercadoHelpers";
import { modeloLiga } from "../model/liga";
import { IOferta } from "../model/oferta";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { modeloUsuario } from "../model/usuario";
import { modeloVenta } from "../model/venta";
import { shuffle } from "./plantillasController";
import { verifyUser } from "./usuariosController";

export const resetmercado: RequestHandler = async (req, res) => {
	try {
		const liga = await modeloLiga.findOne({ id: req.params.idLiga });

		if (!liga) return res.status(404).json({ message: "Liga no encontrada" });

		const newMercado = liga.mercado.filter((propiedadJugador) => {
			if (
				Date.parse(propiedadJugador.venta.fechaLimite) > new Date().getTime()
			) {
				return propiedadJugador;
			}
		});

		const ventasConOfertas = liga.mercado.filter((propiedadJugador) => {
			if (
				Date.parse(propiedadJugador.venta.fechaLimite) < new Date().getTime() &&
				propiedadJugador.venta.ofertas.length > 0
			) {
				return propiedadJugador;
			}
		});

		ventasConOfertas.forEach((propiedadJugador) => {
			const mejorOferta = propiedadJugador.venta.ofertas.sort(
				(a: IOferta, b: IOferta) => {
					return a.valorOferta >= b.valorOferta ? 1 : -1;
				}
			)[0];

			if (mejorOferta.comprador.id !== "-1")
				liga.plantillasUsuarios = liga.plantillasUsuarios.map((plantilla) => {
					if (plantilla.usuario.id === mejorOferta.comprador.id) {
						propiedadJugador.venta.ofertas = [];
						propiedadJugador.venta.enVenta = false;
						propiedadJugador.usuario = plantilla.usuario;
						propiedadJugador.titular = false;
						añadirJugadorAPlantilla(propiedadJugador, plantilla);
						plantilla.dinero -= mejorOferta.valorOferta;
					}
					return plantilla;
				});
		});

		const fromLaLiga = newMercado.filter((propiedadJugador) => {
			return propiedadJugador.usuario.id === "-1";
		});

		shuffle(
			liga.propiedadJugadores.filter((propiedadJugador) => {
				return (
					propiedadJugador.usuario.id === "-1" &&
					propiedadJugador.jugador.equipo.id !== "-1"
				);
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
		const newLiga = await modeloLiga.updateOne({ id: req.params.idLiga }, liga);

		res.status(200).json(newLiga);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const hacerPuja: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const idLiga = req.params.idLiga;
		const ofertaHecha: IOferta = req.body.oferta;
		const idJugadorEnVenta = req.body.idJugadorEnVenta;

		const usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			const liga = await modeloLiga.findOne({ id: idLiga });
			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });

			if (
				liga.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) === -1
			)
				return res.status(409).json({
					message: "Usuario no pertenece a esta liga",
				});

			const mercado = liga.mercado;

			let j;

			mercado.map((propiedadJugadorMercado) => {
				if (propiedadJugadorMercado.jugador.id === idJugadorEnVenta) {
					const hayOfertaDelUsuario =
						propiedadJugadorMercado.venta.ofertas.filter(
							(oferta) => oferta.comprador.id === usuario.id
						).length > 0;

					if (!hayOfertaDelUsuario) {
						propiedadJugadorMercado.venta.ofertas.push(ofertaHecha);
					} else {
						propiedadJugadorMercado.venta.ofertas =
							propiedadJugadorMercado.venta.ofertas.map((oferta) => {
								if (oferta.comprador.id === usuario.id) {
									oferta = ofertaHecha;
								}
								return oferta;
							});
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
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const añadirJugadorMercado: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const idLiga = req.params.idLiga;
		const propiedadJugador = req.body.propiedadJugador;

		const usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			const liga = await modeloLiga.findOne({ id: idLiga });
			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });
			if (
				liga.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) === -1
			)
				return res.status(409).json({
					message: "Usuario no pertenece a esta liga",
				});

			const mercado = liga.mercado;

			propiedadJugador.venta = new modeloVenta({
				enVenta: true,
				ofertas: [],
				fechaLimite: new Date(
					new Date().getTime() + 72 * 60 * 60 * 1000
				).toISOString(),
			});

			mercado.push(propiedadJugador);
			liga.mercado = mercado;

			await liga.save();
			return res.status(200).json(propiedadJugador);
		} else {
			res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const rechazarOferta: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const idLiga = req.params.idLiga;

		const idComprador = req.body.idComprador;
		const idJugadorEnVenta = req.body.idJugadorEnVenta;

		const usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			const liga = await modeloLiga.findOne({ id: idLiga });
			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });
			if (
				liga.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) === -1
			)
				return res.status(409).json({
					message: "Usuario no pertenece a esta liga",
				});

			let r;
			liga.mercado.map((propiedadJugador) => {
				if (propiedadJugador.jugador.id === idJugadorEnVenta) {
					propiedadJugador.venta.ofertas =
						propiedadJugador.venta.ofertas.filter((oferta) => {
							return oferta.comprador.id !== idComprador;
						});
					r = propiedadJugador;
					return propiedadJugador;
				} else {
					return propiedadJugador;
				}
			});

			await liga.save();
			return res.status(200).json(r);
		} else {
			res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const aceptarOferta: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const idLiga = req.params.idLiga;

		const idComprador = req.body.idComprador;
		const idJugadorEnVenta = req.body.idJugadorEnVenta;

		const usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			const nuevoUsuario = await modeloUsuario.findOne({
				id: idComprador.toString(),
			});

			if (nuevoUsuario) {
				const liga = await modeloLiga.findOne({ id: idLiga });
				if (!liga)
					return res.status(404).json({ message: "Liga no encontrada" });
				if (
					liga.plantillasUsuarios
						.map((plantilla) => plantilla.usuario.id)
						.indexOf(usuario.id) === -1
				)
					return res.status(409).json({
						message: "Usuario no pertenece a esta liga",
					});
				if (
					liga.plantillasUsuarios
						.map((plantilla) => plantilla.usuario.id)
						.indexOf(nuevoUsuario.id) === -1
				)
					return res.status(409).json({
						message: "Usuario comprador no pertenece a esta liga",
					});

				let propiedadJugadorVenta: IPropiedadJugador | null = null;
				let valorOfertaAcetada = 0;

				const jugadorAVender = liga.mercado
					.filter(
						(propiedadJugador) =>
							propiedadJugador.jugador.id === idJugadorEnVenta
					)
					.at(0);

				if (!jugadorAVender)
					return res
						.status(404)
						.json({ message: "El jugador no esta en el mercado" });

				liga.mercado = liga.mercado.filter((propiedadJugador) => {
					if (propiedadJugador.jugador.id === idJugadorEnVenta) {
						propiedadJugador.venta.ofertas.forEach((oferta) => {
							if (oferta.comprador.id === idComprador) {
								valorOfertaAcetada = oferta.valorOferta;
							}
						});
						propiedadJugadorVenta = propiedadJugador;
						propiedadJugadorVenta.venta.ofertas = [];
						propiedadJugadorVenta.venta.enVenta = false;
						propiedadJugadorVenta.usuario = nuevoUsuario;
						propiedadJugadorVenta.titular = false;
					} else {
						return propiedadJugador;
					}
				});

				// TODO -- Checkear que hacer cuando el comprador o vendedor es la liga
				liga.plantillasUsuarios.map((plantilla) => {
					if (plantilla.usuario.id === idComprador) {
						añadirJugadorAPlantilla(propiedadJugadorVenta, plantilla);
						plantilla.dinero -= valorOfertaAcetada;
					} else if (plantilla.usuario.id === usuario.id) {
						quitarJugadorDePlantilla(
							propiedadJugadorVenta,
							plantilla,
							idJugadorEnVenta
						);
						plantilla.dinero += valorOfertaAcetada;
					}
					return plantilla;
				});

				liga.propiedadJugadores.map((propiedadJugador) => {
					if (propiedadJugador.jugador.id === idJugadorEnVenta) {
						propiedadJugador.usuario = nuevoUsuario;
					}
					return propiedadJugador;
				});

				await liga.save();
				return res.status(200).json(propiedadJugadorVenta);
			} else
				return res
					.status(404)
					.json({ message: "Usuario comprador no encontrado" });
		} else {
			res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const eliminarJugadorMercado: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const idLiga = req.params.idLiga.toString();
		const idJugador = req.params.idJugador.toString();

		const usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			const liga = await modeloLiga.findOne({ id: idLiga });
			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });
			if (
				liga.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) === -1
			)
				return res.status(409).json({
					message: "Usuario no pertenece a esta liga",
				});

			if (
				(
					liga.mercado
						.filter((p) => p.jugador.id === idJugador)
						.at(0) as IPropiedadJugador
				).usuario.id !== usuario.id
			)
				return res.status(403).json({
					message: "Usuario no es dueño del jugador",
				});

			liga.mercado = liga.mercado.filter(
				(propiedadJugador) => propiedadJugador.jugador.id !== idJugador
			);

			await liga.save();
			return res.status(204).json(liga);
		} else {
			res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const eliminarPujaMercado: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const idLiga = req.params.idLiga.toString();
		const idJugador = req.params.idJugador.toString();

		const usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			const liga = await modeloLiga.findOne({ id: idLiga });
			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });
			if (
				liga.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) === -1
			)
				return res.status(409).json({
					message: "Usuario no pertenece a esta liga",
				});

			liga.mercado = liga.mercado.map((propiedadJugador) => {
				if (propiedadJugador.jugador.id === idJugador) {
					propiedadJugador.venta.ofertas =
						propiedadJugador.venta.ofertas.filter(
							(oferta) => oferta.comprador.id !== usuario.id
						);
				}
				return propiedadJugador;
			});

			await liga.save();
			return res.status(204).json(liga);
		} else {
			res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};
