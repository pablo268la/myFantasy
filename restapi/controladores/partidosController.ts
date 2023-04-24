import { RequestHandler } from "express";
import { modeloPartido } from "../model/partido";
import {
	IPuntuacionJugador,
	modelPuntuacionJugador,
} from "../model/puntuacion/puntuacionJugador";

export const getPartido: RequestHandler = async (req, res) => {
	//TODO -- Validar en todas las request que los params son correctos - Lanzar BAD REQUEST (400)
	try {
		const partido = await modeloPartido.findById(req.params.id);
		if (!partido)
			return res.status(404).json({ message: "Partido no encontrado" });
		return res.status(200).json(partido);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getPartidosJornada: RequestHandler = async (req, res) => {
	try {
		const partidos = await modeloPartido.find({ jornada: req.params.jornada });
		if (partidos.length === 0)
			return res.status(404).json({ message: "Partidos no encontrados" });
		return res.status(200).json(partidos);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getPuntuacionesPartido: RequestHandler = async (req, res) => {
	try {
		const puntuacionesJornada: IPuntuacionJugador[] =
			await modelPuntuacionJugador.find({
				idPartido: req.params.idPartido,
			});
		const partidos = await modeloPartido.find({ _id: req.params.idPartido });
		if (
			puntuacionesJornada.length === 0 &&
			partidos.filter((p) => p.id === req.params.idPartido).length === 0
		)
			return res.status(404).json({ message: "Partido no encontrado" });
		else return res.status(200).json(puntuacionesJornada);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

export const getPartidosEquipo: RequestHandler = async (req, res) => {
	try {
		const partidos = await modeloPartido.find({
			$or: [
				{ "local._id": req.params.idEquipo },
				{ "visitante._id": req.params.idEquipo },
			],
		});
		if (partidos.length === 0)
			return res.status(404).json({ message: "Partidos no encontrados" });
		return res.status(200).json(partidos);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const updatePartido: RequestHandler = async (req, res) => {
	// Check admin
	try {
		const partido = await modeloPartido.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		);
		if (!partido)
			return res.status(404).json({ message: "Partido no encontrado" });
		return res.status(200).json(partido);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};
