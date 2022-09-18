import express, { Router } from "express";
import * as EquiposController from "../controladores/equiposController";
import * as PartidosController from "../controladores/partidosController";
import * as PuntosController from "../controladores/puntosController";
import * as ScapperController from "./scrapperController";

const api: Router = express.Router();

api.get("/clasificacion", EquiposController.getEquipos);

api.get("/partidos", PartidosController.getPartidos);

api.get("/puntos", PartidosController.getPuntosPartido);

api.get("/incidentes", PuntosController.getIncidentesPartido);

api.get("/marca", ScapperController.getStatusJugador);

export default api;
