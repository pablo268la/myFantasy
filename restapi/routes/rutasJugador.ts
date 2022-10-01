import express, { Router } from "express";
import * as JugadoresController from "../controladores/jugadoresController";

const api: Router = express.Router();

api.get("/jugadores", JugadoresController.getJugadores);

api.get("/jugadoresEquipo/:idEquipo", JugadoresController.getJugadoresEquipo);

api.get("/jugadores/:idJugador", JugadoresController.getJugador);

api.get("/plantilla", JugadoresController.getPlantilla);
api.get("/alineacionJugador", JugadoresController.getAlineacionJugador);

export default api;
