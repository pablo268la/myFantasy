import { RequestHandler } from "express";
import { modeloJugador } from "../model/jugador";
import { modeloLiga } from "../model/liga";
import {
	IPropiedadJugador,
	modeloPropiedadJugador,
} from "../model/propiedadJugador";
import { modeloUsuario } from "../model/usuario";
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

		if (usuario && verified) {
			// TODO -Diferenciar usuario y verified
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
		} else {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}
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

		if (usuario && verified) {
			let ligas = [];
			for (let i = 0; i < usuario.ligas.length; i++) {
				const liga = await modeloLiga.findOne({ id: usuario.ligas[i] });
				ligas.push(liga);
			}
			return res.status(200).json(ligas);
		} else {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}
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
				usuario: new modeloUsuario({
					id: "-1",
					nombre: "liga",
					usuario: "liga",
					email: "liga",
					contraseña: "liga",
					ligas: [],
					admin: false,
				}),
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
			let liga = await modeloLiga.findOne({ id: idLiga });

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
