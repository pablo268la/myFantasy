import { RequestHandler } from "express";
import { IJugador, modeloJugador } from "../model/jugador";

export const getJugadoresEquipo: RequestHandler = async (req, res) => {
	const idEquipo = req.params.idEquipo;

	let jugadoresEquipo: IJugador[] | null = await modeloJugador.find({
		idEquipo: idEquipo,
	});

	res.json(jugadoresEquipo);
};

export const getJugador: RequestHandler = async (req, res) => {
	res.json(await modeloJugador.findOne({ _id: req.params.idJugador }));
};
