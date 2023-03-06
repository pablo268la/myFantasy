import { RequestHandler } from "express";
import { modelPuntuacionJugador } from "../model/puntuacion/puntuacionJugador";

export const getPuntuacionesJugadores: RequestHandler = async (req, res) => {
	try {
		res.status(200).json(await modelPuntuacionJugador.find());
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getPuntuacionesJugador: RequestHandler = async (req, res) => {
	try {
		res
			.status(200)
			.json(
				await modelPuntuacionJugador.find({ idJugador: req.params.idJugador })
			);
	} catch (error) {
		res.status(500).json(error);
	}
};
