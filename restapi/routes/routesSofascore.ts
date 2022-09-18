import express, { Router } from "express";
import * as EquiposController from "../controladores/equiposController";
import * as FantasyMarcaController from "../controladores/fantasyMarcaController";
import * as PartidosController from "../controladores/partidosController";
import * as PuntosController from "../controladores/puntosController";

const api: Router = express.Router();

api.get("/clasificacion", EquiposController.getEquiposSofascore);

api.get("/partidos", PartidosController.getPartidosSofascore);

api.get("/puntos", PartidosController.getPuntosPartidoSofascore);

api.get("/alineaciones", PartidosController.getAlineacionesPartidoSofascore);

api.get("/incidentes", PuntosController.getIncidentesPartidoSofascore);

api.get("/marca", FantasyMarcaController.getStatusJugador);

export default api;
