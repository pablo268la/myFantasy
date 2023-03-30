import {
    PuntuacionJSON,
    TripleeEstadisticaTramosValue as TripleEstadisticaTramosValue,
    TuppleEstadisticaValue,
    TuppleTramosValue,
} from "../shared/sharedTypes";

export function openJSON(): PuntuacionJSON {
	return require("./portero.json");
}

export function filterAndPop(
	lista: TuppleEstadisticaValue[],
	tope: number
): number {
	if (!tope) return 0;
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
	if (!tope) return 0;
	let r =
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
