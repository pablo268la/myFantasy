import { RequestHandler } from "express";

import { openJSON } from "../helpers/jsonHelper";
import {
	calcularPuntuacion,
	createPuntuacionJugadorVacia,
} from "../helpers/puntuacionHelper";
import { modeloJugador } from "../model/jugador";
import {
	IPuntuacionJugador,
	modelPuntuacionJugador,
} from "../model/puntuacion/puntuacionJugador";
import { modeloUsuario } from "../model/usuario";
import { verifyUser } from "./usuariosController";

export const getPuntuacionesJugador: RequestHandler = async (req, res) => {
	try {
		const jugador = await modeloJugador.findOne({ id: req.params.idJugador });
		if (!jugador) return res.json([]);

		const puntuaciones = await modelPuntuacionJugador.find({
			idJugador: jugador.id,
		});

		const result: IPuntuacionJugador[] = [];
		for (let i = 1; i < 39; i++) {
			result.push(
				createPuntuacionJugadorVacia(jugador.id, i, jugador.equipo.id)
			);
		}

		puntuaciones.forEach((puntuacion) => {
			result[puntuacion.semana - 1] = puntuacion;
		});

		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const getPuntuacionesJugadorJornada: RequestHandler = async (
	req,
	res
) => {
	try {
		const semana = parseInt(req.params.semana);
		const jugador = await modeloJugador.findOne({ id: req.params.idJugador });
		if (!jugador)
			return res.status(404).json({ message: "Jugador no encontrado" });

		if (semana < 1 || semana > 38) {
			return res.status(404).json({ message: "Semana no encontrada" });
		}

		let puntuacion = await modelPuntuacionJugador.findOne({
			idJugador: jugador.id,
			semana: semana,
		});

		if (!puntuacion) {
			puntuacion = createPuntuacionJugadorVacia(
				jugador.id,
				semana,
				jugador.equipo.id
			) as any;
		}
		res.status(200).json(puntuacion);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const guardarPuntuacion: RequestHandler = async (req, res) => {
	try {
		const email = req.headers.email as string;
		const token = req.headers.token as string;

		const verified = await verifyUser(email, token);
		const usuario = (await modeloUsuario.find({ email: email })).at(0);

		if (!verified) {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}

		if (usuario === undefined || !usuario.admin) {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}

		let puntuacionJugador: any = new modelPuntuacionJugador(req.body);
		const jugador = await modeloJugador.findOne({
			id: puntuacionJugador.idJugador,
		});

		if (!jugador) {
			return res.status(404).json({ message: "Jugador no encontrado" });
		}

		const exists = await modelPuntuacionJugador.findOne({
			idJugador: puntuacionJugador.idJugador,
			idPartido: puntuacionJugador.idPartido,
		});

		const PuntuacionJSON = openJSON(jugador.posicion);
		puntuacionJugador = calcularPuntuacion(puntuacionJugador, PuntuacionJSON);
		puntuacionJugador.id =
			puntuacionJugador.idJugador + "-" + puntuacionJugador.idPartido;

		let puntuacionGuardada = null;
		if (exists) {
			puntuacionJugador._id = exists._id;
			puntuacionGuardada = await modelPuntuacionJugador.findOneAndUpdate(
				{
					idJugador: puntuacionJugador.idJugador,
					idPartido: puntuacionJugador.idPartido,
				},
				puntuacionJugador,
				{ new: true }
			);
		} else {
			puntuacionGuardada = await puntuacionJugador.save();
		}

		const puntuaciones = await modelPuntuacionJugador.find({
			idJugador: jugador.id,
		});
		jugador.puntos = puntuaciones.reduce(
			(acc, puntuacion) => acc + puntuacion.puntos,
			0
		);
		await jugador.save();

		res.status(200).json(puntuacionGuardada);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};
