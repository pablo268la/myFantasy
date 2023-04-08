export type TuppleEstadisticaValue = {
	estadistica: number;
	value: number;
};

export type TuppleTramosValue = {
	tramos: number;
	value: number;
};

export type TripleeEstadisticaTramosValue = {
	estadistica: number;
	tramos: number;
	value: number;
};

export type PuntuacionJSON = {
	minutos: [TuppleEstadisticaValue];
	goles: TuppleTramosValue;
	asistencias: TuppleTramosValue;
	valoracion: [TuppleEstadisticaValue];
	tirosPuerta: TuppleTramosValue;
	tirosFuera: TuppleTramosValue;
	tirosBloqueadosAtaque: TuppleTramosValue;
	regatesIntentados: TuppleTramosValue;
	regatesCompletados: TuppleTramosValue;
	tirosAlPalo: TuppleTramosValue;
	ocasionClaraFallada: TuppleTramosValue;
	penaltiRecibido: TuppleTramosValue;
	penaltiFallado: TuppleTramosValue;
	toquesBalon: TuppleTramosValue;
	pasesTotales: TuppleTramosValue;
	pasesCompletados: TuppleTramosValue;
	pasesClave: TuppleTramosValue;
	centrosTotales: TuppleTramosValue;
	centrosCompletados: TuppleTramosValue;
	pasesLargosTotales: TuppleTramosValue;
	pasesLargosCompletados: TuppleTramosValue;
	grandesOcasiones: TuppleTramosValue;
	despejes: TuppleTramosValue;
	tirosBloqueados: TuppleTramosValue;
	intercepciones: TuppleTramosValue;
	entradas: TuppleTramosValue;
	regatesSuperado: TuppleTramosValue;
	erroresParaDisparo: TuppleTramosValue;
	despejesEnLineaDeGol: TuppleTramosValue;
	golesEnPropia: TuppleTramosValue;
	penaltiCometido: TuppleTramosValue;
	duelosGanados: TuppleTramosValue;
	duelosPerdidos: TuppleTramosValue;
	duelosAereosGanados: TuppleTramosValue;
	duelosAereosPerdidos: TuppleTramosValue;
	posesionPerdida: TuppleTramosValue;
	faltasCometidas: TuppleTramosValue;
	faltasRecibidas: TuppleTramosValue;
	fuerasDeJuego: TuppleTramosValue;
	paradas: TuppleTramosValue;
	despejesPortero: TuppleTramosValue;
	salidas: TuppleTramosValue;
	highClaim: TuppleTramosValue;
	paradasArea: TuppleTramosValue;
	penaltiesParados: TuppleTramosValue;
	golesRecibidos: [TripleeEstadisticaTramosValue];
	tarjetasAmarilla: TuppleTramosValue;
	tarjetasRoja: TuppleTramosValue;
	dobleAmarilla: TuppleTramosValue;
};
