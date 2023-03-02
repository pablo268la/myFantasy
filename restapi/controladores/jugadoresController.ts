import { RequestHandler } from "express";
import { modeloJugador } from "../model/jugador";

export const getJugadores: RequestHandler = async (req, res) => {
	res.json(await modeloJugador.find());
};

export const getJugadoresEquipo: RequestHandler = async (req, res) => {
	try {
		res.json(
			await modeloJugador.find({
				"equipo._id": req.params.idEquipo,
			})
		);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getJugador: RequestHandler = async (req, res) => {
	try {
		res.json(await modeloJugador.findOne({ _id: req.params.idJugador }));
	} catch (error) {
		res.status(500).json(error);
	}
};

export const updateJugador: RequestHandler = async (req, res) => {
	//TODO: Validar que el usuario que hace la petición es administrador
	try {
		const jugador = await modeloJugador.findOneAndUpdate(
			{ _id: req.params.idJugador },
			req.body,
			{ new: true }
		);
		res.json(jugador);
	} catch (error) {
		res.status(500).json(error);
	}
};
