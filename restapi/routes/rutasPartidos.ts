import express, { Router } from "express";
import * as PartidosController from "../controladores/partidosController";

const api: Router = express.Router();

api.get("/partidos", PartidosController.getPartidos);

api.get("/partidos/:id", PartidosController.getPartido);

export default api;
