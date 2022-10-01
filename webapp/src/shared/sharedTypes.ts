export type Jugador = {
	_id: string;
	nombre: string;
	slug: string;
	posicion: string;
	idEquipo: string;
	valor: number;
	puntos: number;
	estado: string;
	foto: string;
	jugadorAntiguo: object;
	puntuaciones: object[];
	fantasyMarcaId: string;
};

export type PlantillaUsuario = {
	_id: string;
	idUsuario: string;
	idLiga: string;
	jugadores: string[];
	alineacion: AlineacionJugador;
	alineacionesJornada: AlineacionJugador[];
	valor: number;
	puntos: number;
};

export type AlineacionJugador = {
	_id: string;
	idUsuario: string;
	portero: string;
	defensas: string[];
	medios: string[];
	delanteros: string[];
	formacion: string;
	guardadoEn: string;
	idLiga: string;
};
