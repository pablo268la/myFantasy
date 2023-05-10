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
		res.json(jugadores);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Error interno. Pruebe más tarde"});
	}
};

export const getJugadoresEquipo: RequestHandler = async (req, res) => {
	try {
		const j = await modeloJugador.find({
			"equipo._id": req.params.idEquipo,
		});
		res.json(j);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Error interno. Pruebe más tarde"});
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
		console.log(error);
		res.status(500).json({message: "Error interno. Pruebe más tarde"});
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
		console.log(error);
		res.status(500).json({message: "Error interno. Pruebe más tarde"});
	}
};

export const updateJugador: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;
		const jugadorRequqest = req.body as IJugador;

		const verified = await verifyUser(email, token);

		if (!verified) {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}

		const usuario = (await modeloUsuario.find({ email: email })).at(0);
		if (usuario !== undefined && usuario.admin) {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}

		const j = (await modeloJugador.find({ _id: req.params.idJugador })).at(0);
		if (j !== undefined && j.equipo._id !== req.body.equipo._id) {
			jugadorRequqest.jugadorAntiguo = {
				equipo: j.equipo,
				jornadaTraspaso: 1,
			};
		}

		const jugador = await modeloJugador.findOneAndUpdate(
			{ _id: req.params.idJugador },
			jugadorRequqest,
			{ new: true }
		);
		res.json(jugador);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Error interno. Pruebe más tarde"});
	}
};
