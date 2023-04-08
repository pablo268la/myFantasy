import {
	PuntuacionJSON,
	TripleeEstadisticaTramosValue as TripleEstadisticaTramosValue,
	TuppleEstadisticaValue,
	TuppleTramosValue,
} from "../shared/sharedTypes";

export function openJSON(posicion: string): PuntuacionJSON {
	switch (posicion.toLowerCase()) {
		case "portero":
			return require("./portero.json");
		case "defensa":
			return require("./defensa.json");
		case "mediocentro":
			return require("./mediocentro.json");
		case "delantero":
			return require("./delantero.json");
		default:
			return require("./mediocentro.json");
	}
}

export function filterAndPop(
	lista: TuppleEstadisticaValue[],
	tope: number
): number {
	return (
		lista
			.filter((element: TuppleEstadisticaValue) => {
				if (tope >= element.estadistica) return element;
			})
			.pop() || lista.slice(0, 1)[0]
	).value;
}

// Solo para goles recibidos
export function filterAndPopByTramos(
	lista: [TripleEstadisticaTramosValue[]],
	tope: number,
	minutesPlayed: number
): number {
	let pos = 0;
	if (minutesPlayed >= 60) pos = 2;
	else if (minutesPlayed >= 30) pos = 1;

	let listaFinal = lista[pos];
	let r =
		listaFinal
			.filter((element: TripleEstadisticaTramosValue) => {
				if (tope >= element.estadistica) return element;
			})
			.pop() || listaFinal.slice(0, 1)[0];

	if (r.estadistica === 0) return r.value;
	return getByTramos(r, tope);
}

export function getByTramos(tupple: TuppleTramosValue, tope: number): number {
	return Number.parseInt("" + tope / tupple.tramos) * tupple.value;
}
