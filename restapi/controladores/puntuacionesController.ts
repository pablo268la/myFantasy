import { RequestHandler } from "express";
import {
	filterAndPop,
	filterAndPopByTramos,
	getByTramos,
	openJSON,
} from "../controladoresSofascore/jsonHelper";
import { PuntuacionJSON } from "../controladoresSofascore/sharedTypes";
import { modeloJugador } from "../model/jugador";
import {
	IPuntuacionJugador,
	modelPuntuacionJugador,
} from "../model/puntuacion/puntuacionJugador";
import { IPuntuacionTupple } from "../model/puntuacion/puntuacionTupple";

export const getPuntuacionesJugador: RequestHandler = async (req, res) => {
	try {
		const puntuaciones = await modelPuntuacionJugador.find({
			idJugador: req.params.idJugador,
		});

		const result: IPuntuacionJugador[] = [];
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

export const getPuntuacionesJugadorJornada: RequestHandler = async (
	req,
	res
) => {
	try {
		const puntuacion = await modelPuntuacionJugador.findOne({
			idJugador: req.params.idJugador,
			semana: req.params.semana,
		});

		res.status(200).json(puntuacion);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const guardarPuntuacion: RequestHandler = async (req, res) => {
	// TODO - Verificar usuario es admin
	try {
		let puntuacionJugador: any = new modelPuntuacionJugador(req.body);
		const jugador = await modeloJugador.findOne({
			_id: puntuacionJugador.idJugador,
		});
		const exists = await modelPuntuacionJugador.findOne({
			idJugador: puntuacionJugador.idJugador,
			idPartido: puntuacionJugador.idPartido,
		});

		const PuntuacionJSON = openJSON(jugador?.posicion as string);

		puntuacionJugador = calcularPuntuacion(puntuacionJugador, PuntuacionJSON);
		puntuacionJugador._id =
			puntuacionJugador.idJugador + "-" + puntuacionJugador.idPartido;

		let puntuacionGuardada = null;
		if (exists) {
			puntuacionGuardada = await modelPuntuacionJugador.findOneAndUpdate(
				{
					idJugador: puntuacionJugador.idJugador,
					idPartido: puntuacionJugador.idPartido,
				},
				puntuacionJugador,
				{ new: true }
			);
		} else {
			puntuacionGuardada = await puntuacionJugador.save();
		}

		if (jugador) {
			jugador.puntos += puntuacionJugador.puntos;
			await jugador.save();
		}

		res.status(201).json(puntuacionGuardada);
	} catch (error) {
		console.log(error);
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
		_id: "",
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
		idEquipo: "",
		idEquipoRival: "",
	};
	return puntuacionJugador;
};

export const puntuarPuntuacionesJugador: RequestHandler = async (req, res) => {
	try {
		const jugadores = await modeloJugador.find();

		//const jugador = await modeloJugador.findOne({ _id: req.params.idJugador });

		await jugadores.forEach(async (jugador) => {
			const puntuaciones = await modelPuntuacionJugador.find({
				idJugador: jugador?._id,
			});

			const PuntuacionJSON = openJSON(jugador?.posicion as string);

			puntuaciones.map(async (puntuacion) => {
				const puntuacionCalculada = calcularPuntuacion(
					puntuacion,
					PuntuacionJSON
				);
				const newPuntuacion = await modelPuntuacionJugador.findOneAndUpdate(
					{
						idJugador: puntuacion.idJugador,
						idPartido: puntuacion.idPartido,
					},
					puntuacionCalculada,
					{ new: true }
				);

				return newPuntuacion;
			});
		});
		res.status(200).json();
	} catch (error) {
		res.status(500).json(error);
	}
};
function calcularPuntuacion(
	puntuacion: IPuntuacionJugador,
	puntuacionJSON: PuntuacionJSON
): IPuntuacionJugador {
	puntuacion.puntos = 0;
	puntuacion.puntuacionBasica.asistencias.puntos = getByTramos(
		puntuacionJSON.asistencias,
		puntuacion.puntuacionBasica.asistencias.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionBasica.asistencias.puntos;

	puntuacion.puntuacionBasica.goles.puntos = getByTramos(
		puntuacionJSON.goles,
		puntuacion.puntuacionBasica.goles.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionBasica.goles.puntos;

	puntuacion.puntuacionBasica.minutos.puntos = filterAndPop(
		puntuacionJSON.minutos,
		puntuacion.puntuacionBasica.minutos.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionBasica.minutos.puntos;

	puntuacion.puntuacionBasica.valoracion.puntos = filterAndPop(
		puntuacionJSON.valoracion,
		puntuacion.puntuacionBasica.minutos.estadistica > 0
			? puntuacion.puntuacionBasica.valoracion.estadistica
			: -1
	);
	puntuacion.puntos += puntuacion.puntuacionBasica.valoracion.puntos;

	puntuacion.puntuacionOfensiva.ocasionClaraFallada.puntos = getByTramos(
		puntuacionJSON.ocasionClaraFallada,
		puntuacion.puntuacionOfensiva.ocasionClaraFallada.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionOfensiva.ocasionClaraFallada.puntos;

	puntuacion.puntuacionOfensiva.penaltiRecibido.puntos = getByTramos(
		puntuacionJSON.penaltiRecibido,
		puntuacion.puntuacionOfensiva.penaltiRecibido.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionOfensiva.penaltiRecibido.puntos;

	puntuacion.puntuacionOfensiva.penaltiFallado.puntos = getByTramos(
		puntuacionJSON.penaltiFallado,
		puntuacion.puntuacionOfensiva.penaltiFallado.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionOfensiva.penaltiFallado.puntos;

	puntuacion.puntuacionOfensiva.regatesCompletados.puntos = getByTramos(
		puntuacionJSON.regatesCompletados,
		puntuacion.puntuacionOfensiva.regatesCompletados.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionOfensiva.regatesCompletados.puntos;

	puntuacion.puntuacionOfensiva.regatesIntentados.puntos = getByTramos(
		puntuacionJSON.regatesIntentados,
		puntuacion.puntuacionOfensiva.regatesIntentados.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionOfensiva.regatesIntentados.puntos;

	puntuacion.puntuacionOfensiva.tirosAlPalo.puntos = getByTramos(
		puntuacionJSON.tirosAlPalo,
		puntuacion.puntuacionOfensiva.tirosAlPalo.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionOfensiva.tirosAlPalo.puntos;

	puntuacion.puntuacionOfensiva.tirosBloqueados.puntos = getByTramos(
		puntuacionJSON.tirosBloqueadosAtaque,
		puntuacion.puntuacionOfensiva.tirosBloqueados.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionOfensiva.tirosBloqueados.puntos;

	puntuacion.puntuacionOfensiva.tirosFuera.puntos = getByTramos(
		puntuacionJSON.tirosFuera,
		puntuacion.puntuacionOfensiva.tirosFuera.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionOfensiva.tirosFuera.puntos;

	puntuacion.puntuacionOfensiva.tirosPuerta.puntos = getByTramos(
		puntuacionJSON.tirosPuerta,
		puntuacion.puntuacionOfensiva.tirosPuerta.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionOfensiva.tirosPuerta.puntos;

	puntuacion.puntuacionPosesion.centrosCompletados.puntos = getByTramos(
		puntuacionJSON.centrosCompletados,
		puntuacion.puntuacionPosesion.centrosCompletados.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPosesion.centrosCompletados.puntos;

	puntuacion.puntuacionPosesion.centrosTotales.puntos = getByTramos(
		puntuacionJSON.centrosTotales,
		puntuacion.puntuacionPosesion.centrosTotales.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPosesion.centrosTotales.puntos;

	puntuacion.puntuacionPosesion.pasesCompletados.puntos = getByTramos(
		puntuacionJSON.pasesCompletados,
		puntuacion.puntuacionPosesion.pasesCompletados.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPosesion.pasesCompletados.puntos;

	puntuacion.puntuacionPosesion.pasesTotales.puntos = getByTramos(
		puntuacionJSON.pasesTotales,
		puntuacion.puntuacionPosesion.pasesTotales.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPosesion.pasesTotales.puntos;

	puntuacion.puntuacionPosesion.pasesLargosCompletados.puntos = getByTramos(
		puntuacionJSON.pasesLargosCompletados,
		puntuacion.puntuacionPosesion.pasesLargosCompletados.estadistica
	);
	puntuacion.puntos +=
		puntuacion.puntuacionPosesion.pasesLargosCompletados.puntos;

	puntuacion.puntuacionPosesion.pasesLargosTotales.puntos = getByTramos(
		puntuacionJSON.pasesLargosTotales,
		puntuacion.puntuacionPosesion.pasesLargosTotales.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPosesion.pasesLargosTotales.puntos;

	puntuacion.puntuacionPosesion.pasesClave.puntos = getByTramos(
		puntuacionJSON.pasesClave,
		puntuacion.puntuacionPosesion.pasesClave.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPosesion.pasesClave.puntos;

	puntuacion.puntuacionPosesion.grandesOcasiones.puntos = getByTramos(
		puntuacionJSON.grandesOcasiones,
		puntuacion.puntuacionPosesion.grandesOcasiones.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPosesion.grandesOcasiones.puntos;

	puntuacion.puntuacionPosesion.toquesBalon.puntos = getByTramos(
		puntuacionJSON.toquesBalon,
		puntuacion.puntuacionPosesion.toquesBalon.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPosesion.toquesBalon.puntos;

	puntuacion.puntuacionDefensiva.despejes.puntos = getByTramos(
		puntuacionJSON.despejes,
		puntuacion.puntuacionDefensiva.despejes.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionDefensiva.despejes.puntos;

	puntuacion.puntuacionDefensiva.despejesEnLineaDeGol.puntos = getByTramos(
		puntuacionJSON.despejesEnLineaDeGol,
		puntuacion.puntuacionDefensiva.despejesEnLineaDeGol.estadistica
	);
	puntuacion.puntos +=
		puntuacion.puntuacionDefensiva.despejesEnLineaDeGol.puntos;

	puntuacion.puntuacionDefensiva.entradas.puntos = getByTramos(
		puntuacionJSON.entradas,
		puntuacion.puntuacionDefensiva.entradas.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionDefensiva.entradas.puntos;

	puntuacion.puntuacionDefensiva.erroresParaDisparo.puntos = getByTramos(
		puntuacionJSON.erroresParaDisparo,
		puntuacion.puntuacionDefensiva.erroresParaDisparo.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionDefensiva.erroresParaDisparo.puntos;

	puntuacion.puntuacionDefensiva.golesEnPropia.puntos = getByTramos(
		puntuacionJSON.golesEnPropia,
		puntuacion.puntuacionDefensiva.golesEnPropia.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionDefensiva.golesEnPropia.puntos;

	puntuacion.puntuacionDefensiva.intercepciones.puntos = getByTramos(
		puntuacionJSON.intercepciones,
		puntuacion.puntuacionDefensiva.intercepciones.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionDefensiva.intercepciones.puntos;

	puntuacion.puntuacionDefensiva.penaltiCometido.puntos = getByTramos(
		puntuacionJSON.penaltiCometido,
		puntuacion.puntuacionDefensiva.penaltiCometido.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionDefensiva.penaltiCometido.puntos;

	puntuacion.puntuacionDefensiva.regatesSuperado.puntos = getByTramos(
		puntuacionJSON.regatesSuperado,
		puntuacion.puntuacionDefensiva.regatesSuperado.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionDefensiva.regatesSuperado.puntos;

	puntuacion.puntuacionDefensiva.tirosBloqueados.puntos = getByTramos(
		puntuacionJSON.tirosBloqueados,
		puntuacion.puntuacionDefensiva.tirosBloqueados.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionDefensiva.tirosBloqueados.puntos;

	puntuacion.puntuacionPortero.paradas.puntos = getByTramos(
		puntuacionJSON.paradas,
		puntuacion.puntuacionPortero.paradas.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPortero.paradas.puntos;

	puntuacion.puntuacionPortero.despejes.puntos = getByTramos(
		puntuacionJSON.despejesPortero,
		puntuacion.puntuacionPortero.despejes.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPortero.despejes.puntos;

	puntuacion.puntuacionPortero.highClaim.puntos = getByTramos(
		puntuacionJSON.highClaim,
		puntuacion.puntuacionPortero.highClaim.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPortero.highClaim.puntos;

	puntuacion.puntuacionPortero.paradasArea.puntos = getByTramos(
		puntuacionJSON.paradasArea,
		puntuacion.puntuacionPortero.paradasArea.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPortero.paradasArea.puntos;

	puntuacion.puntuacionPortero.penaltiesParados.puntos = getByTramos(
		puntuacionJSON.penaltiesParados,
		puntuacion.puntuacionPortero.penaltiesParados.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPortero.penaltiesParados.puntos;

	puntuacion.puntuacionPortero.salidas.puntos = getByTramos(
		puntuacionJSON.salidas,
		puntuacion.puntuacionPortero.salidas.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionPortero.salidas.puntos;

	puntuacion.puntuacionFisico.duelosAereosGanados.puntos = getByTramos(
		puntuacionJSON.duelosAereosGanados,
		puntuacion.puntuacionFisico.duelosAereosGanados.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionFisico.duelosAereosGanados.puntos;

	puntuacion.puntuacionFisico.duelosAereosPerdidos.puntos = getByTramos(
		puntuacionJSON.duelosAereosPerdidos,
		puntuacion.puntuacionFisico.duelosAereosPerdidos.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionFisico.duelosAereosPerdidos.puntos;

	puntuacion.puntuacionFisico.faltasCometidas.puntos = getByTramos(
		puntuacionJSON.faltasCometidas,
		puntuacion.puntuacionFisico.faltasCometidas.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionFisico.faltasCometidas.puntos;

	puntuacion.puntuacionFisico.faltasRecibidas.puntos = getByTramos(
		puntuacionJSON.faltasRecibidas,
		puntuacion.puntuacionFisico.faltasRecibidas.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionFisico.faltasRecibidas.puntos;

	puntuacion.puntuacionFisico.duelosGanados.puntos = getByTramos(
		puntuacionJSON.duelosGanados,
		puntuacion.puntuacionFisico.duelosGanados.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionFisico.duelosGanados.puntos;

	puntuacion.puntuacionFisico.duelosPerdidos.puntos = getByTramos(
		puntuacionJSON.duelosPerdidos,
		puntuacion.puntuacionFisico.duelosPerdidos.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionFisico.duelosPerdidos.puntos;

	puntuacion.puntuacionFisico.fuerasDeJuego.puntos = getByTramos(
		puntuacionJSON.fuerasDeJuego,
		puntuacion.puntuacionFisico.fuerasDeJuego.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionFisico.fuerasDeJuego.puntos;

	puntuacion.puntuacionFisico.posesionPerdida.puntos = getByTramos(
		puntuacionJSON.posesionPerdida,
		puntuacion.puntuacionFisico.posesionPerdida.estadistica
	);
	puntuacion.puntos += puntuacion.puntuacionFisico.posesionPerdida.puntos;

	if (puntuacion.puntuacionCalculable === undefined) {
		const tupple: IPuntuacionTupple = {
			estadistica: 0,
			puntos: 0,
		};

		puntuacion.puntuacionCalculable = {
			golesRecibidos: tupple,
			tarjetasAmarilla: tupple,
			tarjetasRoja: tupple,
			dobleAmarilla: tupple,
			playerIn: 0,
			playerOut: 0,
		};
		console.log(puntuacion.idJugador);
	} else {
		puntuacion.puntuacionCalculable.dobleAmarilla.puntos = getByTramos(
			puntuacionJSON.dobleAmarilla,
			puntuacion.puntuacionCalculable.dobleAmarilla.estadistica
		);
		puntuacion.puntos += puntuacion.puntuacionCalculable.dobleAmarilla.puntos;

		puntuacion.puntuacionCalculable.golesRecibidos.puntos =
			filterAndPopByTramos(
				puntuacionJSON.golesRecibidos,
				puntuacion.puntuacionBasica.minutos.estadistica > 0
					? puntuacion.puntuacionCalculable.golesRecibidos.estadistica
					: -1
			);
		puntuacion.puntos += puntuacion.puntuacionCalculable.golesRecibidos.puntos;

		puntuacion.puntuacionCalculable.tarjetasAmarilla.puntos = getByTramos(
			puntuacionJSON.tarjetasAmarilla,
			puntuacion.puntuacionCalculable.tarjetasAmarilla.estadistica
		);
		puntuacion.puntos +=
			puntuacion.puntuacionCalculable.tarjetasAmarilla.puntos;

		puntuacion.puntuacionCalculable.tarjetasRoja.puntos = getByTramos(
			puntuacionJSON.tarjetasRoja,
			puntuacion.puntuacionCalculable.tarjetasRoja.estadistica
		);
		puntuacion.puntos += puntuacion.puntuacionCalculable.tarjetasRoja.puntos;
	}

	return puntuacion;
}
