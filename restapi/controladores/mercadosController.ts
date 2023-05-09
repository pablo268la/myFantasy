import { RequestHandler } from "express";
import { modeloLiga } from "../model/liga";
import { IOferta } from "../model/oferta";
import { IPlantillaUsuario } from "../model/plantillaUsuario";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { modeloUsuario } from "../model/usuario";
import { modeloVenta } from "../model/venta";
import { shuffle } from "./plantillasController";
import { verifyUser } from "./usuariosController";

export const resetmercado: RequestHandler = async (req, res) => {
	try {
		const liga = await modeloLiga.findById(req.params.idLiga);

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

		let plantillas: IPlantillaUsuario[] = [];

		ventasConOfertas.forEach((propiedadJugador) => {
			const mejorOferta = propiedadJugador.venta.ofertas.sort(
				(a: IOferta, b: IOferta) => {
					return a.valorOferta >= b.valorOferta ? 1 : -1;
				}
			)[0];

			plantillas.push(
				...liga.plantillasUsuarios.map((plantilla) => {
					if (plantilla.usuario.id === mejorOferta.comprador.id) {
						propiedadJugador.venta.ofertas = [];
						propiedadJugador.venta.enVenta = false;
						propiedadJugador.usuario = plantilla.usuario;
						propiedadJugador.titular = false;
						añadirJugadorAPlantilla(propiedadJugador, plantilla);
						plantilla.dinero -= mejorOferta.valorOferta;
					}
					return plantilla;
				})
			);
		});

		const fromLaLiga = liga.mercado.filter((propiedadJugador) => {
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
		const newLiga = await modeloLiga.findByIdAndUpdate(
			req.params.idLiga,
			liga,
			{
				new: true,
			}
		);

		res.status(200).json(newLiga);
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

			const mercado = liga.mercado;

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
	} catch (error) {
		console.log(error)
		res.status(500).json(error);
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
		res.status(500).json(error);
	}
};

export const rechazarOferta: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	const idLiga = req.params.idLiga;

	const idComprador = req.body.idComprador;
	const idJugadorEnVenta = req.body.idJugadorEnVenta;

	const usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);

	try {
		if (usuario && verified) {
			const liga = await modeloLiga.findById(idLiga);
			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });

			let r;
			liga.mercado.map((propiedadJugador) => {
				if (propiedadJugador.jugador._id === idJugadorEnVenta) {
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
		res.status(500).json(error);
	}
};

export const aceptarOferta: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	const idLiga = req.params.idLiga;

	const idComprador = req.body.idComprador;
	const idJugadorEnVenta = req.body.idJugadorEnVenta;

	const usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);
	const nuevoUsuario = await modeloUsuario.findOne({ id: idComprador });

	try {
		if (usuario && verified) {
			if (nuevoUsuario) {
				const liga = await modeloLiga.findById(idLiga);
				if (!liga)
					return res.status(404).json({ message: "Liga no encontrada" });

				let propiedadJugadorVenta: IPropiedadJugador | null = null;
				let valorOfertaAcetada = 0;
				liga.mercado.forEach((propiedadJugador) => {
					// TODO -- Checkear que hacer cuando el jugador no esta en el mercado
					if (propiedadJugador.jugador._id === idJugadorEnVenta) {
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
					}
				});

				liga.mercado = liga.mercado.filter(
					(p) => p.jugador._id !== idJugadorEnVenta
				);

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
					if (propiedadJugador.jugador._id === idJugadorEnVenta) {
						propiedadJugador.usuario = nuevoUsuario;
					}
					return propiedadJugador;
				});

				await liga.save();
				res.json(propiedadJugadorVenta);
			} else
				return res
					.status(404)
					.json({ message: "Usuario comprador no encontrada" });
		} else {
			res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

function quitarJugadorDePlantilla(
	propiedadJugadorVenta: IPropiedadJugador | null,
	plantilla: IPlantillaUsuario,
	idJugadorAQuitar: string
) {
	switch (propiedadJugadorVenta?.jugador.posicion) {
		case "Portero":
			plantilla.alineacionJugador.porteros =
				plantilla.alineacionJugador.porteros.filter(
					(j) => j.jugador._id !== idJugadorAQuitar
				);
			break;
		case "Defensa":
			plantilla.alineacionJugador.defensas =
				plantilla.alineacionJugador.defensas.filter(
					(j) => j.jugador._id !== idJugadorAQuitar
				);
			break;
		case "Mediocentro":
			plantilla.alineacionJugador.medios =
				plantilla.alineacionJugador.medios.filter(
					(j) => j.jugador._id !== idJugadorAQuitar
				);
			break;
		case "Delantero":
			plantilla.alineacionJugador.delanteros =
				plantilla.alineacionJugador.delanteros.filter(
					(j) => j.jugador._id !== idJugadorAQuitar
				);
			break;
	}
}

function añadirJugadorAPlantilla(
	propiedadJugadorVenta: IPropiedadJugador | null,
	plantilla: IPlantillaUsuario
) {
	switch (propiedadJugadorVenta?.jugador.posicion) {
		case "Portero":
			plantilla.alineacionJugador.porteros.push(
				propiedadJugadorVenta as IPropiedadJugador
			);
			break;
		case "Defensa":
			plantilla.alineacionJugador.defensas.push(
				propiedadJugadorVenta as IPropiedadJugador
			);
			break;
		case "Mediocentro":
			plantilla.alineacionJugador.medios.push(
				propiedadJugadorVenta as IPropiedadJugador
			);
			break;
		case "Delantero":
			plantilla.alineacionJugador.delanteros.push(
				propiedadJugadorVenta as IPropiedadJugador
			);
			break;
	}
}
