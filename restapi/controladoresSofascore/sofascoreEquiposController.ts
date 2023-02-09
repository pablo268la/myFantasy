import axios from "axios";
import { RequestHandler } from "express";
import { checkPosition } from "../helpers/checkHelper";
import { IEquipo, modeloEquipo } from "../model/equipo";
import { IJugador, modeloJugador } from "../model/jugador";

export const urlClasificacion =
	"https://api.sofascore.com/api/v1/unique-tournament/8/season/42409/standings/total";
export const urlEquipo = "https://api.sofascore.app/api/v1/team/";
export const urlJugador = "https://api.sofascore.app/api/v1/player/";

export const getEquiposSofascore: RequestHandler = async (req, res) => {
	let equipos: any;
	let result: IEquipo[] = [];

	await axios.get(urlClasificacion).then((response) => {
		equipos = response.data.standings[0].rows;
	});

	for (let i = 0; i < equipos.length; i++) {
		let team = equipos[i];

		let e: IEquipo | null = new modeloEquipo({
			_id: team.team.id,
			nombre: team.team.name,
			slug: team.team.slug,
			shortName: team.team.shortName,
			escudo: urlEquipo + team.team.id + "/image",
		});

		let exists: IEquipo | null = await modeloEquipo.findOne({
			_id: team.team.id,
		});

		if (exists !== null) {
			e = await modeloEquipo.findOneAndUpdate({ _id: e._id }, e, { new: true });
		} else {
			e = await modeloEquipo.create(e);
		}

		if (e !== null) {
			await cogerJugadoresEquipo(e._id);
			result.push(e);
		}
	}

	return res.json(result);
};

async function cogerJugadoresEquipo(idEquipo: string) {
	let players: any[] = [];
	let jugadores: IJugador[] = [];
	let equipo: IEquipo | null = await modeloEquipo.findOne({ _id: idEquipo });

	await axios.get(urlEquipo + idEquipo + "/players").then(async (res) => {
		players = res.data.players;
	});

	if (equipo === null) return;

	for (let i = 0; i < players.length; i++) {
		let p = players[i];
		if (p.player.team.shortName === equipo.shortName) {
			let exists: IJugador | null = await modeloJugador.findOne({
				_id: p.player.id,
			});

			let jugador: IJugador = new modeloJugador({
				_id: p.player.id,
				nombre: p.player.name,
				slug: p.player.slug,
				posicion: checkPosition(p.player.position),
				idEquipo: idEquipo,
				valor: p.player.proposedMarketValue || 0,
				puntos: 0,
				estado: "Disponible",
				foto: urlJugador + p.player.id + "/image",
				puntuaciones: [],
			});

			if (exists === null) {
				await modeloJugador.create(jugador);
			} else {
				jugador.puntos = exists.puntos;
				jugador.jugadorAntiguo = exists.jugadorAntiguo;
				jugador.estado = exists.estado;
				jugador.fantasyMarcaId = exists.fantasyMarcaId;
				await modeloJugador.findOneAndUpdate({ _id: p.player.id }, jugador, {
					new: true,
				});
			}

			jugadores.push(jugador);
		}
	}

	return jugadores;
}
