import { RequestHandler } from "express";
import { modeloJugador } from "../model/jugador";
import { modeloLiga } from "../model/liga";
import {
	IPropiedadJugador,
	modeloPropiedadJugador,
} from "../model/propiedadJugador";
import { IUsuario, modeloUsuario } from "../model/usuario";
import { modeloVenta } from "../model/venta";
import {
	crearPlantillaParaUsuarioYGuardar,
	shuffle,
} from "./plantillasController";
import { verifyUser } from "./usuariosController";

export const getLiga: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		let usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (!usuario || !verified)
			return res.status(401).json({ message: "Usuario no autenticado" });

		const ligaEncontrada = await modeloLiga.findOne({ id: req.params.id });
		if (!ligaEncontrada)
			return res.status(404).json({ message: "Liga no encontrada" });

		if (
			ligaEncontrada.plantillasUsuarios
				.map((plantilla) => plantilla.usuario.id)
				.indexOf(usuario.id) === -1
		)
			return res
				.status(409)
				.json({ message: "Usuario no pertenece a esta liga" });

		return res.status(200).json(ligaEncontrada);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const getLigasUsuario: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;

		let usuario = await modeloUsuario.findOne({ id: req.params.idUsuario });
		const verified = await verifyUser(email, token);

		if (!usuario || !verified)
			return res.status(401).json({ message: "Usuario no autenticado" });

		if (usuario.email !== email)
			return res.status(403).json({ message: "Usuario no autorizado" });

		let ligas = [];
		for (let i = 0; i < usuario.ligas.length; i++) {
			const liga = await modeloLiga.findOne({ id: usuario.ligas[i] });
			ligas.push(liga);
		}
		return res.status(200).json(ligas);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const createLiga: RequestHandler = async (req, res) => {
	try {
		let liga = new modeloLiga(req.body.liga);

		const jugadores = await modeloJugador.find();
		jugadores.forEach((jugador) => {
			const propiedad = new modeloPropiedadJugador({
				jugador: jugador,
				usuario: crearJugadorOwnerLaLiga(),
				titular: false,
				venta: new modeloVenta({
					enVenta: false,
					ofertas: [],
					fechaLimite: new Date().toISOString(),
				}),
			});
			liga.propiedadJugadores.push(propiedad);
		});

		let fechaLimite: Date = new Date();
		fechaLimite.setDate(fechaLimite.getDate() + 1);

		shuffle(liga.propiedadJugadores)
			.filter((propiedad) => propiedad.jugador.equipo.id !== "-1")
			.slice(0, 10)
			.forEach((propiedad: IPropiedadJugador) => {
				propiedad.venta = new modeloVenta({
					enVenta: true,
					ofertas: [],
					fechaLimite: fechaLimite.toISOString(),
				});

				liga.mercado.push(propiedad);
			});

		const ligaGuardada = await liga.save();
		return res.status(201).json(ligaGuardada);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const añadirUsuarioALiga: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const idLiga = req.params.idLiga;

		let usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);
		if (usuario && verified) {
			const liga = await modeloLiga.findOne({ id: idLiga });

			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });
			else if (usuario.ligas.length >= 5) {
				return res
					.status(409)
					.json({ message: "No puedes participar en más de 5 ligas" });
			} else if (liga.plantillasUsuarios.length >= liga.maxJugadores)
				return res.status(409).json({
					message: "Liga completa",
				});
			else if (
				liga.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) !== -1
			)
				return res.status(409).json({
					message: "Usuario ya pertenece a esta liga",
				});

			const plantillaGuardada = await crearPlantillaParaUsuarioYGuardar(
				usuario,
				liga
			);

			return res.status(200).json(plantillaGuardada);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const getRandomLiga: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;

		const usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			let ligas = await modeloLiga.find();
			ligas = ligas
				.filter((liga) => liga.plantillasUsuarios.length < liga.maxJugadores)
				.filter(
					(liga) =>
						liga.plantillasUsuarios
							.map((plantilla) => plantilla.usuario.id)
							.indexOf(usuario.id) === -1
				)
				.filter(
					(liga) => !liga.configuracion?.includes('{"ligaPrivada":true}')
				);
			ligas = shuffle(ligas);

			if (ligas.length === 0)
				return res.status(404).json({ message: "No hay ligas disponibles" });

			return res.status(200).json(ligas[0]);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const deleteUsuarioFromLiga: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const idLiga = req.params.idLiga.toString();

		const usuario = (await modeloUsuario.findOne({
			id: req.params.idUsuario.toString(),
		})) as IUsuario;
		const verified = await verifyUser(email, token);

		if (!usuario || !verified)
			return res.status(401).json({ message: "Usuario no autenticado" });

		if (usuario.email !== email)
			return res.status(403).json({ message: "Usuario no autorizado" });

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

		liga.plantillasUsuarios = liga.plantillasUsuarios.filter(
			(plantilla) => plantilla.usuario.id !== usuario.id
		);

		liga.propiedadJugadores = liga.propiedadJugadores.map((propiedad) => {
			if (propiedad.usuario.id === usuario.id) {
				propiedad.usuario = crearJugadorOwnerLaLiga();
			}
			return propiedad;
		});

		liga.mercado = liga.mercado
			.filter((propiedad) => {
				return propiedad.usuario.id !== usuario.id;
			})
			.map((propiedad) => {
				propiedad.venta.ofertas = propiedad.venta.ofertas.filter((oferta) => {
					return oferta.comprador.id !== usuario.id;
				});
				return propiedad;
			});

		await liga.save();
		usuario.ligas = usuario.ligas.filter((id) => id !== liga.id);
		await modeloUsuario.updateOne({ id: usuario.id }, usuario);

		return res.status(204).json({ message: "Usuario eliminado de la liga" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

function crearJugadorOwnerLaLiga(): IUsuario {
	return new modeloUsuario({
		id: "-1",
		nombre: "liga",
		usuario: "liga",
		email: "liga",
		contraseña: "liga",
		ligas: [],
		admin: false,
	});
}
