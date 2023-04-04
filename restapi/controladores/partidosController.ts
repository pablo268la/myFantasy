import { RequestHandler } from "express";
import { modeloPartido } from "../model/partido";
import {
	IPuntuacionJugador,
	modelPuntuacionJugador,
} from "../model/puntuacion/puntuacionJugador";

export const getPartidos: RequestHandler = async (req, res) => {
	try {
		res.status(200).json(await modeloPartido.find());
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getPartido: RequestHandler = async (req, res) => {
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
		if (!partidos)
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

		return res.status(200).json(puntuacionesJornada);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

export const getPartidosEquipo: RequestHandler = async (req, res) => {
	try {
		const partidos = await modeloPartido.find({
			$or: [{ local: req.params.idEquipo }, { visitante: req.params.idEquipo }],
		});
		if (!partidos)
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
			req.params.idPartido,
			req.body,
			{
				new: true,
			}
		);
		if (!partido)
			return res.status(404).json({ message: "Partido no encontrado" });
		return res.status(200).json(partido);
	} catch (error) {
		res.status(500).json(error);
	}
};
