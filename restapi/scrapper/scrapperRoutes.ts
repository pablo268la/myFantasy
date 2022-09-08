import express, { Router } from "express";
import * as ScapperController from "./scrapperController";

const api: Router = express.Router();

api.get("/clasificacion", ScapperController.getEquipos);

api.get("/partidos", ScapperController.getPartidos);

api.get("/puntos", ScapperController.getPuntosJugador);

export default api;
