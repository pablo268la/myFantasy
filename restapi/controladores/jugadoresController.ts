import { RequestHandler } from "express";
import { modeloAlineacionJugador } from "../model/alineacionJugador";
import { modeloJugador } from "../model/jugador";
import { modeloPlantillaUsuario } from "../model/plantillaUsuario";

export const getJugadores: RequestHandler = async (req, res) => {
	res.json(await modeloJugador.find());
};

export const getJugadoresEquipo: RequestHandler = async (req, res) => {
	const idEquipo = req.params.idEquipo;

	res.json(
		await modeloJugador.find({
			idEquipo: idEquipo,
		})
	);
};

export const getJugador: RequestHandler = async (req, res) => {
	res.json(await modeloJugador.findOne({ _id: req.params.idJugador }));
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
