import express, { Router } from "express";
import * as EquiposController from "../controladores/equiposController";

const api: Router = express.Router();

api.get("/equipos", EquiposController.getEquipos);

api.get("/equipos/:idEquipo", EquiposController.getEquipo);

export default api;
