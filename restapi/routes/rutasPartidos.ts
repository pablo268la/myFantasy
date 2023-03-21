import express, { Router } from "express";
import * as PartidosController from "../controladores/partidosController";

const api: Router = express.Router();

api.get("/partidos", PartidosController.getPartidos);

api.get("/partidos/:id", PartidosController.getPartido);

api.get("/partidos/jornada/:jornada", PartidosController.getPartidosJornada);

api.get("/partidos/equipo/:idEquipo", PartidosController.getPartidosEquipo);

api.get(
	"/partidos/puntuaciones/:idPartido",
	PartidosController.getPuntuacionesPartido
);

export default api;
