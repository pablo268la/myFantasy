import { RequestHandler } from "express";
import * as UUID from "uuid";
import {
	IAlineacionJugador,
	modeloAlineacionJugador,
} from "../model/alineacionJugador";
import { IJugador, modeloJugador } from "../model/jugador";
import { ILiga, modeloLiga } from "../model/liga";
import {
	IPlantillaUsuario,
	modeloPlantillaUsuario,
} from "../model/plantillaUsuario";
import { IPropiedadJugador } from "../model/propiedadJugador";
import { modeloUsuario } from "../model/usuario";
import { modeloVenta } from "../model/venta";
import { verifyUser } from "./usuariosController";

export const getPlantilla: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;

	let usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);
	try {
		if (usuario && verified) {
			const idLiga = req.params.idLiga;
			const idUsuario = req.params.idUsuario;

			const liga = await modeloLiga.findOne({ id: idLiga });

			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });

			const p = liga.plantillasUsuarios
				.filter((plantilla) => {
					return plantilla.usuario.id === idUsuario;
				})
				.pop();

			if (!p)
				return res.status(404).json({ message: "Plantilla no encontrada" });

			await actualizarDatosDeJugadoresDesdeBD(p.alineacionJugador.porteros);
			await actualizarDatosDeJugadoresDesdeBD(p.alineacionJugador.defensas);
			await actualizarDatosDeJugadoresDesdeBD(p.alineacionJugador.medios);
			await actualizarDatosDeJugadoresDesdeBD(p.alineacionJugador.delanteros);
			p.valor = calcularValorAlineacion(p.alineacionJugador);
			// TODO: Checkear cambio de posiciones

			await liga.save();
			return res.status(200).json(p);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export const updatePlantillaUsuario: RequestHandler = async (req, res) => {
	const email = req.headers.email as string;
	const token = req.headers.token as string;

	let usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);

	try {
		if (usuario && verified) {
			const plantillaParaActualizar = req.body.plantilla as IPlantillaUsuario;
			const idLiga = req.body.idLiga;

			const liga = await modeloLiga.findOne({ id: idLiga });

			if (!liga) return res.status(404).json({ message: "Liga no encontrada" });
			if (
				liga.plantillasUsuarios.filter(
					(plantilla) => plantilla.id === plantillaParaActualizar.id
				).length === 0
			)
				return res.status(404).json({ message: "Plantilla no encontrada" });

			liga.plantillasUsuarios = liga.plantillasUsuarios.map(
				(plantillaUsuario) => {
					if (plantillaUsuario.id === plantillaParaActualizar.id)
						return plantillaParaActualizar;
					else return plantillaUsuario;
				}
			);

			await liga.save();
			return res.status(200).json(plantillaParaActualizar);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error interno. Pruebe más tarde" });
	}
};

export async function crearPlantillaParaUsuarioYGuardar(
	usuario: any,
	liga: ILiga
) {
	let delanteros = liga.propiedadJugadores
		.filter((propiedad) => propiedad.jugador.posicion === "Delantero")
		.filter((propiedad) => propiedad.usuario.id === "-1")
		.map((propiedad) => propiedad.jugador);
	let mediocentros = liga.propiedadJugadores
		.filter((propiedad) => propiedad.jugador.posicion === "Mediocentro")
		.filter((propiedad) => propiedad.usuario.id === "-1")
		.map((propiedad) => propiedad.jugador);
	let defensas = liga.propiedadJugadores
		.filter((propiedad) => propiedad.jugador.posicion === "Defensa")
		.filter((propiedad) => propiedad.usuario.id === "-1")
		.map((propiedad) => propiedad.jugador);
	let porteros = liga.propiedadJugadores
		.filter((propiedad) => propiedad.jugador.posicion === "Portero")
		.filter((propiedad) => propiedad.usuario.id === "-1")
		.map((propiedad) => propiedad.jugador);

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
		id: UUID.v4(),
		porteros: porPlantilla,
		defensas: defPlantilla,
		medios: medPlantilla,
		delanteros: delPlantilla,
		formacion: "4-3-3",
		guardadoEn: new Date().toISOString(),
		idLiga: liga.id,
	});
	const plantillaUsuario = new modeloPlantillaUsuario({
		id: UUID.v4(),
		idLiga: liga.id,
		usuario: usuario,
		alineacionJugador: alineacionJugador,
		alineacionesJornada: [],
		valor: calcularValorAlineacion(alineacionJugador),
		puntos: 0,
		dinero: 100000000,
	});

	liga.plantillasUsuarios.push(plantillaUsuario);

	intercambiarPropiedades(porPlantilla, liga);
	intercambiarPropiedades(defPlantilla, liga);
	intercambiarPropiedades(medPlantilla, liga);
	intercambiarPropiedades(delPlantilla, liga);

	if (usuario.ligas.indexOf(liga.id) === -1) {
		usuario.ligas.push(liga.id);
		await usuario.save();
	}

	await modeloLiga.create(liga);
	return plantillaUsuario;
}

export function intercambiarPropiedades(
	jugadoresACambiarPropiedad: IPropiedadJugador[],
	liga: ILiga
) {
	for (let i = 0; i < jugadoresACambiarPropiedad.length; i++) {
		liga.propiedadJugadores.forEach((pj) => {
			if (jugadoresACambiarPropiedad[i].jugador.id === pj.jugador.id) {
				pj.usuario = jugadoresACambiarPropiedad[i].usuario;
			}
		});
	}
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
		posPlantilla.push({
			jugador: j,
			usuario: usuario,
			titular: false,
			venta: new modeloVenta({
				enVenta: false,
				ofertas: [],
				fechaLimite: new Date().toISOString(),
			}),
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
		j.jugador = (await modeloJugador.findOne({ id: j.jugador.id })) as any;
		j.usuario = (await modeloUsuario.findOne({ id: j.usuario.id })) as any;
	}
}
