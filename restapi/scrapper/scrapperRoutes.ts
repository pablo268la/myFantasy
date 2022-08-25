import express, { Router } from "express";
import * as ScapperController from "./scrapperController";

const api: Router = express.Router();

api.get("/clasificacion", ScapperController.getClasificacion);


export default api;