import express, { Router } from "express";
import * as MercadosController from "../controladores/mercadosController";

const api: Router = express.Router();

api.get("/resetmercado/:idLiga", MercadosController.resetmercado);

export default api;
