import { RequestHandler } from "express";
import * as UUID from "uuid";
import {
	IAlineacionJugador,
	modeloAlineacionJugador,
} from "../model/alineacionJugador";
import { IJugador, modeloJugador } from "../model/jugador";
import { modeloLiga } from "../model/liga";
import { modeloPlantillaUsuario } from "../model/plantillaUsuario";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { IUsuario, modeloUsuario } from "../model/usuario";
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

			if (
				ligaEncontrada.plantillasUsuarios
					.map((plantilla) => plantilla.usuario.id)
					.indexOf(usuario.id) === -1
			)
				return res
					.status(401)
					.json({ message: "Usuario no autorizado: No pertence a esta liga" });

			return res.status(200).json(ligaEncontrada);
		} else {
			console.log("Usuario no autorizado");
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
		let usuario = await modeloUsuario.findOne({ id: req.params.idUsuario });
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

	let usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);
	try {
		if (usuario && verified) {
			//Verificar que el usuario no tenga ya una plantilla en la liga
			const idLiga = req.body.idLiga;

			let delanteros = await modeloJugador.find({ posicion: "Delantero" });
			let mediocentros = await modeloJugador.find({ posicion: "Mediocentro" });
			let defensas = await modeloJugador.find({ posicion: "Defensa" });
			let porteros = await modeloJugador.find({ posicion: "Portero" });

			let porPlantilla: IPropiedadJugador[] = crearListaPropiedadJugador(
				shuffle(porteros).slice(0, 2),
				usuario
			);
			let defPlantilla: IPropiedadJugador[] = crearListaPropiedadJugador(
				shuffle(defensas).slice(0, 5),
				usuario
			);
			let medPlantilla: IPropiedadJugador[] = crearListaPropiedadJugador(
				shuffle(mediocentros).slice(0, 5),
				usuario
			);
			let delPlantilla: IPropiedadJugador[] = crearListaPropiedadJugador(
				shuffle(delanteros).slice(0, 4),
				usuario
			);

			const alineacionJugador = new modeloAlineacionJugador({
				_id: UUID.v4(),
				porteros: porPlantilla,
				defensas: defPlantilla,
				medios: medPlantilla,
				delanteros: delPlantilla,
				formacion: "4-3-3",
				guardadoEn: Date.now().toString(),
				idLiga: idLiga,
			});
			const plantillaUsuario = new modeloPlantillaUsuario({
				_id: UUID.v4(),
				idLiga: idLiga,
				usuario: usuario,
				alineacionJugador: alineacionJugador,
				alineacionesJornada: [],
				valor: calcularValorAlineacion(alineacionJugador),
				puntos: 0,
			});
			const plantillaGuardada = await plantillaUsuario.save();

			const liga = await modeloLiga.findById(idLiga);
			if (liga) {
				liga.plantillasUsuarios.push(plantillaGuardada);
				liga.propiedadJugadores.push(...porPlantilla);
				liga.propiedadJugadores.push(...defPlantilla);
				liga.propiedadJugadores.push(...medPlantilla);
				liga.propiedadJugadores.push(...delPlantilla);

				if (usuario.ligas.indexOf(idLiga) === -1) {
					usuario.ligas.push(idLiga);
					await usuario.save();
				}
				await liga.save();
			}

			return res.status(200).json(plantillaGuardada);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

function calcularValorAlineacion(alineacion: IAlineacionJugador): number {
	let valor = 0;

	alineacion.porteros.forEach((p) => (valor += p.jugador.valor));
	alineacion.defensas.forEach((d) => (valor += d.jugador.valor));
	alineacion.medios.forEach((m) => (valor += m.jugador.valor));
	alineacion.delanteros.forEach((d) => (valor += d.jugador.valor));

	return valor;
}

function crearListaPropiedadJugador(jugadores: IJugador[], usuario: IUsuario) {
	let posPlantilla: IPropiedadJugador[] = [];
	jugadores.forEach((j) => {
		console.log(j);
		posPlantilla.push({
			jugador: j,
			usuario: usuario,
			titular: false,
		});
	});
	return posPlantilla;
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
