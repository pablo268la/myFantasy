import express, { Router } from "express";
import * as MercadosController from "../controladores/mercadosController";

const api: Router = express.Router();

/**
 * @openapi
 * /mercado:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
api.get("/mercado/resetmercado/:idLiga", MercadosController.resetmercado);

api.post("/mercado/pujar/:idLiga", MercadosController.hacerPuja);

api.post("/mercado/anadir/:idLiga", MercadosController.añadirJugadorMercado);

api.post("/mercado/aceptaroferta/:idLiga", MercadosController.aceptarOferta);

api.post("/mercado/rechazaroferta/:idLiga", MercadosController.rechazarOferta);

export default api;
