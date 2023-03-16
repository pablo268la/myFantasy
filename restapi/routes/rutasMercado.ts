import express, { Router } from "express";
import * as MercadosController from "../controladores/mercadosController";

const api: Router = express.Router();

api.get("/mercado/resetmercado/:idLiga", MercadosController.resetmercado);

api.post("/mercado/pujar/:idLiga", MercadosController.hacerPuja);

api.post("/mercado/anadir/:idLiga", MercadosController.añadirJugadorMercado);

api.post("/mercado/aceptaroferta/:idLiga", MercadosController.aceptarOferta);

api.post("/mercado/rechazaroferta/:idLiga", MercadosController.rechazarOferta);

export default api;
