import {
	PuntuacionJSON,
	TripleeEstadisticaTramosValue as TripleEstadisticaTramosValue,
	TuppleEstadisticaValue,
	TuppleTramosValue,
} from "./sharedTypes";

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
	if (!tope || tope < 0) return 0;
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
	lista: TripleEstadisticaTramosValue[],
	tope: number
): number {
	if (!tope || tope < 0) return 0;
	const r =
		lista
			.filter((element: TripleEstadisticaTramosValue) => {
				if (tope >= element.estadistica) return element;
			})
			.pop() || lista.slice(0, 1)[0];

	if (r.estadistica === 0) return r.value;
	return getByTramos(r, tope);
}

export function getByTramos(tupple: TuppleTramosValue, tope: number): number {
	if (!tope) return 0;
	return Number.parseInt("" + tope / tupple.tramos) * tupple.value;
}
