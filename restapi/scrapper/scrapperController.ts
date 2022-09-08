import axios from "axios";
import { RequestHandler } from "express";
import { IAlineacion, modeloAlineacion } from "../model/alineacion";
import { IEquipo, modeloEquipo } from "../model/equipo";
import { IJugador, modeloJugador } from "../model/jugador";
import { IJugadorAntiguo, modeloJugadorAntiguo } from "../model/jugadorAntiguo";
import { IPartido, modeloPartido } from "../model/partido";

export const getEquipos: RequestHandler = async (req, res) => {
	let equipos: any;
	let result: IEquipo[] = [];

	await axios
		.get(
			"https://api.sofascore.com/api/v1/unique-tournament/8/season/42409/standings/total"
		)
		.then((response) => {
			equipos = response.data.standings[0].rows;
		});

	for (let i = 0; i < equipos.length; i++) {
		let team = equipos[i];

		let e: IEquipo | null = new modeloEquipo({
			_id: team.team.id,
			nombre: team.team.name,
			slug: team.team.slug,
			shortName: team.team.shortName,
			escudo:
				"https://api.sofascore.app/api/v1/team/" + team.team.id + "/image",
		});

		let exists: IEquipo | null = await modeloEquipo.findOne({
			_id: team.team.id,
		});

		if (exists !== null) {
			e = await modeloEquipo.findOneAndUpdate({ _id: e._id }, e, { new: true });
		} else {
			e = await modeloEquipo.create(e);
		}

		if (e !== null) {
			await cogerJugadoresEquipo(e._id);
			result.push(e);
		}
	}

	return res.json(result);
};

export const getPartidos: RequestHandler = async (req, res) => {
	let partidosJornada: any[] = [];
	let result: IPartido[] = [];
	let round = req.body.round;

	await axios
		.get(
			"https://api.sofascore.com/api/v1/unique-tournament/8/season/42409/events/round/" +
				round
		)
		.then(async (response) => {
			partidosJornada = response.data.events;
		});

	for (let i = 0; i < partidosJornada.length; i++) {
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

		if (
			new Date(p.startTimestamp * 1000).getTime() < new Date().getTime() &&
			partido !== null
		) {
			partido = await cogerAlineaciones(partido._id);
		}

		if (partido !== null) {
			result.push(partido);
		}
	}

	return res.json(result);
};

async function cogerAlineaciones(idPartido: any): Promise<IPartido | null> {
	let partido: IPartido | null = await modeloPartido.findOne({
		_id: idPartido,
	});
	let jugadoresLocal: any[] = [];
	let jugadoresVisitante: any[] = [];

	if (partido !== null) {
		await axios
			.get("https://api.sofascore.com/api/v1/event/" + idPartido + "/lineups")
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
			exists = new modeloJugador({
				_id: jugador.player.id,
				nombre: jugador.player.name,
				slug: jugador.player.slug,
				posicion: checkPosition(jugador.player.position),
				idEquipo: "0",
				valor: jugador.player.proposedMarketValue || 0,
				puntos: 0,
				estado: "No disponible",
				foto:
					"https://api.sofascore.app/api/v1/player/" +
					jugador.player.id +
					"/image",
				puntuaciones: [],
			});
			exists = await modeloJugador.create(exists);
		}
		if (exists.idEquipo !== idEquipo) {
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

async function cogerJugadoresEquipo(id: any) {
	let players: any[] = [];
	let jugadores: IJugador[] = [];
	let equipo: IEquipo | null = await modeloEquipo.findOne({ _id: id });

	await axios
		.get("https://api.sofascore.com/api/v1/team/" + id + "/players")
		.then(async (res) => {
			players = res.data.players;
		});

	for (let i = 0; i < players.length; i++) {
		let p = players[i];
		if (equipo !== null && p.player.team.shortName === equipo.shortName) {
			let exists: IJugador | null = await modeloJugador.findOne({
				_id: p.player.id,
			});

			let jugador: IJugador = new modeloJugador({
				_id: p.player.id,
				nombre: p.player.name,
				slug: p.player.slug,
				posicion: checkPosition(p.player.position),
				idEquipo: id,
				valor: p.player.proposedMarketValue || 0,
				puntos: 0,
				estado: "Disponible",
				foto:
					"https://api.sofascore.app/api/v1/player/" + p.player.id + "/image",
				puntuaciones: [],
			});

			if (exists === null) {
				await modeloJugador.create(jugador);
			} else {
				jugador.puntos = exists.puntos;
				jugador.puntuaciones = exists.puntuaciones;
				jugador.jugadorAntiguo = exists.jugadorAntiguo;
				await modeloJugador.findOneAndUpdate({ _id: p.player.id }, jugador, {
					new: true,
				});
			}

			jugadores.push(jugador);
		}
	}

	return jugadores;
}

function checkPosition(position: String) {
	switch (position) {
		case "G":
			return "Portero";
		case "D":
			return "Defensa";
		case "M":
			return "Mediocentro";
		case "F":
			return "Delantero";
		default:
			return "Sin asignar";
	}
}

function checkStatusPartido(status: any) {
	switch (status) {
		case "not_started":
			return "Por jugar";
		case "inprogress":
			return "En juego";
		case "finished":
			return "Finalizado";
		default:
			return "Por jugar";
	}
}

export const getPuntosJugador: RequestHandler = async (req, res) => {
	let idPartido = req.body.idPartido;
	let idJugador = req.body.idJugador;
};
