import express, { Router } from "express";

import * as LigasController from "../controladores/ligasController";

const api: Router = express.Router();

/**
 * @openapi
 * /ligas/{id}:
 *  get:
 *     tags:
 *     - Ligas
 *     description: Devuelve una liga
 *     parameters:
 *     - name: id
 *       in: path
 *       description: id de la liga
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
 *               $ref: '#/components/schemas/Liga'
 *       401:
 *         description: Usuario no autorizado
 *       404:
 *         description: Liga no encontrada
 *       409:
 *         description: Usuario no pertenece a la liga
 *       500:
 *         description: Error interno del servidor
 *
 */
api.get("/ligas/:id", LigasController.getLiga);

/**
 * @openapi
 * /ligas/random:
 *  get:
 *     tags:
 *     - Ligas
 *     description: Devuelve una liga aleatoria para que el usuario se una
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
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Liga'
 *       401:
 *         description: Usuario no autorizado
 *       404:
 *         description: No hay ligas disponibles
 *       500:
 *         description: Error interno del servidor
 *
 */
api.get("/ligas/random/new", LigasController.getRandomLiga);

/**
 * @openapi
 * /ligas/usuario/{idUsuario}:
 *  get:
 *     tags:
 *     - Ligas
 *     description: Devuelve las ligas del usuario
 *     parameters:
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Liga'
 *       401:
 *         description: Usuario no autorizado
 *       500:
 *         description: Error interno del servidor
 *
 */
api.get("/ligas/usuario/:idUsuario", LigasController.getLigasUsuario);

/**
 * @openapi
 * /ligas:
 *  post:
 *     tags:
 *     - Ligas
 *     description: Crear una liga
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
 *       description: Datos de la liga
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               liga:
 *                 $ref: '#/components/schemas/Liga'
 *     responses:
 *       201:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Liga'
 *       401:
 *         description: Usuario no autorizado
 *       409:
 *         description: Máximo de ligas alcanzado
 *       500:
 *         description: Error interno del servidor
 *
 */
api.post("/ligas", LigasController.createLiga);

/**
 * @openapi
 * /ligas/{idLiga}:
 *  post:
 *     tags:
 *     - Ligas
 *     description: Añadir usuario a liga
 *     parameters:
 *     - name: idLiga
 *       in: path
 *       description: id de la liga
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
 *         description: Usuario no autorizado
 *       409:
 *         description: Máximo de ligas alcanzado
 *       500:
 *         description: Error interno del servidor
 *
 */
api.post("/ligas/:idLiga", LigasController.añadirUsuarioALiga);


/**
 * @openapi
 * /ligas/{idLiga}/{idUsuario}:
 *  delete:
 *     tags:
 *     - Ligas
 *     description: Eliminar usuario de liga
 *     parameters:
 *     - name: idLiga
 *       in: path
 *       description: id de la liga
 *       required: true
 *       schema:
 *         type: string
 *     - name: id
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
 *               type: string
 *       401:
 *         description: Usuario no autorizado | Usuario no autenticado
 *       404:
 *         description: Liga no encontrada 
 *       409:
 *         description: Usuario no pertenece a la liga
 *       500:
 *         description: Error interno del servidor
 *
 */
api.delete("/ligas/:idLiga/:idUsuario", LigasController.deleteUsuarioFromLiga);

export default api;
