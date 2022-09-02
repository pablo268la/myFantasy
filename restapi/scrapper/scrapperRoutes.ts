import express, { Router } from "express";
import * as ScapperController from "./scrapperController";

const api: Router = express.Router();

api.get("/clasificacion", ScapperController.getClasificacion);


api.get("/equipo", ScapperController.getEquipo);


export default api;