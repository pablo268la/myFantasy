import axios from "axios";
import { RequestHandler } from "express";
import { checkEstado } from "../helpers/checkHelper";
import { IJugador, modeloJugador } from "../model/jugador";

export const urlPlayerMarca =
	"https://api.laligafantasymarca.com/api/v3/player/";

export const getStatusJugador: RequestHandler = async (req, res) => {
	let j: IJugador[] = await modeloJugador.find();
	for (let i = 0; j.length; i++) {
		let jugador = j[i];
		if (
			jugador !== null &&
			jugador.equipo.id !== "0" &&
			jugador.fantasyMarcaId !== undefined
		) {
			await axios
				.get(urlPlayerMarca + jugador.fantasyMarcaId)
				.then(async (response) => {
					jugador.estado = checkEstado(response.data.playerStatus);
					await modeloJugador.findOneAndUpdate({ id: jugador.id }, jugador, {
						new: true,
					});
				});
		}
	}
	res.json(j);
};

export const getFotoJugadorMarca: RequestHandler = async (req, res) => {
	let j: IJugador[] = await modeloJugador.find();
	for (let i = 0; j.length - 1; i++) {
		let jugador = j[i];
		console.log(jugador.nombre);
		if (
			jugador !== null &&
			jugador.equipo.id !== "0" &&
			jugador.fantasyMarcaId !== undefined
		) {
			await axios
				.get(urlPlayerMarca + jugador.fantasyMarcaId)
				.then(async (response) => {
					jugador.foto = response.data.images.transparent["256x256"];
					await modeloJugador.findOneAndUpdate({ id: jugador.id }, jugador, {
						new: true,
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}
	res.json(j);
};
