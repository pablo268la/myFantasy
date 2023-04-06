import express, { Router } from "express";
import * as PuntuacionesController from "../controladores/puntuacionesController";

const api: Router = express.Router();

api.get(
	"/puntuaciones/:idJugador",
	PuntuacionesController.getPuntuacionesJugador
);

api.get(
	"/puntuaciones/:idJugador/:semana",
	PuntuacionesController.getPuntuacionesJugadorJornada
);

api.post("/puntuaciones", PuntuacionesController.guardarPuntuacion);

export default api;
