import { RequestHandler } from "express";
import * as UUID from "uuid";
import {
	IAlineacionJugador,
	modeloAlineacionJugador,
} from "../model/alineacionJugador";
import { IJugador, modeloJugador } from "../model/jugador";
import { modeloLiga } from "../model/liga";
import {
	IPlantillaUsuario,
	modeloPlantillaUsuario,
} from "../model/plantillaUsuario";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { modeloUsuario } from "../model/usuario";
import { verifyUser } from "./usuariosController";

export const getPlantilla: RequestHandler = async (req, res) => {
	const idLiga = req.params.idLiga;
	const idUsuario = req.params.idUsuario;

	const p = (await modeloPlantillaUsuario.findOne({
		idLiga: idLiga,
		"usuario.id": idUsuario,
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

export const createPlantillaUsuario: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;

	let usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);
	try {
		if (usuario && verified) {
			const idLiga = req.body.idLiga;

			const plantillaGuardada = await crearPlantillaParaUsuarioYGuardar(
				usuario,
				idLiga
			);

			return res.status(201).json(plantillaGuardada);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

export const updatePlantillaUsuario: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;

	let usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);

	try {
		if (usuario && verified) {
			const plantillaParaActualizar = req.body as IPlantillaUsuario;
			const plantillaActualizada =
				await modeloPlantillaUsuario.findByIdAndUpdate(
					plantillaParaActualizar._id,
					plantillaParaActualizar,
					{ new: true }
				);
			return res.status(200).json(plantillaActualizada);
		}
	} catch (error) {
		return res.status(500).json(error);
	}
};

export async function crearPlantillaParaUsuarioYGuardar(
	usuario: any,
	idLiga: string
) {
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
		guardadoEn: new Date().toISOString(),
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
	return plantillaGuardada;
}

export function calcularValorAlineacion(
	alineacion: IAlineacionJugador
): number {
	let valor = 0;

	alineacion.porteros.forEach((p) => (valor += p.jugador.valor));
	alineacion.defensas.forEach((d) => (valor += d.jugador.valor));
	alineacion.medios.forEach((m) => (valor += m.jugador.valor));
	alineacion.delanteros.forEach((d) => (valor += d.jugador.valor));

	return valor;
}

function crearListaPropiedadJugador(jugadores: IJugador[], usuario: any) {
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

export function shuffle(array: any[]): any[] {
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

async function actualizarDatosDeJugadoresDesdeBD(
	propiedades: IPropiedadJugador[]
) {
	for (let j of propiedades) {
		j.jugador = (await modeloJugador.findOne({ _id: j.jugador._id })) as any;
		j.usuario = (await modeloUsuario.findOne({ id: j.usuario.id })) as any;
	}
}
