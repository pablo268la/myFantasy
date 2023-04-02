import express, { Router } from "express";
import * as PuntuacionesController from "../controladores/puntuacionesController";

const api: Router = express.Router();

api.get(
	"/puntuaciones/:idJugador",
	PuntuacionesController.getPuntuacionesJugador
);

api.post("/puntuaciones", PuntuacionesController.guardarPuntuacion);

api.get(
	"/puntuaciones/calcular/:idJugador",
	PuntuacionesController.puntuarPuntuacionesJugador
);

export default api;
