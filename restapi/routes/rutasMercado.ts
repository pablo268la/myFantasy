import express, { Router } from "express";
import * as MercadosController from "../controladores/mercadosController";

const api: Router = express.Router();

api.get("/resetmercado/:idLiga", MercadosController.resetmercado);

api.post("/pujar/:idLiga", MercadosController.hacerPuja);

export default api;
