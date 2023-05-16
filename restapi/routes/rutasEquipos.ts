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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipo'
 *       404:
 *         description: Equipo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
api.get("/equipos", EquiposController.getEquipos);

/**
 * @openapi
 * /equipos/{idEquipo}:
 *  get:
 *     tags:
 *     - Equipos
 *     description: Devuelve el equipo con el id indicado
 *     parameters:
 *     - name: idEquipo
 *       in: path
 *       description: id del equipo
 *       required: true
 *       schema:
 *         type: string
 *       default: 2820
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       500:
 *         description: Error interno del servidor
 */
api.get("/equipos/:idEquipo", EquiposController.getEquipo);

export default api;
