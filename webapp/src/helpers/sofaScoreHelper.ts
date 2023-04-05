import { getJugadoresPorEquipo } from "../endpoints/jugadorEndpoints";
import { EventoPartido, Jugador, Partido } from "../shared/sharedTypes";

export async function getEventosDeSofaScore(
	partido: Partido
): Promise<EventoPartido[]> {
	const eventos: EventoPartido[] = [];
	const jugadoresLocales = await getJugadoresPorEquipo(partido.local._id);
	const jugadoresVisitantes = await getJugadoresPorEquipo(
		partido.visitante._id
	);
	const jugadores = jugadoresLocales.concat(jugadoresVisitantes);

	await fetch(
		"https://api.sofascore.com/api/v1/event/" + partido._id + "/incidents",
		{
			mode: "cors",
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		}
	).then(async (res) => {
		return await res.json().then((r) => {
			r.incidents.map(async (e: any) => {
				console.log(e);
				if (e.incidentType === "goal") {
					eventos.push({
						tipo: "Gol",
						minuto: e.time,
						jugador: jugadores.find(
							(j) => j._id.toString() === e.player.id.toString()
						) as Jugador,
						jugador2: e.assist1.id
							? (jugadores.find(
									(j) => j._id.toString() === e.assist1.id.toString()
							  ) as Jugador)
							: undefined,
					});
					return e;
				} else if (e.incidentType === "card") {
					if (e.incidentClass === "yellow") {
						eventos.push({
							tipo: "Tarjeta Amarilla",
							minuto: e.time,
							jugador: jugadores.find(
								(j) => j._id.toString() === e.player.id.toString()
							) as Jugador,
							jugador2: undefined,
						});
						return e;
					} else if (e.incidentClass === "red") {
						eventos.push({
							tipo: "Tarjeta Roja",
							minuto: e.time,
							jugador: jugadores.find(
								(j) => j._id.toString() === e.player.id.toString()
							) as Jugador,
							jugador2: undefined,
						});
						return e;
					} else if (e.incidentClass === "yellowRed") {
						eventos.push({
							tipo: "Doble amarilla",
							minuto: e.time,
							jugador: jugadores.find(
								(j) => j._id.toString() === e.player.id.toString()
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
							(j) => j._id.toString() === e.playerIn.id.toString()
						) as Jugador,
						jugador2: jugadores.find(
							(j) => j._id.toString() === e.playerOut.id.toString()
						) as Jugador,
					});
					return e;
				}
			});
		});
	});
	return await eventos;
}
