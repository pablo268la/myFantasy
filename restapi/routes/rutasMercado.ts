import express, { Router } from "express";
import * as MercadosController from "../controladores/mercadosController";

const api: Router = express.Router();

api.get("/mercado/resetmercado/:idLiga", MercadosController.resetmercado);

/**
 * @openapi
 * /mercado/pujar/{idLiga}:
 *  post:
 *     tags:
 *       - Mercado
 *     description: Hace una puja por un jugador
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
 *     requestBody:
 *       description: Jugador y oferta a realizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jugadorEnVenta:
 *                 $ref: '#/components/schemas/PropiedadJugador'
 *               oferta:
 *                 $ref: '#/components/schemas/Oferta'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropiedadJugador'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Liga no encontrada
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *
 */
api.post("/mercado/pujar/:idLiga", MercadosController.hacerPuja);

/**
 * @openapi
 * /mercado/añadir/{idLiga}:
 *  post:
 *     tags:
 *       - Mercado
 *     description: Añade un jugador al mercado
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
 *     requestBody:
 *       description: Jugador a añadir al mercado
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propiedadJugador:
 *                 $ref: '#/components/schemas/PropiedadJugador'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropiedadJugador'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Liga no encontrada
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *
 */
api.post("/mercado/anadir/:idLiga", MercadosController.añadirJugadorMercado);

/**
 * @openapi
 * /mercado/aceptaroferta/{idLiga}:
 *  post:
 *     tags:
 *       - Mercado
 *     description: Aceptar una puja por un jugador
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
 *     requestBody:
 *       description: Id del comprador y del jugador en venta
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idComprador:
 *                 type: string
 *               idJuagdorEnVenta:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropiedadJugador'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Liga no encontrada | Usuario comprador no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *
 */
api.post("/mercado/aceptaroferta/:idLiga", MercadosController.aceptarOferta);

/**
 * @openapi
 * /mercado/rechazaroferta/{idLiga}:
 *  post:
 *     tags:
 *       - Mercado
 *     description: Rechazar una puja por un jugador
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
 *     requestBody:
 *       description: Id del comprador y del jugador en venta
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idComprador:
 *                 type: string
 *               idJuagdorEnVenta:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropiedadJugador'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Liga no encontrada | Usuario comprador no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *
 */
api.post("/mercado/rechazaroferta/:idLiga", MercadosController.rechazarOferta);

export default api;
