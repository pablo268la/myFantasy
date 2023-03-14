import express, { Router } from "express";
import * as PuntuacionesController from "../controladores/puntuacionesController";

const api: Router = express.Router();

api.get("/puntuaciones", PuntuacionesController.getPuntuacionesJugadores);

api.get("/puntuaciones/:idJugador", PuntuacionesController.getPuntuacionesJugador);

export default api;
