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
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	try {
		let usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			const ligaEncontrada = await modeloLiga.findById(req.params.id);
			if (!ligaEncontrada)
				return res.status(404).json({ message: "Liga no encontrada" });

			if (
				ligaEncontrada.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) === -1
			)
				return res
					.status(409)
					.json({ message: "Usuario no pertence a esta liga" });

			return res.status(200).json(ligaEncontrada);
		} else {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Error interno. Pruebe más tarde"});
	}
};

export const getLigasUsuario: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	try {
		let usuario = await modeloUsuario.findOne({ id: req.params.idUsuario });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			let ligas = [];
			for (let i = 0; i < usuario.ligas.length; i++) {
				const liga = await modeloLiga.findById(usuario.ligas[i]);
				ligas.push(liga);
			}
			return res.status(200).json(ligas);
		} else {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Error interno. Pruebe más tarde"});
	}
};

export const createLiga: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;

	let usuario = await modeloUsuario.findOne({ email: email });

	const verified = await verifyUser(email, token);

	try {
		if (usuario && verified) {
			if (usuario.ligas.length >= 5) {
				return res
					.status(409)
					.json({ message: "No puedes participar en más de 5 ligas." });
			}

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

			usuario.ligas.push(ligaGuardada._id);
			await usuario.save();
			return res.status(201).json(ligaGuardada);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Error interno. Pruebe más tarde"});
	}
};

export const añadirUsuarioALiga: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	const idLiga = req.params.idLiga;

	let usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);
	try {
		if (usuario && verified) {
			let liga = await modeloLiga.findById(idLiga);
			if (
				!liga ||
				liga.plantillasUsuarios.length >= liga.maxJugadores ||
				liga.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) !== -1
			)
				return res.status(409);

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
		return res.status(500).json({message: "Error interno. Pruebe más tarde"});
	}
};

export const getRandomLiga: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;

	const usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);

	try {
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
				return res.status(404).json({ message: "No existe liga disponible para unirse" });

			return res.status(200).json(ligas[0]);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Error interno. Pruebe más tarde"});
	}
};

export const checkJoinLiga: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	const idLiga = req.params.idLiga;

	const usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);

	try {
		if (usuario && verified) {
			const liga = await modeloLiga.findById(idLiga);
			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });
			if (
				liga.plantillasUsuarios.length >= liga.maxJugadores ||
				liga.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) !== -1
			)
				return res.status(409).json({
					message:
						"No es posible unirse a la liga. No existe Completa, Maximo superado o Ya pertenece.",
				});

			return res.status(200).json({ message: "Usuario autorizado" });
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Error interno. Pruebe más tarde"});
	}
};
