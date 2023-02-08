import { RequestHandler } from "express";
import { modeloAlineacionJugador } from "../model/alineacionJugador";
import { modeloJugador } from "../model/jugador";
import {
	IPlantillaUsuario,
	modeloPlantillaUsuario,
} from "../model/plantillaUsuario";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { modeloUsuario } from "../model/usuario";
import { calcularValorAlineacion } from "./ligasController";

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

export const getPlantilla: RequestHandler = async (req, res) => {
	const idLiga = req.params.idLiga;
	const idUsuario = req.params.idUsuario;

	const p = (await modeloPlantillaUsuario.findOne({
		idLiga: idLiga,
		idUsuario: idUsuario,
	})) as IPlantillaUsuario;

	await actualizarDatosDeJugadoresDesdeBD(p.alineacionJugador.porteros);
	await actualizarDatosDeJugadoresDesdeBD(p.alineacionJugador.defensas);
	await actualizarDatosDeJugadoresDesdeBD(p.alineacionJugador.medios);
	await actualizarDatosDeJugadoresDesdeBD(p.alineacionJugador.delanteros);
	p.valor = calcularValorAlineacion(p.alineacionJugador);
	//TODO: Checkear cambio de posiciones

	const p2 = await modeloPlantillaUsuario.findOneAndUpdate({ _id: p._id }, p, {
		new: true,
	});

	res.json(p2);
};

export const getAlineacionJugador: RequestHandler = async (req, res) => {
	res.json(await modeloAlineacionJugador.find());
};

export async function actualizarDatosDeJugadoresDesdeBD(
	propiedades: IPropiedadJugador[]
) {
	for (let j of propiedades) {
		j.jugador = (await modeloJugador.findOne({ _id: j.jugador._id })) as any;
		j.usuario = (await modeloUsuario.findOne({ id: j.usuario.id })) as any;
	}
}
