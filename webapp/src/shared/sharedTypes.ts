export type Jugador = {
	id: string;
	nombre: string;
	slug: string;
	posicion: string;
	equipo: Equipo;
	valor: number;
	puntos: number;
	estado: string;
	foto: string;
	jugadorAntiguo: JugadorAntiguo | undefined;
	fantasyMarcaId: string;
};

export type JugadorAntiguo = {
	equipo: Equipo | undefined;
	jornadaTraspaso: number;
};

export type Equipo = {
	id: string;
	nombre: string;
	slug: string;
	shortName: string;
	escudo: string;
};

export type Partido = {
	id: string;
	local: Equipo;
	visitante: Equipo;
	alineacionLocal: Alineacion;
	alineacionVisitante: Alineacion;
	resultadoLocal: number;
	resultadoVisitante: number;
	jornada: number;
	fecha: string;
	linkSofaScore: string;
	estado: string;
	eventos: EventoPartido[];
};

export type EventoPartido = {
	tipo: string;
	minuto: number;
	jugador: Jugador;
	jugador2: Jugador | undefined;
};

export type Alineacion = {
	jugadoresTitulares: Jugador[];
	jugadoresSuplentes: Jugador[];
};

export type PlantillaUsuario = {
	id: string;
	usuario: Usuario;
	idLiga: string;
	alineacionJugador: AlineacionJugador;
	alineacionesJornada: AlineacionJugador[];
	valor: number;
	puntos: number;
	dinero: number;
};

export type AlineacionJugador = {
	id: string;
	porteros: PropiedadJugador[];
	defensas: PropiedadJugador[];
	medios: PropiedadJugador[];
	delanteros: PropiedadJugador[];
	formacion: string;
	guardadoEn: string;
	idLiga: string;
};

export type Usuario = {
	id: string;
	nombre: string;
	usuario: string;
	email: string;
	contraseña: string;
	ligas: string[];
	admin: boolean;
};

export type Liga = {
	id: string | undefined;
	nombre: string;
	plantillasUsuarios: PlantillaUsuario[];
	propiedadJugadores: PropiedadJugador[];
	enlaceInvitacion: string;
	maxJugadores: number;
	mercado: PropiedadJugador[];
	configuracion: string;
};

export type PropiedadJugador = {
	jugador: Jugador;
	usuario: Usuario;
	titular: boolean;
	venta: Venta;
};

export type Oferta = {
	comprador: Usuario;
	valorOferta: number;
	estado: string;
	privada: boolean;
};

export type Venta = {
	enVenta: boolean;
	ofertas: Oferta[];
	fechaLimite: string;
};

export type PuntuacionTupple = {
	estadistica: number;
	puntos: number;
};

export type PuntuacionBasica = {
	minutos: PuntuacionTupple;
	goles: PuntuacionTupple;
	asistencias: PuntuacionTupple;
	valoracion: PuntuacionTupple;
};

export type PuntuacionCalculable = {
	golesRecibidos: PuntuacionTupple;
	tarjetasAmarilla: PuntuacionTupple;
	tarjetasRoja: PuntuacionTupple;
	dobleAmarilla: PuntuacionTupple;
	playerIn: number;
	playerOut: number;
};

export type PuntuacionDefensiva = {
	despejes: PuntuacionTupple;
	tirosBloqueados: PuntuacionTupple;
	intercepciones: PuntuacionTupple;
	entradas: PuntuacionTupple;
	regatesSuperado: PuntuacionTupple;
	erroresParaDisparo: PuntuacionTupple;
	despejesEnLineaDeGol: PuntuacionTupple;
	golesEnPropia: PuntuacionTupple;
	penaltiCometido: PuntuacionTupple;
};

export type PuntuacionFisica = {
	duelosGanados: PuntuacionTupple;
	duelosPerdidos: PuntuacionTupple;
	duelosAereosGanados: PuntuacionTupple;
	duelosAereosPerdidos: PuntuacionTupple;
	posesionPerdida: PuntuacionTupple;
	faltasCometidas: PuntuacionTupple;
	faltasRecibidas: PuntuacionTupple;
	fuerasDeJuego: PuntuacionTupple;
};

export type PuntuacionOfensiva = {
	tirosPuerta: PuntuacionTupple;
	tirosFuera: PuntuacionTupple;
	tirosBloqueados: PuntuacionTupple;
	regatesIntentados: PuntuacionTupple;
	regatesCompletados: PuntuacionTupple;
	tirosAlPalo: PuntuacionTupple;
	ocasionClaraFallada: PuntuacionTupple;
	penaltiRecibido: PuntuacionTupple;
	penaltiFallado: PuntuacionTupple;
};

export type PuntuacionPortero = {
	paradas: PuntuacionTupple;
	despejes: PuntuacionTupple;
	salidas: PuntuacionTupple;
	highClaim: PuntuacionTupple;
	paradasArea: PuntuacionTupple;
	penaltiesParados: PuntuacionTupple;
};

export type PuntuacionPosesion = {
	toquesBalon: PuntuacionTupple;
	pasesTotales: PuntuacionTupple;
	pasesCompletados: PuntuacionTupple;
	pasesClave: PuntuacionTupple;
	centrosTotales: PuntuacionTupple;
	centrosCompletados: PuntuacionTupple;
	pasesLargosTotales: PuntuacionTupple;
	pasesLargosCompletados: PuntuacionTupple;
	grandesOcasiones: PuntuacionTupple;
};

export type PuntuacionJugador = {
	idJugador: string;
	idPartido: string;
	semana: number;
	puntos: number;
	puntuacionBasica: PuntuacionBasica;
	puntuacionOfensiva: PuntuacionOfensiva;
	puntuacionPosesion: PuntuacionPosesion;
	puntuacionDefensiva: PuntuacionDefensiva;
	puntuacionFisico: PuntuacionFisica;
	puntuacionPortero: PuntuacionPortero;
	puntuacionCalculable: PuntuacionCalculable;
	idEquipo: string;
	idEquipoRival: string;
};

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
	golesRecibidos: [[TripleeEstadisticaTramosValue]];
	tarjetasAmarilla: TuppleTramosValue;
	tarjetasRoja: TuppleTramosValue;
	dobleAmarilla: TuppleTramosValue;
};
