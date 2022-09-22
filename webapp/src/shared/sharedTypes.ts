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
