import { RequestHandler } from "express";
import {
	IPuntuacionJugador,
	modelPuntuacionJugador,
} from "../model/puntuacion/puntuacionJugador";
import { IPuntuacionTupple } from "../model/puntuacion/puntuacionTupple";

export const getPuntuacionesJugadores: RequestHandler = async (req, res) => {
	try {
		res.status(200).json(await modelPuntuacionJugador.find());
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getPuntuacionesJugador: RequestHandler = async (req, res) => {
	try {
		let puntuaciones = await modelPuntuacionJugador.find({
			idJugador: req.params.idJugador,
		});

		let result: IPuntuacionJugador[] = [];
		for (let i = 1; i < 39; i++) {
			result.push(createPuntuacionJugadorVacia(req.params.idJugador, i));
		}

		puntuaciones.forEach((puntuacion) => {
			result[puntuacion.semana - 1] = puntuacion;
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json(error);
	}
};

const createPuntuacionJugadorVacia: any = (
	idJugador: string,
	semana: number
) => {
	const tupple: IPuntuacionTupple = {
		estadistica: 0,
		puntos: 0,
	};
	const puntuacionJugador: IPuntuacionJugador = {
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
		},
		idEquipo: "",
		idEquipoRival: "",
	};
	return puntuacionJugador;
};
