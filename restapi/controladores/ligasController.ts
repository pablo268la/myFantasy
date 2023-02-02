import { RequestHandler } from "express";
import * as UUID from "uuid";
import { modeloAlineacionJugador } from "../model/alineacionJugador";
import { IJugador, modeloJugador } from "../model/jugador";
import { IJugadorEnPlantilla } from "../model/jugadorEnPlantilla";
import { modeloLiga } from "../model/liga";
import { modeloPlantillaUsuario } from "../model/plantillaUsuario";
import { modeloUsuario } from "../model/usuario";
import { verifyUser } from "./usuariosController";

export const getLiga: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	try {
		let usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			const ligaEncontrada = await modeloLiga.findById(req.params.id);
			if (!ligaEncontrada) return res.status(204).json();

			if (ligaEncontrada.idUsuarios.indexOf(usuario.id) === -1)
				return res
					.status(401)
					.json({ message: "Usuario no autorizado: No pertence a esta liga" });

			return res.status(200).json(ligaEncontrada);
		} else {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}
	} catch (error) {
		return res.status(500).json(error);
	}
};

export const getLigasUsuario: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	try {
		let usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			return res.status(200).json(usuario.ligas);
		} else {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

export const createLiga: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;

	let usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);
	try {
		if (usuario && verified) {
			if (usuario.ligas.length >= 5) {
				return res
					.status(401)
					.json({ message: "No puedes participar en más de 5 ligas." });
			}

			let liga = new modeloLiga(req.body.liga);

			const ligaGuardada = await liga.save();

			usuario.ligas.push(ligaGuardada._id);
			await usuario.save();
			return res.status(201).json(ligaGuardada);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

export const createPlantillaUsuario: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;
	console.log("1");

	let usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);
	try {
		if (usuario && verified) {
			const idLiga = req.body.idLiga;
			const idUsuario = req.body.idUsuario;

			let delanteros = await modeloJugador.find({ posicion: "Delantero" });
			let mediocentros = await modeloJugador.find({ posicion: "Mediocentro" });
			let defensas = await modeloJugador.find({ posicion: "Defensa" });
			let porteros = await modeloJugador.find({ posicion: "Portero" });

			delanteros = shuffle(delanteros).slice(0, 4);
			mediocentros = shuffle(mediocentros).slice(0, 5);
			defensas = shuffle(defensas).slice(0, 5);
			porteros = shuffle(porteros).slice(0, 2);

			const alineacionJugador = crearAlineacionJugador(
				delanteros,
				mediocentros,
				defensas,
				porteros
			);

			const plantillaUsuario = new modeloPlantillaUsuario({
				_id: UUID.v4(),
				idLiga: idLiga,
				idUsuario: idUsuario,
				alineacionJugador: alineacionJugador,
				alineacionesJornada: [],
				valor: 0,
				puntos: 0,
			});
			const plantillaGuardada = await plantillaUsuario.save();

			//TODO Actualizar propiedadJugadores de la liga y Comprobar que no se repiten jugadores

			return res.status(200).json(plantillaGuardada);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

function crearAlineacionJugador(
	delanteros: IJugador[],
	mediocentros: IJugador[],
	defensas: IJugador[],
	porteros: IJugador[]
) {
	let delPlantilla: IJugadorEnPlantilla[] = [];
	delanteros.forEach((j) =>
		delPlantilla.push({
			idJugador: j._id,
			enPlantilla: false,
		})
	);
	let medPlantilla: IJugadorEnPlantilla[] = [];
	mediocentros.forEach((j) =>
		medPlantilla.push({
			idJugador: j._id,
			enPlantilla: false,
		})
	);
	let defPlantilla: IJugadorEnPlantilla[] = [];
	defensas.forEach((j) =>
		defPlantilla.push({
			idJugador: j._id,
			enPlantilla: false,
		})
	);
	let porPlantilla: IJugadorEnPlantilla[] = [];
	porteros.forEach((j) =>
		porPlantilla.push({
			idJugador: j._id,
			enPlantilla: false,
		})
	);

	const alineacion = new modeloAlineacionJugador({
		_id: UUID.v4(),
		porteros: porPlantilla,
		defensas: defPlantilla,
		medios: medPlantilla,
		delanteros: delPlantilla,
		formacion: "4-3-3",
	});

	return alineacion;
}

function shuffle(array: any[]): any[] {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}
