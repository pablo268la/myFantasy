import { RequestHandler } from "express";
import { IJugador, modeloJugador } from "../model/jugador";
import { modeloUsuario } from "../model/usuario";
import { verifyUser } from "./usuariosController";

export const getJugadores: RequestHandler = async (req, res) => {
	try {
		let jugadores = await modeloJugador.find();
		jugadores.map(async (jugador) => {
			jugador.puntos = 0;
			return await jugador.save();
		});
		res.status(200).json(jugadores);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const getJugadoresEquipo: RequestHandler = async (req, res) => {
	try {
		const j = await modeloJugador.find({
			"equipo.id": req.params.idEquipo,
		});
		res.status(200).json(j);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const getJugador: RequestHandler = async (req, res) => {
	try {
		const j = await modeloJugador.findOne({ id: req.params.idJugador });
		//			.populate("equipo.id")
		if (j) {
			res.status(200).json(j);
		} else {
			res.status(404).json({ message: "Jugador no encontrado" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const getJugadoresAntiguos: RequestHandler = async (req, res) => {
	try {
		const j = await modeloJugador.find({
			"jugadorAntiguo.equipo.id": req.params.idEquipo,
			"jugadorAntiguo.jornadaTraspaso": { $lte: req.params.semana },
		});
		res.status(200).json(j);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const updateJugador: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const jugadorRequqest = req.body as IJugador;

		const usuario = (await modeloUsuario.find({ email: email })).at(0);
		const verified = await verifyUser(email, token);

		if (!verified) {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}

		if (usuario === undefined || !usuario.admin) {
			return res.status(403).json({ message: "Usuario no administrador" });
		}

		const j = (await modeloJugador.find({ id: req.params.idJugador })).at(0);
		if (j === undefined) {
			return res.status(404).json({ message: "Jugador no encontrado" });
		}

		if (j !== undefined && j.equipo.id !== req.body.equipo.id) {
			jugadorRequqest.jugadorAntiguo = {
				equipo: j.equipo,
				jornadaTraspaso: 1,
			};
		}

		const jugador = await modeloJugador.findOneAndUpdate(
			{ id: req.params.idJugador },
			jugadorRequqest,
			{ new: true }
		);
		res.status(200).json(jugador);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};
