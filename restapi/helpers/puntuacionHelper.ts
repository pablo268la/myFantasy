import { IPuntuacionJugador } from "../model/puntuacion/puntuacionJugador";
import { IPuntuacionTupple } from "../model/puntuacion/puntuacionTupple";

export function createPuntuacionJugadorVacia(
	idJugador: string,
	semana: number,
	idEquipo: string
): IPuntuacionJugador {
	const tupple: IPuntuacionTupple = {
		estadistica: 0,
		puntos: 0,
	};
	const puntuacionJugador: IPuntuacionJugador = {
		id: "",
		idJugador: idJugador,
		idPartido: "",
		semana: semana,
		puntos: 0,
		puntuacionBasica: {
			goles: tupple,
			asistencias: tupple,
			minutos: tupple,
			valoracion: tupple,
		},
		puntuacionOfensiva: {
			tirosPuerta: tupple,
			tirosFuera: tupple,
			tirosBloqueados: tupple,
			regatesIntentados: tupple,
			regatesCompletados: tupple,
			tirosAlPalo: tupple,
			ocasionClaraFallada: tupple,
			penaltiRecibido: tupple,
			penaltiFallado: tupple,
		},
		puntuacionPosesion: {
			toquesBalon: tupple,
			pasesTotales: tupple,
			pasesCompletados: tupple,
			pasesClave: tupple,
			centrosTotales: tupple,
			centrosCompletados: tupple,
			pasesLargosTotales: tupple,
			pasesLargosCompletados: tupple,
			grandesOcasiones: tupple,
		},
		puntuacionDefensiva: {
			despejes: tupple,
			tirosBloqueados: tupple,
			intercepciones: tupple,
			entradas: tupple,
			regatesSuperado: tupple,
			erroresParaDisparo: tupple,
			despejesEnLineaDeGol: tupple,
			golesEnPropia: tupple,
			penaltiCometido: tupple,
		},
		puntuacionPortero: {
			paradas: tupple,
			despejes: tupple,
			salidas: tupple,
			highClaim: tupple,
			paradasArea: tupple,
			penaltiesParados: tupple,
		},
		puntuacionFisico: {
			duelosGanados: tupple,
			duelosPerdidos: tupple,
			duelosAereosGanados: tupple,
			duelosAereosPerdidos: tupple,
			posesionPerdida: tupple,
			faltasCometidas: tupple,
			faltasRecibidas: tupple,
			fuerasDeJuego: tupple,
		},
		puntuacionCalculable: {
			golesRecibidos: tupple,
			tarjetasAmarilla: tupple,
			tarjetasRoja: tupple,
			dobleAmarilla: tupple,
			playerIn: 0,
			playerOut: 0,
		},
		idEquipo: idEquipo,
		idEquipoRival: "",
	};
	return puntuacionJugador;
}
