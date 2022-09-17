import axios from "axios";
import { RequestHandler } from "express";
import { getPuntosDeJugador } from "../helpers/puntuacionHelper";
import { IAlineacion, modeloAlineacion } from "../model/alineacion";
import { IEquipo, modeloEquipo } from "../model/equipo";
import { IJugador, modeloJugador } from "../model/jugador";
import { IJugadorAntiguo, modeloJugadorAntiguo } from "../model/jugadorAntiguo";
import { IPartido, modeloPartido } from "../model/partido";
import { modelPuntuacionBasica } from "../model/puntuacion/puntuacionBasica";
import { modelPuntuacionCalculable } from "../model/puntuacion/puntuacionCalculable";
import { modelPuntuacionDefensiva } from "../model/puntuacion/puntuacionDefensiva";
import { modelPuntuacionFisica } from "../model/puntuacion/puntuacionFisica";
import {
	IPuntuacionJugador,
	modelPuntuacionJugador
} from "../model/puntuacion/puntuacionJugador";
import { modelPuntuacionOfensiva } from "../model/puntuacion/puntuacionOfensiva";
import { modelPuntuacionPortero } from "../model/puntuacion/puntuacionPortero";
import { modelPuntuacionPosesion } from "../model/puntuacion/puntuacionPosesion";
import {
	IPuntuacionTupple,
	modeloPuntuacionTupple
} from "../model/puntuacion/puntuacionTupple";

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
			await getIncidentesDePartido(partido._id);
			partido = await cogerAlineaciones(partido._id);
		}

		if (partido !== null) {
			getPuntosJugadores(partido._id);
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
				jugador.estado = exists.estado;
				jugador.fantasyMarcaId = exists.fantasyMarcaId;
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
	getPuntosJugadores(idPartido);
};

async function getPuntosJugadores(idPartido: any): Promise<IJugador[] | null> {
	let partido: IPartido | null = await modeloPartido.findOne({
		_id: idPartido,
	});

	let resultJugadores: any[] = [];

	let jugadoresLocal: any[] = [];
	let jugadoresVisitante: any[] = [];
	if (partido !== null) {
		await axios
			.get("https://api.sofascore.com/api/v1/event/" + idPartido + "/lineups")
			.then(async (response) => {
				jugadoresLocal = response.data.home.players;
				jugadoresVisitante = response.data.away.players;
			});

		for (let i = 0; i < jugadoresLocal.length; i++) {
			resultJugadores.push(
				await cogerPuntuacionesJugador(i, partido, jugadoresLocal)
			);
		}
		for (let i = 0; i < jugadoresVisitante.length; i++) {
			resultJugadores.push(
				await cogerPuntuacionesJugador(i, partido, jugadoresVisitante)
			);
		}
	}
	//res.json(resultJugadores);
	return resultJugadores;
}

async function cogerPuntuacionesJugador(
	i: number,
	partido: IPartido,
	jugadores: any[]
): Promise<IJugador | null> {
	let jugador: IJugador | null = await modeloJugador.findOne({
		_id: jugadores[i].player.id,
	});

	const statistics = jugadores[i].statistics;
	if (jugador !== null && statistics !== undefined) {
		const idEquipo = jugador.idEquipo;
		const idEquipoRival =
			partido.idLocal === idEquipo ? partido.idVisitante : partido.idLocal;

		let puntuacionBasica = new modelPuntuacionBasica({
			minutos: createPuntuacionTupple(statistics.minutesPlayed, 0),
			goles: createPuntuacionTupple(statistics.goals, 0),
			asistencias: createPuntuacionTupple(statistics.goalAssist, 0),
			valoracion: createPuntuacionTupple(statistics.rating, 0),
		});

		let puntuacionPortero = new modelPuntuacionPortero({
			paradas: createPuntuacionTupple(statistics.saves, 0),
			despejes: createPuntuacionTupple(statistics.punches, 0),
			salidas: createPuntuacionTupple(statistics.totalKeeperSweeper, 0),
			highClaim: createPuntuacionTupple(statistics.goodHighClaim, 0),
			paradasArea: createPuntuacionTupple(
				statistics.savedShotsFromInsideTheBox,
				0
			),
			penaltiesParados: createPuntuacionTupple(statistics.penaltySave, 0),
		});

		let puntuacionOfensiva = new modelPuntuacionOfensiva({
			tirosPuerta: createPuntuacionTupple(statistics.onTargetScoringAttempt, 0),
			tirosFuera: createPuntuacionTupple(statistics.shotOffTarget, 0),
			tirosBloqueados: createPuntuacionTupple(
				statistics.blockedScoringAttempt,
				0
			),
			regatesIntentados: createPuntuacionTupple(statistics.totalContest, 0),
			regatesCompletados: createPuntuacionTupple(statistics.wonContest, 0),
			tirosAlPalo: createPuntuacionTupple(statistics.hitWoodwork, 0),
			ocasionClaraFallada: createPuntuacionTupple(
				statistics.bigChanceMissed,
				0
			),
			penaltiRecibido: createPuntuacionTupple(statistics.penaltyWon, 0),
			penaltiFallado: createPuntuacionTupple(statistics.penaltyMiss, 0),
		});

		let puntuacionPosesion = new modelPuntuacionPosesion({
			toquesBalon: createPuntuacionTupple(statistics.touches, 0),
			pasesTotales: createPuntuacionTupple(statistics.totalPass, 0),
			pasesCompletados: createPuntuacionTupple(statistics.accuratePass, 0),
			pasesClave: createPuntuacionTupple(statistics.keyPass, 0),
			centrosTotales: createPuntuacionTupple(statistics.totalCross, 0),
			centrosCompletados: createPuntuacionTupple(statistics.accurateCross, 0),
			pasesLargosTotales: createPuntuacionTupple(statistics.totalLongBalls, 0),
			pasesLargosCompletados: createPuntuacionTupple(
				statistics.accurateLongBalls,
				0
			),
			grandesOcasiones: createPuntuacionTupple(statistics.bigChanceCreated, 0),
		});

		let puntuacionDefensiva = new modelPuntuacionDefensiva({
			despejes: createPuntuacionTupple(statistics.totalClearance, 0),
			tirosBloqueados: createPuntuacionTupple(
				statistics.onTargetScoringAttempt,
				0
			),
			intercepciones: createPuntuacionTupple(statistics.interceptionWon, 0),
			entradas: createPuntuacionTupple(statistics.totalTackle, 0),
			regatesSuperado: createPuntuacionTupple(statistics.challengeLost, 0),
			erroresParaDisparo: createPuntuacionTupple(statistics.errorLeadToShot, 0),
			despejesEnLineaDeGol: createPuntuacionTupple(
				statistics.clearanceOffLine,
				0
			),
			golesEnPropia: createPuntuacionTupple(statistics.ownGoals, 0),
			penaltiCometido: createPuntuacionTupple(statistics.penaltyConceded, 0),
		});

		let puntuacionFisica = new modelPuntuacionFisica({
			duelosGanados: createPuntuacionTupple(
				statistics.duelWon - statistics.aerialWon,
				0
			),
			duelosPerdidos: createPuntuacionTupple(
				statistics.duelLost - statistics.aerialLost,
				0
			),
			duelosAereosGanados: createPuntuacionTupple(statistics.aerialWon, 0),
			duelosAereosPerdidos: createPuntuacionTupple(statistics.aerialLost, 0),
			posesionPerdida: createPuntuacionTupple(statistics.possessionLostCtrl, 0),
			faltasCometidas: createPuntuacionTupple(statistics.fouls, 0),
			faltasRecibidas: createPuntuacionTupple(statistics.wasFouled, 0),
			fuerasDeJuego: createPuntuacionTupple(statistics.totalOffside, 0),
		});

		let puntuacionCalculable = new modelPuntuacionCalculable({
			golesRecibidos: createPuntuacionTupple(statistics.goalsConceded, 0),
			tarjetasAmarilla: createPuntuacionTupple(statistics.yellowCard, 0),
			tarjetasRoja: createPuntuacionTupple(statistics.redCard, 0),
			dobleAmarilla: createPuntuacionTupple(statistics.secondYellow, 0),
		});

		let puntuacion: IPuntuacionJugador = new modelPuntuacionJugador({
			idJugador: jugador._id,
			idPartido: partido._id,
			semana: partido.jornada,
			puntos: 0,
			puntuacionBasica: puntuacionBasica,
			puntuacionOfensiva: puntuacionOfensiva,
			puntuacionPosesion: puntuacionPosesion,
			puntuacionDefensiva: puntuacionDefensiva,
			puntuacionFisico: puntuacionFisica,
			puntuacionPortero: puntuacionPortero,
			puntuacionCalculable: puntuacionCalculable,
			idEquipo: idEquipo,
			idEquipoRival: idEquipoRival,
		});

		puntuacion.puntos = getPuntosDeJugador(puntuacion);

		jugador.puntuaciones[partido.jornada - 1] = puntuacion;

		jugador = await modeloJugador.findByIdAndUpdate(
			{ _id: jugador._id },
			jugador,
			{ new: true }
		);
	}
	return jugador;
}

function createPuntuacionTupple(
	estadistica: number,
	puntuacion: number
): IPuntuacionTupple {
	const puntuacionTupple: IPuntuacionTupple = new modeloPuntuacionTupple({
		estadistica: estadistica !== undefined ? estadistica : 0,
		puntos: puntuacion,
	});

	return puntuacionTupple;
}

export const getIncidentesPartido: RequestHandler = async (req, res) => {
	let j = await getIncidentesDePartido(req.body.idPartido);
	res.json(j);
};

async function getIncidentesDePartido(idPartido: string) {
	let eventosPartido: any;
	let evento: { minuto: number; tipo: string; id: string; isHome: boolean }[] =
		[];

	await axios
		.get("https://api.sofascore.com/api/v1/event/" + idPartido + "/incidents")
		.then(async (response) => {
			eventosPartido = response.data.incidents;
		});

	eventosPartido
		.sort((n1: any, n2: any) => {
			if (n1.time >= n2.time) {
				return 1;
			}

			if (n1.time < n2.time) {
				return -1;
			}
		})
		.forEach((element: any) => {
			if (element.incidentType === "card" && element.player !== undefined) {
				evento.push({
					minuto: element.time,
					tipo: element.incidentClass,
					id: element.player.id,
					isHome: element.isHome,
				});
			} else if (element.incidentType === "substitution") {
				evento.push({
					minuto: element.time,
					tipo: "substitution",
					id: element.playerIn.id,
					isHome: element.isHome,
				});
				evento.push({
					minuto: element.time,
					tipo: "substitution",
					id: element.playerOut.id,
					isHome: element.isHome,
				});
			} else if (element.incidentType === "goal") {
				evento.push({
					minuto: element.time,
					tipo: "goal",
					id: element.player.id,
					isHome: element.isHome,
				});
			}
		});

	let partido = await modeloPartido.findOne({ _id: idPartido.toString() });
	let jLocales: {
		id: String;
		golesContra: number;
		jugando: boolean;
		amarilla: boolean;
		roja: boolean;
		dobleA: boolean;
	}[] = [];
	let jVisitantes: {
		id: String;
		golesContra: number;
		jugando: boolean;
		amarilla: boolean;
		roja: boolean;
		dobleA: boolean;
	}[] = [];

	if (partido !== null) {
		let aLocal: IAlineacion = partido.alineacionLocal;
		let aVisitante: IAlineacion = partido.alineacionVisitante;

		aLocal.jugadoresTitulares.forEach((id) => {
			jLocales.push({
				id: id,
				golesContra: 0,
				jugando: true,
				amarilla: false,
				roja: false,
				dobleA: false,
			});
		});
		aLocal.jugadoresSuplentes.forEach((id) => {
			jLocales.push({
				id: id,
				golesContra: 0,
				jugando: false,
				amarilla: false,
				roja: false,
				dobleA: false,
			});
		});
		aVisitante.jugadoresTitulares.forEach((id) => {
			jVisitantes.push({
				id: id,
				golesContra: 0,
				jugando: true,
				amarilla: false,
				roja: false,
				dobleA: false,
			});
		});
		aVisitante.jugadoresSuplentes.forEach((id) => {
			jVisitantes.push({
				id: id,
				golesContra: 0,
				jugando: false,
				amarilla: false,
				roja: false,
				dobleA: false,
			});
		});
	}

	for (let i = 0; i < evento.length; i++) {
		if (evento[i].tipo === "yellow") {
			if (evento[i].isHome) {
				jLocales.forEach((element) => {
					if (element.id.toString() === evento[i].id.toString()) {
						element.amarilla = true;
					}
				});
			} else {
				jVisitantes.forEach((element) => {
					if (element.id.toString() === evento[i].id.toString()) {
						element.amarilla = true;
					}
				});
			}
		}
		if (evento[i].tipo === "red") {
			if (evento[i].isHome) {
				jLocales.forEach((element) => {
					if (element.id.toString() === evento[i].id.toString()) {
						element.roja = true;
					}
				});
			} else {
				jVisitantes.forEach((element) => {
					if (element.id.toString() === evento[i].id.toString()) {
						element.roja = true;
					}
				});
			}
		}
		if (evento[i].tipo === "yellowRed") {
			if (evento[i].isHome) {
				jLocales.forEach((element) => {
					if (element.id.toString() === evento[i].id.toString()) {
						element.dobleA = true;
					}
				});
			} else {
				jVisitantes.forEach((element) => {
					if (element.id.toString() === evento[i].id.toString()) {
						element.dobleA = true;
					}
				});
			}
		}
		if (evento[i].tipo === "substitution") {
			if (evento[i].isHome) {
				for (let j = 0; j < jLocales.length; j++) {
					if (jLocales[j].id.toString() === evento[i].id.toString()) {
						jLocales[j].jugando = !jLocales[j].jugando;
					}
				}
			} else {
				for (let j = 0; j < jVisitantes.length; j++) {
					if (jVisitantes[j].id.toString() === evento[i].id.toString()) {
						jVisitantes[j].jugando = !jVisitantes[j].jugando;
					}
				}
			}
		}
		if (evento[i].tipo === "goal") {
			if (!evento[i].isHome) {
				for (let j = 0; j < jLocales.length; j++) {
					if (jLocales[j].jugando) {
						jLocales[j].golesContra++;
					}
				}
			} else {
				for (let j = 0; j < jVisitantes.length; j++) {
					if (jVisitantes[j].jugando) {
						jVisitantes[j].golesContra++;
					}
				}
			}
		}
	}

	for (let i = 0; i < jLocales.length; i++) {
		let jugador = await modeloJugador.findOne({ _id: jLocales[i].id });
		if (
			jugador !== null &&
			partido !== null &&
			jugador.puntuaciones[partido.jornada - 1] !== undefined
		) {
			let puntuacionCalculable =
				jugador.puntuaciones[partido.jornada - 1].puntuacionCalculable;
			puntuacionCalculable.golesRecibidos = createPuntuacionTupple(
				jLocales[i].golesContra,
				0
			);
			if (jLocales[i].amarilla) {
				puntuacionCalculable.tarjetasAmarilla = createPuntuacionTupple(1, 0);
			}
			if (jLocales[i].roja) {
				puntuacionCalculable.tarjetasRoja = createPuntuacionTupple(1, 0);
			}
			if (jLocales[i].dobleA) {
				puntuacionCalculable.dobleAmarilla = createPuntuacionTupple(1, 0);
				puntuacionCalculable.tarjetasAmarilla = createPuntuacionTupple(0, 0);
			}
			jugador.puntuaciones[partido.jornada - 1].puntuacionCalculable =
				puntuacionCalculable;
			jugador.puntos = getPuntosDeJugador(
				jugador.puntuaciones[partido.jornada - 1]
			);
			jugador = await modeloJugador.findOneAndUpdate(
				{ _id: jLocales[i].id },
				jugador,
				{ new: true }
			);
		}
	}

	for (let i = 0; i < jVisitantes.length; i++) {
		let jugador = await modeloJugador.findOne({ _id: jVisitantes[i].id });
		if (
			jugador !== null &&
			partido !== null &&
			jugador.puntuaciones[partido.jornada - 1] !== undefined
		) {
			let puntuacionCalculable =
				jugador.puntuaciones[partido.jornada - 1].puntuacionCalculable;
			puntuacionCalculable.golesRecibidos = createPuntuacionTupple(
				jVisitantes[i].golesContra,
				0
			);
			if (jVisitantes[i].amarilla) {
				puntuacionCalculable.tarjetasAmarilla = createPuntuacionTupple(1, 0);
			}
			if (jVisitantes[i].roja) {
				puntuacionCalculable.tarjetasRoja = createPuntuacionTupple(1, 0);
			}
			if (jVisitantes[i].dobleA) {
				puntuacionCalculable.dobleAmarilla = createPuntuacionTupple(1, 0);
				puntuacionCalculable.tarjetasAmarilla = createPuntuacionTupple(0, 0);
			}
			jugador.puntuaciones[partido.jornada - 1].puntuacionCalculable =
				puntuacionCalculable;
			jugador.puntos = getPuntosDeJugador(
				jugador.puntuaciones[partido.jornada - 1]
			);
			jugador = await modeloJugador.findOneAndUpdate(
				{ _id: jVisitantes[i].id },
				jugador,
				{ new: true }
			);
		}
	}

	return jLocales;
}

export const getMarcaInfo: RequestHandler = async (req, res) => {
	const id = req.body.id;
	const idFantasy = req.body.idFantasy;

	let j = await modeloJugador.findOne({ _id: id });
	if (j !== null) {
		j.fantasyMarcaId = idFantasy;
		j = await modeloJugador.findOneAndUpdate({ _id: id }, j, { new: true });
	}
	res.json(j);
};
