import { RequestHandler } from "express";
import { modeloJugador } from "../model/jugador";

export const getJugadores: RequestHandler = async (req, res) => {
	res.json(await modeloJugador.find());
};

export const getJugadoresEquipo: RequestHandler = async (req, res) => {
	const idEquipo = req.params.idEquipo;

	res.json(
		await modeloJugador.find({
			"equipo._id": idEquipo,
		})
	);
};

export const getJugador: RequestHandler = async (req, res) => {
	res.json(await modeloJugador.findOne({ _id: req.params.idJugador }));
};

export const updateJugador: RequestHandler = async (req, res) => {
	//TODO: Validar que el usuario que hace la petición es administrador
	const jugador = await modeloJugador.findOneAndUpdate(
		{ _id: req.params.idJugador },
		req.body,
		{ new: true }
	);
	res.json(jugador);
};
