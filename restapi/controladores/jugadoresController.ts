import { RequestHandler } from "express";
import { modeloJugador } from "../model/jugador";

export const getJugadores: RequestHandler = async (req, res) => {
	let jugadores = await modeloJugador.find();
	jugadores.map(async (jugador) => {
		jugador.puntos = 0;
		return await jugador.save();
	});
	res.json(jugadores);
};

export const getJugadoresEquipo: RequestHandler = async (req, res) => {
	try {
		const j = await modeloJugador.find({
			"equipo._id": req.params.idEquipo,
		});
		res.json(j);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getJugador: RequestHandler = async (req, res) => {
	try {
		const j = await modeloJugador.findOne({ _id: req.params.idJugador });
		//			.populate("equipo._id")
		if (j) {
			res.json(j);
		} else {
			res.status(404).json({ message: "Jugador no encontrado" });
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getJugadoresAntiguos: RequestHandler = async (req, res) => {
	try {
		res.json(
			await modeloJugador.find({
				"jugadorAntiguo.equipo._id": req.params.idEquipo,
				"jugadorAntiguo.jornadaTraspaso": { $lte: req.params.semana },
			})
		);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const updateJugador: RequestHandler = async (req, res) => {
	//TODO: Validar que el usuario que hace la petición es administrador
	//TODO: Si el jugador cambia de equipo, hay que actualizar el equipo antiguo
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
