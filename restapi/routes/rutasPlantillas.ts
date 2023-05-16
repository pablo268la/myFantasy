import express, { Router } from "express";

import * as PlantillasController from "../controladores/plantillasController";

const api: Router = express.Router();

/**
 * @openapi
 * /plantillas/{idLiga}/{idUsuario}:
 *  get:
 *     tags:
 *       - Plantillas
 *     description: Devuelve la plantilla de un usuario en una liga
 *     parameters:
 *     - name: idLiga
 *       in: path
 *       description: id de la liga
 *       required: true
 *       schema:
 *         type: string
 *     - name: idUsuario
 *       in: path
 *       description: id del usuario
 *       required: true
 *       schema:
 *         type: string
 *     - name: email
 *       in: header
 *       description: email del usuario
 *       required: true
 *       schema:
 *         type: string
 *     - name: token
 *       in: header
 *       description: token del usuario
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlantillaUsuario'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Plantilla no encontrada | Liga no encontrada
 *       00:
 *         description: Error interno del servidor
 *
 */
api.get("/plantillas/:idLiga/:idUsuario", PlantillasController.getPlantilla);

/**
 * @openapi
 * /plantillas/update:
 *  post:
 *     tags:
 *       - Plantillas
 *     description: Actualiza la plantilla para un usuario en una liga
 *     parameters:
 *     - name: email
 *       in: header
 *       description: email del usuario
 *       required: true
 *       schema:
 *         type: string
 *     - name: token
 *       in: header
 *       description: token del usuario
 *       required: true
 *       schema:
 *         type: string
 *     requestBody:
 *       description: Plantilla del usuario e Id de la liga
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idLiga:
 *                 type: string
 *               plantilla:
 *                 $ref: '#/components/schemas/PlantillaUsuario'
 *     responses:
 *       201:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlantillaUsuario'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Liga no encontrada | Plantilla no encontrada
 *       500:
 *         description: Error interno del servidor
 *
 */
api.post("/plantillas/update", PlantillasController.updatePlantillaUsuario);

export default api;
