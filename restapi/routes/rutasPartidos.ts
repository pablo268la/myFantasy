import express, { Router } from "express";
import * as PartidosController from "../controladores/partidosController";

const api: Router = express.Router();

/**
 * @openapi
 * /partidos/{id}:
 *  get:
 *     tags:
 *     - Partidos
 *     description: Devuelve el partido con el id indicado
 *     parameters:
 *     - name: id
 *       in: path
 *       description: id del partido
 *       required: true
 *       schema:
 *         type: string
 *       default: 10408559
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partido'
 *       404:
 *         description: Partido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
api.get("/partidos/:id", PartidosController.getPartido);

/**
 * @openapi
 * /partidos/jornada/{jornada}:
 *  get:
 *     tags:
 *     - Partidos
 *     description: Devuelve los partidos de la jornada indicada
 *     parameters:
 *     - name: jornada
 *       in: path
 *       description: jornada de los partidos
 *       required: true
 *       schema:
 *         type: string
 *       default: 1
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Partido'
 *       404:
 *         description: Partidos no encontrado
 *       500:
 *         description: Error interno del servidor
 */
api.get("/partidos/jornada/:jornada", PartidosController.getPartidosJornada);

/**
 * @openapi
 * /partidos/equipo/{idEquipo}:
 *  get:
 *     tags:
 *     - Partidos
 *     description: Devuelve los partidos del equipo indicado
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Partido'
 *       404:
 *         description: Partidos no encontrado
 *       500:
 *         description: Error interno del servidor
 */
api.get("/partidos/equipo/:idEquipo", PartidosController.getPartidosEquipo);

/**
 * @openapi
 * /partidos/puntuaciones/{idPartido}:
 *  get:
 *     tags:
 *     - Partidos
 *     description: Devuelve las puntuaciones del partido indicado
 *     parameters:
 *     - name: idPartido
 *       in: path
 *       description: id del partido
 *       required: true
 *       schema:
 *         type: string
 *       default: 10408559
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PuntuacionJugador'
 *       404:
 *         description: Partido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
api.get(
	"/partidos/puntuaciones/:idPartido",
	PartidosController.getPuntuacionesPartido
);

/**
 * @openapi
 * /partidos/{id}:
 *  put:
 *     tags:
 *     - Partidos
 *     description: Actualiza el partido indicado
 *     parameters:
 *     - name: id
 *       in: path
 *       description: id del partido
 *       required: true
 *       schema:
 *         type: string
 *       default: 10408559
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
 *       description: Partido a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partido'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Partido'
 *       404:
 *         description: Partido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
api.put("/partidos/:id", PartidosController.updatePartido);

export default api;
