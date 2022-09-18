import axios from "axios";
import { RequestHandler } from "express";
import {
	createPuntuacionTupple,
	getPuntosDeJugador
} from "../helpers/puntuacionHelper";
import { IAlineacion } from "../model/alineacion";
import { IJugador, modeloJugador } from "../model/jugador";
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
import { urlPartido } from "./partidosController";

export const getIncidentesPartidoSofascore: RequestHandler = async (
	req,
	res
) => {
	let j = await getIncidentesDePartidoSofascore(req.body.idPartido);
	res.json(j);
};

export const getPuntosPartidoSofascore: RequestHandler = async (req, res) => {
	let partido: IPartido | null = await modeloPartido.findOne({
		_id: req.body.idPartido,
	});

	if (partido !== null) res.json(await getPuntosDePartido(partido));
	else res.json("Partido no encontrado");
};

async function getPuntosDePartido(partido: IPartido) {
	if (new Date(partido.fecha).getTime() < new Date().getTime()) {
		await getIncidentesDePartidoSofascore(partido._id);
		return await getPuntosJugadoresPartido(partido._id);
	}
	return null;
}

export async function getPuntosJugadoresPartido(
	idPartido: any
): Promise<IJugador[] | null> {
	let partido: IPartido | null = await modeloPartido.findOne({
		_id: idPartido,
	});

	let resultJugadores: any[] = [];

	let jugadoresLocal: any[] = [];
	let jugadoresVisitante: any[] = [];
	if (partido !== null) {
		await axios
			.get(urlPartido + idPartido + "/lineups")
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

export async function getIncidentesDePartidoSofascore(idPartido: string) {
	let eventosPartido: any;
	let evento: { minuto: number; tipo: string; id: string; isHome: boolean }[] =
		[];
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

	await axios
		.get(urlPartido + idPartido + "/incidents")
		.then(async (response) => {
			eventosPartido = response.data.incidents;
		});

	extraerEventos(eventosPartido, evento);

	let partido = await modeloPartido.findOne({ _id: idPartido.toString() });

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
						element.amarilla = false;
					}
				});
			} else {
				jVisitantes.forEach((element) => {
					if (element.id.toString() === evento[i].id.toString()) {
						element.dobleA = true;
						element.amarilla = false;
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
		let jugador: IJugador | null = await modeloJugador.findOne({
			_id: jLocales[i].id,
		});
		if (
			jugador !== null &&
			partido !== null &&
			jugador.puntuaciones[partido.jornada - 1] !== undefined
		) {
			jugador = await guardarPuntuacionCalculable(
				jugador,
				partido,
				jLocales,
				i
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
			guardarPuntuacionCalculable(jugador, partido, jVisitantes, i);
		}
	}
}

async function guardarPuntuacionCalculable(
	jugador: IJugador | null,
	partido: IPartido | null,
	jLocales: {
		id: String;
		golesContra: number;
		jugando: boolean;
		amarilla: boolean;
		roja: boolean;
		dobleA: boolean;
	}[],
	i: number
) {
	if (jugador !== null && partido !== null) {
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
	return jugador;
}

function extraerEventos(
	eventosPartido: any,
	evento: { minuto: number; tipo: string; id: string; isHome: boolean }[]
) {
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
}
