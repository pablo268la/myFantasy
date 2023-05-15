import express, { Router } from "express";
import * as PuntuacionesController from "../controladores/puntuacionesController";

const api: Router = express.Router();

/**
 * @openapi
 * /puntuaciones/{idJugador}:
 *  get:
 *     tags:
 *       - Puntuaciones
 *     description: Devuelve las puntuaciones de un jugador
 *     parameters:
 *     - name: idJugador
 *       in: path
 *       description: id del jugador
 *       required: true
 *       schema:
 *         type: string
 *       default: 789381
 *     responses:
 *       200:
 *         description: Puntuaciones del jugador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PuntuacionJugador'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
api.get(
	"/puntuaciones/:idJugador",
	PuntuacionesController.getPuntuacionesJugador
);

/**
 * @openapi
 * /puntuaciones/{idJugador}/{semana}:
 *  get:
 *     tags:
 *       - Puntuaciones
 *     description: Devuelve las puntuaciones de un jugador
 *     parameters:
 *     - name: idJugador
 *       in: path
 *       description: id del jugador
 *       required: true
 *       schema:
 *         type: string
 *       default: 789381
 *     - name: semana
 *       in: path
 *       description: semana de la puntuacion
 *       required: true
 *       schema:
 *         type: string
 *       default: 1
 *     responses:
 *       200:
 *         description: Puntuaciones del jugador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PuntuacionJugador'
 *       404:
 *         description: Jugador no encontrado
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
api.get(
	"/puntuaciones/:idJugador/:semana",
	PuntuacionesController.getPuntuacionesJugadorJornada
);

/**
 * @openapi
 * /puntuaciones:
 *  post:
 *     tags:
 *     - Puntuaciones
 *     description: Guarda una puntuacion
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
 *       description: Puntuacion a guardar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PuntuacionJugador'
 *     responses:
 *        200:
 *          description: Puntuacion guardada
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/PuntuacionJugador'
 *        401:
 *          description: Usuario no autenticado | Usuario no autorizado
 *        404:
 *          description: Jugador no encontrado
 *        500:
 *          description: Error interno
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
api.post("/puntuaciones", PuntuacionesController.guardarPuntuacion);

export default api;
