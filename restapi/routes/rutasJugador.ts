import express, { Router } from "express";
import * as JugadoresController from "../controladores/jugadoresController";

const api: Router = express.Router();

api.get("/jugadores", JugadoresController.getJugadores);

api.get("/jugadoresEquipo/:idEquipo", JugadoresController.getJugadoresEquipo);

api.get("/jugadores/:idJugador", JugadoresController.getJugador);

api.get(
	"/jugadores/antiguos/:idEquipo/:semana",
	JugadoresController.getJugadoresAntiguos
);

api.put("/jugadores/:idJugador", JugadoresController.updateJugador);

export default api;
