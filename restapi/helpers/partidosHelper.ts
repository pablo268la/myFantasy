import { modeloPartido } from "../model/partido";

export async function getJornadaActual() {
	const today = new Date();
	const partidos = await modeloPartido.find({}).select("fecha jornada");

	const afterToday = partidos
		.filter((p) => {
			const date = new Date(p.fecha);
			return date > today;
		})
		.sort((a, b) => a.jornada - b.jornada);

	if (afterToday.length === 0) return -1;
	else return afterToday[0].jornada;
}
