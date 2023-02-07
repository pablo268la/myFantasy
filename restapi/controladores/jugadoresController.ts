import { RequestHandler } from "express";
import { modeloAlineacionJugador } from "../model/alineacionJugador";
import { modeloEquipo } from "../model/equipo";
import { modeloJugador } from "../model/jugador";
import { modeloPlantillaUsuario } from "../model/plantillaUsuario";

export const getJugadores: RequestHandler = async (req, res) => {
	res.json(await modeloJugador.find());
};

export const getJugadoresEquipo: RequestHandler = async (req, res) => {
	const idEquipo = req.params.idEquipo;

	const e = await modeloEquipo.findOne({ _id: idEquipo });

	res.json(
		await modeloJugador.find({
			equipo: e,
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

export const getPlantilla: RequestHandler = async (req, res) => {
	const idLiga = req.params.idLiga;
	const idUsuario = req.params.idUsuario;

	const p = await modeloPlantillaUsuario.find({
		idLiga: idLiga,
		idUsuario: idUsuario,
	});
	res.json(p[0]);
};
export const getAlineacionJugador: RequestHandler = async (req, res) => {
	res.json(await modeloAlineacionJugador.find());
};
