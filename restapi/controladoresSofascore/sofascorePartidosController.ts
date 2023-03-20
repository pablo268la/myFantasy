/*import axios from "axios";
import { RequestHandler } from "express";
import { checkPosition, checkStatusPartido } from "../helpers/checkHelper";
import { IAlineacion, modeloAlineacion } from "../model/alineacion";
import { IJugador, modeloJugador } from "../model/jugador";
import { IJugadorAntiguo, modeloJugadorAntiguo } from "../model/jugadorAntiguo";
import { IPartido, modeloPartido } from "../model/partido";
import { urlEquipo } from "./sofascoreEquiposController";

export const urlJornada =
	"https://api.sofascore.com/api/v1/unique-tournament/8/season/42409/events/round/";
export const urlPartido = "https://api.sofascore.com/api/v1/event/";

export const getAlineacionesPartidoSofascore: RequestHandler = async (
	req,
	res
) => {
	let partido: IPartido | null = await modeloPartido.findOne({
		_id: req.body.idPartido,
	});

	if (partido !== null) res.json(await getAlineacionesDePartido(partido));
	else res.json("Partido no encontrado");
};

export const getPartidosRondaSofascore: RequestHandler = async (req, res) => {
	let partidosJornada: any[] = [];
	let result: IPartido[] = [];
	let round = req.body.round;

	await axios.get(urlJornada + round).then(async (response) => {
		partidosJornada = response.data.events;
	});

	for (let i = 0; i < partidosJornada.length; i++) {
		await new Promise((f) => setTimeout(f, 1000));
		let p = partidosJornada[i];
		let partido: IPartido | null = new modeloPartido({
			_id: p.id,
			idLocal: p.homeTeam.id,
			idVisitante: p.awayTeam.id,
			alineacionLocal: new modeloAlineacion({}),
			alineacionVisitante: new modeloAlineacion({}),
			resultadoLocal: p.homeScore.current ? p.homeScore.current : 0,
			resultadoVisitante: p.awayScore.current ? p.awayScore.current : 0,
			jornada: p.roundInfo.round,
			fecha: new Date(p.startTimestamp * 1000).toString(),
			linkSofaScore: "https://sofascore.com/" + p.slug + "/" + p.customId,
			estado: checkStatusPartido(p.status.type),
		});

		let exists = await modeloPartido.findOne({ _id: p.id });
		if (exists) {
			partido = await modeloPartido.findOneAndUpdate({ _id: p.id }, partido, {
				new: true,
			});
		} else {
			partido = await modeloPartido.create(partido);
		}

		if (partido !== null) {
			partido = await getAlineacionesDePartido(partido);
		}

		if (partido !== null) {
			result.push(partido);
		}
	}

	return res.json(result);
};

async function getAlineacionesDePartido(partido: IPartido) {
	if (new Date(partido.fecha).getTime() < new Date().getTime()) {
		return await cogerAlineaciones(partido._id);
	}
	return null;
}

async function cogerAlineaciones(idPartido: any): Promise<IPartido | null> {
	let partido: IPartido | null = await modeloPartido.findOne({
		_id: idPartido,
	});
	let jugadoresLocal: any[] = [];
	let jugadoresVisitante: any[] = [];

	if (partido !== null) {
		await new Promise((f) => setTimeout(f, 1000));
		await axios
			.get(urlPartido + idPartido + "/lineups")
			.then(async (response) => {
				jugadoresLocal = response.data.home.players;
				jugadoresVisitante = response.data.away.players;
			});

		const alineacionLocal: IAlineacion = await cogerAlineacion(
			jugadoresLocal,
			partido.idLocal,
			partido.jornada
		);

		const alineacionVisitante: IAlineacion = await cogerAlineacion(
			jugadoresVisitante,
			partido.idVisitante,
			partido.jornada
		);

		partido.alineacionLocal = alineacionLocal;
		partido.alineacionVisitante = alineacionVisitante;
		partido = await modeloPartido.create(partido);
	}
	return partido;
}

async function cogerAlineacion(
	jugadores: any,
	idEquipo: string,
	jornada: number
): Promise<IAlineacion> {
	let titulares: string[] = [];
	let suplentes: string[] = [];

	for (let i = 0; i < jugadores.length; i++) {
		let jugador = jugadores[i];
		let exists: IJugador | null = await modeloJugador.findOne({
			_id: jugador.player.id,
		});

		if (exists === null) {
			exists = await modeloJugador.create(createJugadorNoDisponible(jugador));
		}

		if (exists.equipo._id !== idEquipo) {
			let jugadorAntiguo: IJugadorAntiguo = new modeloJugadorAntiguo({
				idEquipoAntiguo: idEquipo,
				jornadaTraspaso: jornada,
			});
			exists.jugadorAntiguo = jugadorAntiguo;
			exists = await modeloJugador.findOneAndUpdate(
				{ _id: jugador.player.id },
				exists,
				{ new: true }
			);
		}

		if (jugador.substitute) {
			suplentes.push(jugador.player.id);
		} else {
			titulares.push(jugador.player.id);
		}
	}

	const alineacion: IAlineacion = new modeloAlineacion({
		jugadoresTitulares: titulares,
		jugadoresSuplentes: suplentes,
	});

	return alineacion;
}

function createJugadorNoDisponible(jugador: any) {
	return new modeloJugador({
		_id: jugador.player.id,
		nombre: jugador.player.name,
		slug: jugador.player.slug,
		posicion: checkPosition(jugador.player.position),
		idEquipo: "0",
		valor: jugador.player.proposedMarketValue || 0,
		puntos: 0,
		estado: "No disponible",
		foto: urlEquipo + jugador.player.id + "/image",
		puntuaciones: [],
	});
}
*/
