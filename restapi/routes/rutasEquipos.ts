import express, { Router } from "express";
import * as EquiposController from "../controladores/equiposController";

const api: Router = express.Router();

/**
 * @openapi
 * /equipos:
 *  get:
 *     tags:
 *     - Equipos
 *     description: Devuelve todos los equipos
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Equipo'
 */
api.get("/equipos", EquiposController.getEquipos);

api.get("/equipos/:idEquipo", EquiposController.getEquipo);

export default api;
