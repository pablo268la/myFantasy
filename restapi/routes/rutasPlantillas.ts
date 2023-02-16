import express, { Router } from "express";

import * as PlantillasController from "../controladores/plantillasController";

const api: Router = express.Router();

api.get("/plantillas/:idLiga/:idUsuario", PlantillasController.getPlantilla);

api.post("/plantillas/crear", PlantillasController.createPlantillaUsuario);

api.post("/plantillas/update", PlantillasController.updatePlantillaUsuario);

export default api;
