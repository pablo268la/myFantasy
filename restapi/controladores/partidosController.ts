import { RequestHandler } from "express";
import { modeloPartido } from "../model/partido";
import {
	IPuntuacionJugador,
	modelPuntuacionJugador,
} from "../model/puntuacion/puntuacionJugador";
import { modeloUsuario } from "../model/usuario";
import { verifyUser } from "./usuariosController";

export const getPartido: RequestHandler = async (req, res) => {
	try {
		const partido = await modeloPartido.findOne({ id: req.params.id });
		if (!partido)
			return res.status(404).json({ message: "Partido no encontrado" });
		return res.status(200).json(partido);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const getPartidosJornada: RequestHandler = async (req, res) => {
	try {
		const partidos = await modeloPartido.find({ jornada: req.params.jornada });
		if (partidos.length === 0)
			return res.status(404).json({ message: "Partidos no encontrados" });
		return res.status(200).json(partidos);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const getPuntuacionesPartido: RequestHandler = async (req, res) => {
	try {
		const partidos = await modeloPartido.find({ id: req.params.idPartido });
		if (partidos.filter((p) => p.id === req.params.idPartido).length === 0)
			return res.status(404).json({ message: "Partido no encontrado" });

		const puntuacionesJornada: IPuntuacionJugador[] =
			await modelPuntuacionJugador.find({
				idPartido: req.params.idPartido,
			});
		return res.status(200).json(puntuacionesJornada);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const getPartidosEquipo: RequestHandler = async (req, res) => {
	try {
		const partidos = await modeloPartido.find({
			$or: [
				{ "local.id": req.params.idEquipo },
				{ "visitante.id": req.params.idEquipo },
			],
		});
		if (partidos.length === 0)
			return res.status(404).json({ message: "Partidos no encontrados" });
		return res.status(200).json(partidos);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const updatePartido: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;

		const verified = await verifyUser(email, token);
		const usuario = (await modeloUsuario.find({ email: email })).at(0);

		if (!verified) {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}

		if (usuario === undefined || !usuario.admin) {
			return res.status(403).json({ message: "Usuario no administrador" });
		}

		const partido = await modeloPartido.findOneAndUpdate(
			{ id: req.params.id },
			req.body,
			{ new: true }
		);
		if (!partido)
			return res.status(404).json({ message: "Partido no encontrado" });
		return res.status(200).json(partido);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};
