import express, { Router } from "express";
import * as JugadoresController from "../controladores/jugadoresController";

const api: Router = express.Router();

/**
 * @openapi
 * /jugadores:
 *  get:
 *     tags:
 *     - Jugadores
 *     description: Devuelve todos los jugadores
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Jugador'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
api.get("/jugadores", JugadoresController.getJugadores);

/**
 * @openapi
 * /jugadoresEquipo/{idEquipo}:
 *  get:
 *     tags:
 *     - Jugadores
 *     description: Devuelve los jugadores de un equipo
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
 *                 $ref: '#/components/schemas/Jugador'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
api.get("/jugadoresEquipo/:idEquipo", JugadoresController.getJugadoresEquipo);

/**
 * @openapi
 * /jugadores/{idJugador}:
 *  get:
 *     tags:
 *     - Jugadores
 *     description: Devuelve el jugador con el id indicado
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
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Jugador'
 *       404:
 *         description: Jugador no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
api.get("/jugadores/:idJugador", JugadoresController.getJugador);

/**
 * @openapi
 * /jugadores/antiguos/{idEquipo}/{semana}:
 *  get:
 *     tags:
 *     - Jugadores
 *     description: Devuelve los jugadores del equipo, traspasados antes de la semana indicada
 *     parameters:
 *     - name: idEquipo
 *       in: path
 *       description: id del equipo
 *       required: true
 *       schema:
 *         type: string
 *       default: 2846
 *     - name: semana
 *       in: path
 *       description: semana
 *       required: true
 *       schema:
 *         type: string
 *       default: 5
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Jugador'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *
 */
api.get(
	"/jugadores/antiguos/:idEquipo/:semana",
	JugadoresController.getJugadoresAntiguos
);

/**
 * @openapi
 * /jugadores/{idJugador}:
 *  put:
 *     tags:
 *     - Jugadores
 *     description: Actualiza el jugador con el id indicado
 *     parameters:
 *     - name: idJugador
 *       in: path
 *       description: id del jugador
 *       required: true
 *       schema:
 *         type: string
 *       default: 789381
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
 *       description: Datos del jugador
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Jugador'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Jugador'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
api.put("/jugadores/:idJugador", JugadoresController.updateJugador);

export default api;
