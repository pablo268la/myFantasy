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
	alineacionJugador: AlineacionJugador;
	alineacionesJornada: AlineacionJugador[];
	valor: number;
	puntos: number;
};

export type AlineacionJugador = {
	_id: string;
	idUsuario: string;
	porteros: JugadorEnPlantilla[];
	defensas: JugadorEnPlantilla[];
	medios: JugadorEnPlantilla[];
	delanteros: JugadorEnPlantilla[];
	formacion: string;
	guardadoEn: string;
	idLiga: string;
};

export type JugadorEnPlantilla = {
	idJugador: string;
	enPlantilla: boolean;
};

export type JugadorTitular = {
	jugador: Jugador;
	titular: boolean;
};
