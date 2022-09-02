import axios, { AxiosResponse } from "axios";
import { RequestHandler } from "express";
import { modeloEquipo } from "../model/equipo";

// Obtaining products are unauthorized operations: everybody can list the products of the shop
export const getClasificacion: RequestHandler = async (req, res) => {
	axios
		.get(
			"https://api.sofascore.com/api/v1/unique-tournament/8/season/42409/standings/total"
		)
		.then((res: AxiosResponse) => {
			let equipos = res.data.standings[0].rows;
			equipos.forEach(async (equipo: any) => {
				let team = modeloEquipo.findOne({ _id: equipo.team.id });

				team = new modeloEquipo({
					_id: equipo.team.id,
					nombre: equipo.team.name,
					slug: equipo.team.slug,
					jugadores: [],
					escudo: "logo1",
				});

				await guardarNuevoOActualizar(team, equipo);
			});
		})
		.catch((error) => {
			console.log(error);
		});

	return res.json();
};

async function guardarNuevoOActualizar(team: any, equipo: any) {
	if (team) {
		await modeloEquipo.findOneAndUpdate({ _id: equipo.team.id }, team, {
			new: true,
		});
	} else {
		await team.save();
	}
}
