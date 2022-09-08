import axios from "axios";
import { RequestHandler } from "express";
import { modeloAlineacion } from "../model/alineacion";
import { modeloEquipo } from "../model/equipo";
import { modeloJugador } from "../model/jugador";
import { modeloJugadorAntiguo } from "../model/jugadorAntiguo";
import { modeloPartido } from "../model/partido";

// Obtaining products are unauthorized operations: everybody can list the products of the shop
export const getEquipos: RequestHandler = async (req, res) => {
	let equipos: any;
	let result: any = [];

	await axios
		.get(
			"https://api.sofascore.com/api/v1/unique-tournament/8/season/42409/standings/total"
		)
		.then((response) => {
			equipos = response.data.standings[0].rows;
		});

	for (let i = 0; i < equipos.length; i++) {
		let team = equipos[i];

		let e = new modeloEquipo({
			_id: team.team.id,
			nombre: team.team.name,
			slug: team.team.slug,
			shortName: team.team.shortName,
			escudo:
				"https://api.sofascore.app/api/v1/team/" + team.team.id + "/image",
		});

		let exists = await modeloEquipo.findOne({ _id: team.team.id });
		if (exists) {
			e = await modeloEquipo.findOneAndUpdate({ _id: e._id }, e, { new: true });
		} else {
			e = await e.save();
		}

		await cogerJugadoresEquipo(e._id);

		result.push(e);
	}

	return res.json(result);
};

export const getPartidos: RequestHandler = async (req, res) => {
	let partidosJornada: any[] = [];
	let partidos: any[] = [];
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
		let partido = new modeloPartido({
			_id: p.id,
			idLocal: p.homeTeam.id,
			idVisitante: p.awayTeam.id,
			alineacionLocal: [],
			alineacionVisitante: [],
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
			partido = await partido.save();
		}

		if (new Date(p.startTimestamp * 1000).getTime() < new Date().getTime()) {
			partido = await cogerAlineaciones(partido.id);
		}
		partidos.push(partido);
	}

	return res.json(partidos);
};

//export const getAlineaciones: RequestHandler = async (req, res) => {
async function cogerAlineaciones(idPartido: any) {
	let partido = await modeloPartido.findOne({ _id: idPartido });
	let alineacionLocal;
	let alineacionVisitante;

	await axios
		.get("https://api.sofascore.com/api/v1/event/" + idPartido + "/lineups")
		.then(async (response) => {
			alineacionLocal = response.data.home.players;
			alineacionVisitante = response.data.away.players;
		});

	let localTitulares: any[] = [];
	let localSuplentes: any[] = [];
	await cogerAlineacion(
		alineacionLocal,
		localTitulares,
		localSuplentes,
		partido.idLocal,
		partido.jornada
	);

	let visitanteTitulares: any[] = [];
	let visitanteSuplentes: any[] = [];
	await cogerAlineacion(
		alineacionVisitante,
		visitanteTitulares,
		visitanteSuplentes,
		partido.idVisitante,
		partido.jornada
	);

	alineacionLocal = new modeloAlineacion({
		jugadoresTitulares: localTitulares,
		jugadoresSuplentes: localSuplentes,
	});

	alineacionVisitante = new modeloAlineacion({
		jugadoresTitulares: visitanteTitulares,
		jugadoresSuplentes: visitanteSuplentes,
	});

	partido.alineacionLocal = alineacionLocal;
	partido.alineacionVisitante = alineacionVisitante;
	partido = await partido.save();
	return partido;
}

async function cogerAlineacion(
	alineacion: any,
	titulares: any,
	suplentes: any,
	idEquipo: any,
	jornada: any
) {
	for (let i = 0; i < alineacion.length; i++) {
		let p = alineacion[i];
		let exists = await modeloJugador.findOne({ _id: p.player.id });
		if (exists === null) {
			exists = new modeloJugador({
				_id: p.player.id,
				nombre: p.player.name,
				slug: p.player.slug,
				posicion: checkPosition(p.player.position),
				idEquipo: "0",
				valor: p.player.proposedMarketValue || 0,
				puntos: 0,
				estado: "No disponible",
				foto:
					"https://api.sofascore.app/api/v1/player/" + p.player.id + "/image",
				puntuaciones: [],
			});
			exists = await exists.save();
		}
		if (exists.idEquipo !== idEquipo) {
			let jugadorAntiguo = new modeloJugadorAntiguo({
				idEquipoAntiguo: idEquipo,
				jornadaTraspaso: jornada,
			});
			exists.jugadorAntiguo = jugadorAntiguo;
			exists = await modeloJugador.findOneAndUpdate(
				{ _id: p.player.id },
				exists,
				{ new: true }
			);
		}

		if (p.substitute) {
			suplentes.push(p.player.id);
		} else {
			titulares.push(p.player.id);
		}
	}
}

async function cogerJugadoresEquipo(id: any) {
	let players: any;
	let jugadores: any[] = [];
	let equipo = await modeloEquipo.findOne({ _id: id });
	await axios
		.get("https://api.sofascore.com/api/v1/team/" + id + "/players")
		.then(async (res) => {
			players = res.data.players;
		});

	for (let i = 0; i < players.length; i++) {
		let p = players[i];
		if (p.player.team.shortName === equipo.shortName) {
			let exists = await modeloJugador.findOne({ _id: p.player.id });

			let jugador = new modeloJugador({
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

			if (!exists) {
				await jugador.save();
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
