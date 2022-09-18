export function checkPosition(position: String) {
	switch (position) {
		case "G":
			return "Portero";
		case "D":
			return "Defensa";
		case "M":
			return "Mediocentro";
		case "F":
			return "Delantero";
		default:
			return "Sin asignar";
	}
}

export function checkStatusPartido(status: any) {
	switch (status) {
		case "not_started":
			return "Por jugar";
		case "inprogress":
			return "En juego";
		case "finished":
			return "Finalizado";
		default:
			return "Por jugar";
	}
}

export function checkEstado(status: string): string {
	switch (status) {
		case "ok":
			return "Disponible";
		case "injured":
			return "Lesionado";
		case "doubtful":
			return "Dudoso";
		default:
			return "No disponible";
	}
}
