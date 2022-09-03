import express, { Router } from "express";
import * as ScapperController from "./scrapperController";

const api: Router = express.Router();

api.get("/clasificacion", ScapperController.getClasificacion);

api.get("/partidos", ScapperController.getPartidos);

export default api;
