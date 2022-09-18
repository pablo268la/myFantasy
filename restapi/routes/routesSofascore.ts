import express, { Router } from "express";
import * as FantasyMarcaController from "../controladoresSofascore/fantasyMarcaController";
import * as EquiposController from "../controladoresSofascore/sofascoreEquiposController";
import * as PartidosController from "../controladoresSofascore/sofascorePartidosController";
import * as PuntosController from "../controladoresSofascore/sofascorePuntosController";

const api: Router = express.Router();

api.get("/clasificacion", EquiposController.getEquiposSofascore);

api.get("/partidos", PartidosController.getPartidosRondaSofascore);

api.get("/alineaciones", PartidosController.getAlineacionesPartidoSofascore);

api.get("/puntos", PuntosController.getPuntosPartidoSofascore);

api.get("/incidentes", PuntosController.getIncidentesPartidoSofascore);

api.get("/marca", FantasyMarcaController.getStatusJugador);

export default api;
