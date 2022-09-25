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
	idAlineacion: string;
	idAlineacionesJornada: string[];
	valor: number;
	puntos: number;
};
