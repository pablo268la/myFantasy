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
			equipos.forEach(async (team: any) => {
				let e = await modeloEquipo.findOne({ _id: team.team.id });

				if (e == null || e.id == undefined) {
					e = new modeloEquipo({
						_id: team.team.id,
						nombre: team.team.name,
						slug: team.team.slug,
						jugadores: [],
						escudo:
							"https://api.sofascore.app/api/v1/team/" +
							team.team.id +
							"/image",
					});
					await e.save();
				}
			});
		})
		.catch((error) => {
			console.log(error);
		});

	return res.json();
};

export const getEquipo: RequestHandler = async (req, res) => {
	let id = req.body.id;
	let e;

	axios.get("https://api.sofascore.com/api/v1/team/" + id).then(async (res) => {
		let equipo = res.data.team;
		console.log(equipo);
		e = await modeloEquipo.findOne({ _id: equipo.id });
		e.escudo = "logo2";
		await modeloEquipo.findOneAndUpdate({ _id: equipo.id }, e, { new: true });
	});

	res.json(e);
};
