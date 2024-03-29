import {
	getJugadoresAntiguos,
	getJugadoresPorEquipo,
} from "../endpoints/jugadorEndpoints";
import {
	Alineacion,
	EventoPartido,
	Jugador,
	Partido,
	PuntuacionBasica,
	PuntuacionCalculable,
	PuntuacionDefensiva,
	PuntuacionFisica,
	PuntuacionJSON,
	PuntuacionJugador,
	PuntuacionOfensiva,
	PuntuacionPortero,
	PuntuacionPosesion,
	PuntuacionTupple,
} from "../shared/sharedTypes";
import {
	filterAndPop,
	filterAndPopByTramos,
	getByTramos,
	openJSON,
} from "./jsonHelper";

export async function getEventosDeSofaScore(
	partido: Partido
): Promise<EventoPartido[]> {
	const eventos: EventoPartido[] = [];
	const jugadoresLocales = await getJugadoresPorEquipo(partido.local.id);
	const jugadoresVisitantes = await getJugadoresPorEquipo(partido.visitante.id);
	const jugadores = jugadoresLocales.concat(jugadoresVisitantes);

	await fetch(
		"https://api.sofascore.com/api/v1/event/" + partido.id + "/incidents",
		{
			mode: "cors",
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		}
	).then(async (res) => {
		return await res.json().then((r) => {
			r.incidents.map(async (e: any) => {
				if (e.incidentType === "goal") {
					eventos.push({
						tipo: "Gol",
						minuto: e.time,
						jugador: jugadores.find(
							(j) => j.id.toString() === e.player.id.toString()
						) as Jugador,
						jugador2:
							e.assist1 !== undefined
								? (jugadores.find(
										(j) => j.id.toString() === e.assist1.id.toString()
								  ) as Jugador)
								: undefined,
					});
					return e;
				} else if (e.incidentType === "card") {
					if (e.incidentClass === "yellow") {
						eventos.push({
							tipo: "Tarjeta amarilla",
							minuto: e.time,
							jugador: jugadores.find(
								(j) => j.id.toString() === e.player.id.toString()
							) as Jugador,
							jugador2: undefined,
						});
						return e;
					} else if (e.incidentClass === "red") {
						eventos.push({
							tipo: "Tarjeta roja",
							minuto: e.time,
							jugador: jugadores.find(
								(j) => j.id.toString() === e.player.id.toString()
							) as Jugador,
							jugador2: undefined,
						});
						return e;
					} else if (e.incidentClass === "yellowRed") {
						eventos.push({
							tipo: "Doble amarilla",
							minuto: e.time,
							jugador: jugadores.find(
								(j) => j.id.toString() === e.player.id.toString()
							) as Jugador,
							jugador2: undefined,
						});
						return e;
					}
				} else if (e.incidentType === "substitution") {
					eventos.push({
						tipo: "Cambio",
						minuto: e.time,
						jugador: jugadores.find(
							(j) => j.id.toString() === e.playerIn.id.toString()
						) as Jugador,
						jugador2: jugadores.find(
							(j) => j.id.toString() === e.playerOut.id.toString()
						) as Jugador,
					});
					return e;
				}
			});
		});
	});
	return await eventos;
}

export async function getPuntuacionesDeSofaScore(
	partido: Partido,
	jugador: Jugador,
	titular: boolean
): Promise<PuntuacionJugador[]> {
	const puntuaciones: PuntuacionJugador[] = [];

	await fetch(
		"https://api.sofascore.com/api/v1/event/" +
			partido.id +
			"/player/" +
			jugador.id +
			"/statistics",
		{
			mode: "cors",
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		}
	).then(async (res) => {
		return await res.json().then((r) => {
			puntuaciones.push(
				getPuntuacionJugadorFromJSON(r, partido, jugador, titular)
			);
		});
	});

	return await puntuaciones;
}

const getPuntuacionJugadorFromJSON = (
	r: any,
	partido: Partido,
	jugador: Jugador,
	titular: boolean
): PuntuacionJugador => {
	const puntuacionJSON: PuntuacionJSON = openJSON(jugador.posicion);

	const puntuacionBasica: PuntuacionBasica = {
		goles: crearPuntuacionTupple(
			r.statistics.goals ? r.statistics.goals : 0,
			getByTramos(
				puntuacionJSON.goles,
				r.statistics.goals ? r.statistics.goals : 0
			)
		),
		asistencias: crearPuntuacionTupple(
			r.statistics.goalAssist ? r.statistics.goalAssist : 0,
			getByTramos(
				puntuacionJSON.asistencias,
				r.statistics.goalAssist ? r.statistics.goalAssist : 0
			)
		),
		minutos: crearPuntuacionTupple(
			r.statistics.minutesPlayed ? r.statistics.minutesPlayed : 0,
			filterAndPop(
				puntuacionJSON.minutos,
				r.statistics.minutesPlayed ? r.statistics.minutesPlayed : 0
			)
		),
		valoracion: crearPuntuacionTupple(
			r.statistics.rating ? r.statistics.rating : 0,
			filterAndPop(
				puntuacionJSON.valoracion,
				r.statistics.rating ? r.statistics.rating : 6.0
			)
		),
	};

	const puntuacionOfensiva: PuntuacionOfensiva = {
		tirosPuerta: crearPuntuacionTupple(
			r.statistics.onTargetScoringAttempt
				? r.statistics.onTargetScoringAttempt
				: 0,
			getByTramos(
				puntuacionJSON.tirosPuerta,
				r.statistics.onTargetScoringAttempt
					? r.statistics.onTargetScoringAttempt
					: 0
			)
		),
		tirosFuera: crearPuntuacionTupple(
			r.statistics.shotOffTarget ? r.statistics.shotOffTarget : 0,
			getByTramos(
				puntuacionJSON.tirosFuera,
				r.statistics.shotOffTarget ? r.statistics.shotOffTarget : 0
			)
		),
		tirosBloqueados: crearPuntuacionTupple(
			r.statistics.blockedScoringAttempt
				? r.statistics.blockedScoringAttempt
				: 0,
			getByTramos(
				puntuacionJSON.tirosBloqueadosAtaque,
				r.statistics.blockedScoringAttempt
					? r.statistics.blockedScoringAttempt
					: 0
			)
		),
		regatesIntentados: crearPuntuacionTupple(
			r.statistics.totalContest ? r.statistics.totalContest : 0,
			getByTramos(
				puntuacionJSON.regatesIntentados,
				r.statistics.totalContest ? r.statistics.totalContest : 0
			)
		),
		regatesCompletados: crearPuntuacionTupple(
			r.statistics.wonContest ? r.statistics.wonContest : 0,
			getByTramos(
				puntuacionJSON.regatesCompletados,
				r.statistics.wonContest ? r.statistics.wonContest : 0
			)
		),
		tirosAlPalo: crearPuntuacionTupple(
			r.statistics.hitWoodwork ? r.statistics.hitWoodwork : 0,
			getByTramos(
				puntuacionJSON.tirosAlPalo,
				r.statistics.hitWoodwork ? r.statistics.hitWoodwork : 0
			)
		),
		ocasionClaraFallada: crearPuntuacionTupple(
			r.statistics.bigChanceMissed ? r.statistics.bigChanceMissed : 0,
			getByTramos(
				puntuacionJSON.ocasionClaraFallada,
				r.statistics.bigChanceMissed ? r.statistics.bigChanceMissed : 0
			)
		),
		penaltiRecibido: crearPuntuacionTupple(
			r.statistics.penaltyWon ? r.statistics.penaltyWon : 0,
			getByTramos(
				puntuacionJSON.penaltiRecibido,
				r.statistics.penaltyWon ? r.statistics.penaltyWon : 0
			)
		),
		penaltiFallado: crearPuntuacionTupple(
			r.statistics.penaltyMiss ? r.statistics.penaltyMiss : 0,
			getByTramos(
				puntuacionJSON.penaltiFallado,
				r.statistics.penaltyMiss ? r.statistics.penaltyMiss : 0
			)
		),
	};

	const puntuacionPosesion: PuntuacionPosesion = {
		toquesBalon: crearPuntuacionTupple(
			r.statistics.touches ? r.statistics.touches : 0,
			getByTramos(
				puntuacionJSON.toquesBalon,
				r.statistics.touches ? r.statistics.touches : 0
			)
		),
		pasesTotales: crearPuntuacionTupple(
			r.statistics.totalPass ? r.statistics.totalPass : 0,
			getByTramos(
				puntuacionJSON.pasesTotales,
				r.statistics.totalPass ? r.statistics.totalPass : 0
			)
		),
		pasesCompletados: crearPuntuacionTupple(
			r.statistics.accuratePass ? r.statistics.accuratePass : 0,
			getByTramos(
				puntuacionJSON.pasesCompletados,
				r.statistics.accuratePass ? r.statistics.accuratePass : 0
			)
		),
		pasesClave: crearPuntuacionTupple(
			r.statistics.keyPass ? r.statistics.keyPass : 0,
			getByTramos(
				puntuacionJSON.pasesClave,
				r.statistics.keyPass ? r.statistics.keyPass : 0
			)
		),
		centrosTotales: crearPuntuacionTupple(
			r.statistics.totalCross ? r.statistics.totalCross : 0,
			getByTramos(
				puntuacionJSON.centrosTotales,
				r.statistics.totalCross ? r.statistics.totalCross : 0
			)
		),
		centrosCompletados: crearPuntuacionTupple(
			r.statistics.accurateCross ? r.statistics.accurateCross : 0,
			getByTramos(
				puntuacionJSON.centrosCompletados,
				r.statistics.accurateCross ? r.statistics.accurateCross : 0
			)
		),
		pasesLargosTotales: crearPuntuacionTupple(
			r.statistics.totalLongBalls ? r.statistics.totalLongBalls : 0,
			getByTramos(
				puntuacionJSON.pasesLargosTotales,
				r.statistics.totalLongBalls ? r.statistics.totalLongBalls : 0
			)
		),
		pasesLargosCompletados: crearPuntuacionTupple(
			r.statistics.accurateLongBalls ? r.statistics.accurateLongBalls : 0,
			getByTramos(
				puntuacionJSON.pasesLargosCompletados,
				r.statistics.accurateLongBalls ? r.statistics.accurateLongBalls : 0
			)
		),
		grandesOcasiones: crearPuntuacionTupple(
			r.statistics.bigChanceCreated ? r.statistics.bigChanceCreated : 0,
			getByTramos(
				puntuacionJSON.grandesOcasiones,
				r.statistics.bigChanceCreated ? r.statistics.bigChanceCreated : 0
			)
		),
	};

	const puntuacionDefensiva: PuntuacionDefensiva = {
		despejes: crearPuntuacionTupple(
			r.statistics.totalClearance ? r.statistics.totalClearance : 0,
			getByTramos(
				puntuacionJSON.despejes,
				r.statistics.totalClearance ? r.statistics.totalClearance : 0
			)
		),
		tirosBloqueados: crearPuntuacionTupple(
			r.statistics.onTargetScoringAttempt
				? r.statistics.onTargetScoringAttempt
				: 0,
			getByTramos(
				puntuacionJSON.tirosBloqueados,
				r.statistics.onTargetScoringAttempt
					? r.statistics.onTargetScoringAttempt
					: 0
			)
		),
		intercepciones: crearPuntuacionTupple(
			r.statistics.interceptionWon ? r.statistics.interceptionWon : 0,
			getByTramos(
				puntuacionJSON.intercepciones,
				r.statistics.interceptionWon ? r.statistics.interceptionWon : 0
			)
		),
		entradas: crearPuntuacionTupple(
			r.statistics.totalTackle ? r.statistics.totalTackle : 0,
			getByTramos(
				puntuacionJSON.entradas,
				r.statistics.totalTackle ? r.statistics.totalTackle : 0
			)
		),
		regatesSuperado: crearPuntuacionTupple(
			r.statistics.challengeLost ? r.statistics.challengeLost : 0,
			getByTramos(
				puntuacionJSON.regatesSuperado,
				r.statistics.challengeLost ? r.statistics.challengeLost : 0
			)
		),
		erroresParaDisparo: crearPuntuacionTupple(
			r.statistics.errorLeadToShot ? r.statistics.errorLeadToShot : 0,
			getByTramos(
				puntuacionJSON.erroresParaDisparo,
				r.statistics.errorLeadToShot ? r.statistics.errorLeadToShot : 0
			)
		),
		despejesEnLineaDeGol: crearPuntuacionTupple(
			r.statistics.clearanceOffLine ? r.statistics.clearanceOffLine : 0,
			getByTramos(
				puntuacionJSON.despejesEnLineaDeGol,
				r.statistics.clearanceOffLine ? r.statistics.clearanceOffLine : 0
			)
		),
		golesEnPropia: crearPuntuacionTupple(
			r.statistics.ownGoals ? r.statistics.ownGoals : 0,
			getByTramos(
				puntuacionJSON.golesEnPropia,
				r.statistics.ownGoals ? r.statistics.ownGoals : 0
			)
		),
		penaltiCometido: crearPuntuacionTupple(
			r.statistics.penaltyConceded ? r.statistics.penaltyConceded : 0,
			getByTramos(
				puntuacionJSON.penaltiCometido,
				r.statistics.penaltyConceded ? r.statistics.penaltyConceded : 0
			)
		),
	};

	const puntuacionFisica: PuntuacionFisica = {
		duelosGanados: crearPuntuacionTupple(
			(r.statistics.duelWon ? r.statistics.duelWon : 0) -
				(r.statistics.aerialWon ? r.statistics.aerialWon : 0),
			getByTramos(
				puntuacionJSON.duelosGanados,
				(r.statistics.duelWon ? r.statistics.duelWon : 0) -
					(r.statistics.aerialWon ? r.statistics.aerialWon : 0)
			)
		),
		duelosPerdidos: crearPuntuacionTupple(
			(r.statistics.duelLost ? r.statistics.duelLost : 0) -
				(r.statistics.aerialLost ? r.statistics.aerialLost : 0),
			getByTramos(
				puntuacionJSON.duelosPerdidos,
				(r.statistics.duelLost ? r.statistics.duelLost : 0) -
					(r.statistics.aerialLost ? r.statistics.aerialLost : 0)
			)
		),
		duelosAereosGanados: crearPuntuacionTupple(
			r.statistics.aerialWon ? r.statistics.aerialWon : 0,
			getByTramos(
				puntuacionJSON.duelosAereosGanados,
				r.statistics.aerialWon ? r.statistics.aerialWon : 0
			)
		),
		duelosAereosPerdidos: crearPuntuacionTupple(
			r.statistics.aerialLost ? r.statistics.aerialLost : 0,
			getByTramos(
				puntuacionJSON.duelosAereosPerdidos,
				r.statistics.aerialLost ? r.statistics.aerialLost : 0
			)
		),
		posesionPerdida: crearPuntuacionTupple(
			r.statistics.possessionLostCtrl ? r.statistics.possessionLostCtrl : 0,
			getByTramos(
				puntuacionJSON.posesionPerdida,
				r.statistics.possessionLostCtrl ? r.statistics.possessionLostCtrl : 0
			)
		),
		faltasCometidas: crearPuntuacionTupple(
			r.statistics.fouls ? r.statistics.fouls : 0,
			getByTramos(
				puntuacionJSON.faltasCometidas,
				r.statistics.fouls ? r.statistics.fouls : 0
			)
		),
		faltasRecibidas: crearPuntuacionTupple(
			r.statistics.wasFouled ? r.statistics.wasFouled : 0,
			getByTramos(
				puntuacionJSON.faltasRecibidas,
				r.statistics.wasFouled ? r.statistics.wasFouled : 0
			)
		),
		fuerasDeJuego: crearPuntuacionTupple(
			r.statistics.totalOffside ? r.statistics.totalOffside : 0,
			getByTramos(
				puntuacionJSON.fuerasDeJuego,
				r.statistics.totalOffside ? r.statistics.totalOffside : 0
			)
		),
	};

	const puntuacionPortero: PuntuacionPortero = {
		paradas: crearPuntuacionTupple(
			r.statistics.saves ? r.statistics.saves : 0,
			getByTramos(
				puntuacionJSON.paradas,
				r.statistics.saves ? r.statistics.saves : 0
			)
		),
		despejes: crearPuntuacionTupple(
			r.statistics.punches ? r.statistics.punches : 0,
			getByTramos(
				puntuacionJSON.despejes,
				r.statistics.punches ? r.statistics.punches : 0
			)
		),
		salidas: crearPuntuacionTupple(
			r.statistics.totalKeeperSweeper ? r.statistics.totalKeeperSweeper : 0,
			getByTramos(
				puntuacionJSON.salidas,
				r.statistics.totalKeeperSweeper ? r.statistics.totalKeeperSweeper : 0
			)
		),
		highClaim: crearPuntuacionTupple(
			r.statistics.goodHighClaim ? r.statistics.goodHighClaim : 0,
			getByTramos(
				puntuacionJSON.highClaim,
				r.statistics.goodHighClaim ? r.statistics.goodHighClaim : 0
			)
		),
		paradasArea: crearPuntuacionTupple(
			r.statistics.savedShotsFromInsideTheBox
				? r.statistics.savedShotsFromInsideTheBox
				: 0,
			getByTramos(
				puntuacionJSON.paradasArea,
				r.statistics.savedShotsFromInsideTheBox
					? r.statistics.savedShotsFromInsideTheBox
					: 0
			)
		),
		penaltiesParados: crearPuntuacionTupple(
			r.statistics.penaltySave ? r.statistics.penaltySave : 0,
			getByTramos(
				puntuacionJSON.penaltiesParados,
				r.statistics.penaltySave ? r.statistics.penaltySave : 0
			)
		),
	};

	const eventos1 = partido.eventos.filter((e) => {
		if (e.jugador !== undefined) return e.jugador.id === jugador.id;
	});

	const golesRecibidos = calcularGolesSiTitularOSuplente(
		partido,
		jugador,
		titular
	);

	const puntuacionCalculable: PuntuacionCalculable = {
		golesRecibidos: crearPuntuacionTupple(
			golesRecibidos,
			filterAndPopByTramos(
				puntuacionJSON.golesRecibidos,
				golesRecibidos,
				r.statistics.minutesPlayed ?? 0
			)
		),
		tarjetasAmarilla: crearPuntuacionTupple(
			eventos1.filter((e) => e.tipo === "Tarjeta amarilla").length,
			getByTramos(
				puntuacionJSON.tarjetasAmarilla,
				eventos1.filter((e) => e.tipo === "Tarjeta amarilla").length
			)
		),
		tarjetasRoja: crearPuntuacionTupple(
			eventos1.filter((e) => e.tipo === "Tarjeta roja").length,
			getByTramos(
				puntuacionJSON.tarjetasRoja,
				eventos1.filter((e) => e.tipo === "Tarjeta roja").length
			)
		),
		dobleAmarilla: crearPuntuacionTupple(
			eventos1.filter((e) => e.tipo === "Doble amarilla").length,
			getByTramos(
				puntuacionJSON.dobleAmarilla,
				eventos1.filter((e) => e.tipo === "Doble amarilla").length
			)
		),
		playerIn: getMinutoIn(partido, jugador, titular),
		playerOut: getMinutoOut(partido, jugador, titular),
	};

	const puntuacionJugador: PuntuacionJugador = {
		puntuacionCalculable: puntuacionCalculable,
		puntuacionBasica: puntuacionBasica,
		puntuacionOfensiva: puntuacionOfensiva,
		puntuacionPosesion: puntuacionPosesion,
		puntuacionDefensiva: puntuacionDefensiva,
		puntuacionFisico: puntuacionFisica,
		puntuacionPortero: puntuacionPortero,
		idJugador: r.player.id,
		idPartido: partido.id,
		idEquipo:
			partido.local.id === r.team.id ? partido.local.id : partido.visitante.id,
		idEquipoRival:
			partido.local.id === r.team.id ? partido.visitante.id : partido.local.id,
		puntos: 0,
		semana: partido.jornada,
	};

	puntuacionJugador.puntos = calcularPuntosPuntuacion(puntuacionJugador);

	return puntuacionJugador;
};

function crearPuntuacionTupple(
	estadistica: number,
	puntos: number
): PuntuacionTupple {
	return {
		estadistica: estadistica,
		puntos: puntos,
	};
}

function calcularGolesSiTitularOSuplente(
	partido: Partido,
	jugador: Jugador,
	titular: boolean
): number {
	if (titular) {
		const posCambioOut = partido.eventos.indexOf(
			partido.eventos.filter(
				(e) => e.tipo === "Cambio" && e.jugador2?.id === jugador.id
			)[0]
		);

		const eventosConJugador = partido.eventos.slice(
			0,
			posCambioOut === -1 ? partido.eventos.length : posCambioOut + 1
		);

		if (
			jugador.jugadorAntiguo?.equipo !== undefined &&
			jugador.jugadorAntiguo?.jornadaTraspaso < partido.jornada
		) {
			return eventosConJugador
				.filter((e) => e.tipo === "Gol")
				.filter(
					(e) => e.jugador.equipo.id !== jugador.jugadorAntiguo?.equipo?.id
				).length;
		} else
			return eventosConJugador
				.filter((e) => e.tipo === "Gol")
				.filter((e) => e.jugador.equipo.id !== jugador.equipo.id).length;
	} else {
		const posCambioIn = partido.eventos.indexOf(
			partido.eventos.filter((e) => {
				return e.tipo === "Cambio" && e.jugador?.id === jugador.id;
			})[0]
		);

		const posCambioOut = partido.eventos.indexOf(
			partido.eventos.filter(
				(e) => e.tipo === "Cambio" && e.jugador2?.id === jugador.id
			)[0]
		);

		if (posCambioIn !== -1) {
			const eventosConJugador = partido.eventos.slice(
				posCambioIn,
				posCambioOut === -1 ? partido.eventos.length : posCambioOut + 1
			);

			if (
				jugador.jugadorAntiguo?.equipo !== undefined &&
				jugador.jugadorAntiguo?.jornadaTraspaso < partido.jornada
			) {
				return eventosConJugador
					.filter((e) => e.tipo === "Gol")
					.filter(
						(e) => e.jugador.equipo.id !== jugador.jugadorAntiguo?.equipo?.id
					).length;
			} else
				return eventosConJugador
					.filter((e) => e.tipo === "Gol")
					.filter((e) => e.jugador.equipo.id !== jugador.equipo.id).length;
		}
	}
	return 0;
}

function getMinutoIn(
	partido: Partido,
	jugador: Jugador,
	titular: boolean
): number {
	if (titular) {
		return 0;
	} else {
		const posCambioIn = partido.eventos.filter((e) => {
			return e.tipo === "Cambio" && e.jugador?.id === jugador.id;
		})[0];
		if (posCambioIn !== undefined) return posCambioIn.minuto;
		else return -1;
	}
}

function getMinutoOut(
	partido: Partido,
	jugador: Jugador,
	titular: boolean
): number {
	const posCambioIn = partido.eventos.filter((e) => {
		return e.tipo === "Cambio" && e.jugador?.id === jugador.id;
	})[0];

	const posCambioOut = partido.eventos.filter(
		(e) => e.tipo === "Cambio" && e.jugador2?.id === jugador.id
	)[0];

	const expulsado = partido.eventos.filter(
		(e) =>
			(e.tipo === "Tarjeta roja" || e.tipo === "Doble amarilla") &&
			e.jugador?.id === jugador.id
	)[0];

	let minutoOut = 0;
	if (titular && posCambioOut === undefined) {
		minutoOut = 90;
	} else if (titular && posCambioOut !== undefined) {
		minutoOut = posCambioOut.minuto;
	} else if (!titular && posCambioIn === undefined) {
		minutoOut = -1;
	} else if (
		!titular &&
		posCambioIn !== undefined &&
		posCambioOut === undefined
	) {
		minutoOut = 90;
	} else if (
		!titular &&
		posCambioIn !== undefined &&
		posCambioOut !== undefined
	) {
		minutoOut = posCambioOut.minuto - posCambioIn.minuto;
	} else minutoOut = -1;

	if (titular && expulsado !== undefined) {
		minutoOut = expulsado.minuto;
	}
	if (!titular && expulsado !== undefined) {
		minutoOut = expulsado.minuto - posCambioIn.minuto;
	}

	return minutoOut;
}

export async function getAlineacionesSofaScore(partido: Partido) {
	const jugadoresLocales = await getJugadoresPorEquipo(partido.local.id);
	const jugadoresVisitantes = await getJugadoresPorEquipo(partido.visitante.id);
	const jugadoresAntiguos = await getJugadoresAntiguos(
		partido.local.id,
		partido.jornada
	);
	const jugadoresAntiguos2 = await getJugadoresAntiguos(
		partido.visitante.id,
		partido.jornada
	);

	const jugadores = jugadoresLocales
		.concat(jugadoresVisitantes)
		.concat(jugadoresAntiguos)
		.concat(jugadoresAntiguos2);

	const alineacionLocal: Alineacion = {
		jugadoresTitulares: [],
		jugadoresSuplentes: [],
	};

	const alineacionVisitante: Alineacion = {
		jugadoresTitulares: [],
		jugadoresSuplentes: [],
	};

	await fetch(
		"https://api.sofascore.com/api/v1/event/" + partido.id + "/lineups",
		{
			mode: "cors",
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		}
	).then(async (res) => {
		return await res.json().then((r) => {
			r.home.players
				.filter((p: any) => p.substitute === false)
				.forEach((p: any) => {
					const jugador = jugadores.filter(
						(j) => j.id.toString() === p.player.id.toString()
					)[0];
					if (jugador !== undefined)
						alineacionLocal.jugadoresTitulares.push(jugador);
				});

			r.home.players
				.filter((p: any) => p.substitute === true)
				.forEach((p: any) => {
					const jugador = jugadores.filter(
						(j) => j.id.toString() === p.player.id.toString()
					)[0];
					if (jugador !== undefined)
						alineacionLocal.jugadoresSuplentes.push(jugador);
				});

			r.away.players
				.filter((p: any) => p.substitute === false)
				.forEach((p: any) => {
					const jugador = jugadores.filter(
						(j) => j.id.toString() === p.player.id.toString()
					)[0];
					if (jugador !== undefined)
						alineacionVisitante.jugadoresTitulares.push(jugador);
				});

			r.away.players
				.filter((p: any) => p.substitute === true)
				.forEach((p: any) => {
					const jugador = jugadores.filter(
						(j) => j.id.toString() === p.player.id.toString()
					)[0];
					if (jugador !== undefined)
						alineacionVisitante.jugadoresSuplentes.push(jugador);
				});
		});
	});

	return {
		alineacionLocal,
		alineacionVisitante,
	};
}

export function calcularPuntosPuntuacion(p: PuntuacionJugador): number {
	let puntosTotales = 0;
	puntosTotales +=
		p.puntuacionBasica.goles.puntos +
		p.puntuacionBasica.asistencias.puntos +
		p.puntuacionBasica.minutos.puntos +
		p.puntuacionBasica.valoracion.puntos;
	puntosTotales +=
		p.puntuacionOfensiva.tirosPuerta.puntos +
		p.puntuacionOfensiva.tirosFuera.puntos +
		p.puntuacionOfensiva.tirosBloqueados.puntos +
		p.puntuacionOfensiva.regatesIntentados.puntos +
		p.puntuacionOfensiva.regatesCompletados.puntos +
		p.puntuacionOfensiva.tirosAlPalo.puntos +
		p.puntuacionOfensiva.ocasionClaraFallada.puntos +
		p.puntuacionOfensiva.penaltiRecibido.puntos +
		p.puntuacionOfensiva.penaltiFallado.puntos;
	puntosTotales +=
		p.puntuacionPosesion.toquesBalon.puntos +
		p.puntuacionPosesion.pasesTotales.puntos +
		p.puntuacionPosesion.pasesCompletados.puntos +
		p.puntuacionPosesion.pasesClave.puntos +
		p.puntuacionPosesion.centrosTotales.puntos +
		p.puntuacionPosesion.centrosCompletados.puntos +
		p.puntuacionPosesion.pasesLargosTotales.puntos +
		p.puntuacionPosesion.pasesLargosCompletados.puntos +
		p.puntuacionPosesion.grandesOcasiones.puntos;
	puntosTotales +=
		p.puntuacionDefensiva.despejes.puntos +
		p.puntuacionDefensiva.tirosBloqueados.puntos +
		p.puntuacionDefensiva.intercepciones.puntos +
		p.puntuacionDefensiva.entradas.puntos +
		p.puntuacionDefensiva.regatesSuperado.puntos +
		p.puntuacionDefensiva.erroresParaDisparo.puntos +
		p.puntuacionDefensiva.despejesEnLineaDeGol.puntos +
		p.puntuacionDefensiva.golesEnPropia.puntos +
		p.puntuacionDefensiva.penaltiCometido.puntos;
	puntosTotales +=
		p.puntuacionFisico.duelosGanados.puntos +
		p.puntuacionFisico.duelosPerdidos.puntos +
		p.puntuacionFisico.duelosAereosGanados.puntos +
		p.puntuacionFisico.duelosAereosPerdidos.puntos +
		p.puntuacionFisico.posesionPerdida.puntos +
		p.puntuacionFisico.faltasCometidas.puntos +
		p.puntuacionFisico.faltasRecibidas.puntos +
		p.puntuacionFisico.fuerasDeJuego.puntos;
	puntosTotales +=
		p.puntuacionPortero.paradas.puntos +
		p.puntuacionPortero.despejes.puntos +
		p.puntuacionPortero.salidas.puntos +
		p.puntuacionPortero.highClaim.puntos +
		p.puntuacionPortero.paradasArea.puntos +
		p.puntuacionPortero.penaltiesParados.puntos;
	puntosTotales +=
		p.puntuacionCalculable.golesRecibidos.puntos +
		p.puntuacionCalculable.tarjetasAmarilla.puntos +
		p.puntuacionCalculable.tarjetasRoja.puntos +
		p.puntuacionCalculable.dobleAmarilla.puntos;

	return puntosTotales;
}
