export type Jugador = {
	_id: string;
	nombre: string;
	slug: string;
	posicion: string;
	equipo: Equipo;
	valor: number;
	puntos: number;
	estado: string;
	foto: string;
	jugadorAntiguo: object;
	fantasyMarcaId: string;
};

export type Equipo = {
	_id: string;
	nombre: string;
	slug: string;
	shortName: string;
	escudo: string;
};

export type PlantillaUsuario = {
	_id: string;
	usuario: Usuario;
	idLiga: string;
	alineacionJugador: AlineacionJugador;
	alineacionesJornada: AlineacionJugador[];
	valor: number;
	puntos: number;
};

export type AlineacionJugador = {
	_id: string;
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
	_id: string | undefined;
	nombre: string;
	plantillasUsuarios: PlantillaUsuario[];
	propiedadJugadores: PropiedadJugador[];
	enlaceInvitacion: string;
	maxJugadores: number;
	mercado: Venta[];
	configuracion: string;
};

export type PropiedadJugador = {
	jugador: Jugador;
	usuario: Usuario;
	titular: boolean;
};

export type Oferta = {
	comprador: Usuario;
	valorOferta: number;
	estado: string;
	privada: boolean;
};

export type Venta = {
	jugador: PropiedadJugador;
	ofertas: Oferta[];
	fechaLimite: string;
};
