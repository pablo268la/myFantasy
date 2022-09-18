import { IPuntuacionBasica } from "../model/puntuacion/puntuacionBasica";
import { IPuntuacionCalculable } from "../model/puntuacion/puntuacionCalculable";
import { IPuntuacionDefensiva } from "../model/puntuacion/puntuacionDefensiva";
import { IPuntuacionFisica } from "../model/puntuacion/puntuacionFisica";
import { IPuntuacionJugador } from "../model/puntuacion/puntuacionJugador";
import { IPuntuacionOfensiva } from "../model/puntuacion/puntuacionOfensiva";
import { IPuntuacionPortero } from "../model/puntuacion/puntuacionPortero";
import { IPuntuacionPosesion } from "../model/puntuacion/puntuacionPosesion";
import {
	IPuntuacionTupple,
	modeloPuntuacionTupple
} from "../model/puntuacion/puntuacionTupple";

export function createPuntuacionTupple(estadistica: number): IPuntuacionTupple {
	const puntuacionTupple: IPuntuacionTupple = new modeloPuntuacionTupple({
		estadistica: estadistica !== undefined ? estadistica : 0,
		puntos: 0,
	});

	return puntuacionTupple;
}

export function getPuntosBasicos(p: IPuntuacionBasica): number {
	return (
		p.minutos.puntos +
		p.goles.puntos +
		p.asistencias.puntos +
		p.valoracion.puntos
	);
}

export function getPuntosDefensivos(p: IPuntuacionDefensiva): number {
	return (
		p.despejes.puntos +
		p.tirosBloqueados.puntos +
		p.intercepciones.puntos +
		p.entradas.puntos +
		p.regatesSuperado.puntos +
		p.erroresParaDisparo.puntos +
		p.despejesEnLineaDeGol.puntos +
		p.golesEnPropia.puntos +
		p.penaltiCometido.puntos
	);
}

export function getPuntosFisicos(p: IPuntuacionFisica): number {
	return (
		p.duelosGanados.puntos +
		p.duelosPerdidos.puntos +
		p.duelosAereosGanados.puntos +
		p.duelosAereosPerdidos.puntos +
		p.posesionPerdida.puntos +
		p.faltasCometidas.puntos +
		p.faltasRecibidas.puntos +
		p.fuerasDeJuego.puntos
	);
}

export function getPuntosOfensivos(p: IPuntuacionOfensiva): number {
	return (
		p.tirosPuerta.puntos +
		p.tirosFuera.puntos +
		p.tirosBloqueados.puntos +
		p.regatesIntentados.puntos +
		p.regatesCompletados.puntos +
		p.tirosAlPalo.puntos +
		p.ocasionClaraFallada.puntos +
		p.penaltiRecibido.puntos +
		p.penaltiFallado.puntos
	);
}

export function getPuntosPortero(p: IPuntuacionPortero): number {
	return (
		p.paradas.puntos +
		p.despejes.puntos +
		p.salidas.puntos +
		p.highClaim.puntos +
		p.paradasArea.puntos +
		p.penaltiesParados.puntos
	);
}

export function getPuntosPosesion(p: IPuntuacionPosesion): number {
	return (
		p.toquesBalon.puntos +
		p.pasesTotales.puntos +
		p.pasesCompletados.puntos +
		p.pasesClave.puntos +
		p.centrosTotales.puntos +
		p.centrosCompletados.puntos +
		p.pasesLargosTotales.puntos +
		p.pasesLargosCompletados.puntos +
		p.grandesOcasiones.puntos
	);
}

export function getPuntosCalculables(p: IPuntuacionCalculable): number {
	return (
		p.golesRecibidos.puntos +
		p.tarjetasAmarilla.puntos +
		p.tarjetasRoja.puntos +
		p.dobleAmarilla.puntos
	);
}

export function getPuntosDeJugador(p: IPuntuacionJugador): number {
	return (
		getPuntosBasicos(p.puntuacionBasica) +
		getPuntosDefensivos(p.puntuacionDefensiva) +
		getPuntosFisicos(p.puntuacionFisico) +
		getPuntosOfensivos(p.puntuacionOfensiva) +
		getPuntosPortero(p.puntuacionPortero) +
		getPuntosPosesion(p.puntuacionPosesion) +
		getPuntosCalculables(p.puntuacionCalculable)
	);
}
