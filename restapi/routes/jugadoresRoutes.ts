import express, { Router } from "express";
import * as JugadoresController from "../controladores/jugadoresController";

const api: Router = express.Router();

api.get("/jugadoresEquipo/:idEquipo", JugadoresController.getJugadoresEquipo);

api.get("/jugadores/:idJugador", JugadoresController.getJugador);

export default api;
