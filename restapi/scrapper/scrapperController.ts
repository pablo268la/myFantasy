import axios, { AxiosResponse } from "axios";
import { RequestHandler } from "express";
import { modeloEquipo } from "../model/equipo";
import { modeloJugador } from "../model/jugador";

// Obtaining products are unauthorized operations: everybody can list the products of the shop
export const getClasificacion: RequestHandler = async (req, res) => {
	let equipos: any;
	await axios
		.get(
			"https://api.sofascore.com/api/v1/unique-tournament/8/season/42409/standings/total"
		)
		.then((response: AxiosResponse) => {
			equipos = response.data.standings[0].rows;
		})
		.catch((error) => {
			console.log(error);
		});

	equipos.forEach(async (team: any) => {
		console.log(team.team.name + " empezando");

		let e = new modeloEquipo({
			_id: team.team.id,
			nombre: team.team.name,
			slug: team.team.slug,
			shortName: team.team.shortName,
			jugadores: [],
			escudo:
				"https://api.sofascore.app/api/v1/team/" + team.team.id + "/image",
		});
		let exists = await modeloEquipo.findOne({ _id: team.team.id });
		if (exists)
			await modeloEquipo.findOneAndUpdate({ _id: e._id }, e, { new: true });
		else await e.save();

		await cogerJugadoresEquipo(e._id);

		console.log(e.nombre + " finalizado");
	});

	return res.json();
};

export const getEquipo: RequestHandler = async (req, res) => {
	let id = req.body.id;

	await cogerJugadoresEquipo(id);

	res.json();
};

async function cogerJugadoresEquipo(id: any) {
	let players: any;
	let equipo = await modeloEquipo.findOne({ _id: id });
	await axios
		.get("https://api.sofascore.com/api/v1/team/" + id + "/players")
		.then(async (res) => {
			players = res.data.players;
		});

	console.log("Cogiendo jugadores del " + equipo.nombre);

	players.forEach(async (p: any) => {
		if (p.player.team.shortName === equipo.shortName) {
			let exists = await modeloJugador.findOne({ _id: p.player.id });

			let jugador = new modeloJugador({
				_id: p.player.id,
				nombre: p.player.name,
				slug: p.player.slug,
				posicion: checkPosition(p.player.position),
				idEquipo: id,
				valor: p.player.proposedMarketValue || 0,
				puntos: 0,
				estado: "Disponible",
				foto: "",
			});

			if (!exists) {
				await jugador.save();
			} else {
				await modeloJugador.findOneAndUpdate({ _id: p.player.id }, jugador, {
					new: true,
				});
			}
		}
	});

	console.log("Jugadores cogidos del " + equipo.nombre);

	return players;
}

function checkPosition(position: String) {
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
