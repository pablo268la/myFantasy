import express, { Router } from "express";

import * as LigasController from "../controladores/ligasController";

const api: Router = express.Router();

api.get("/ligas/:id", LigasController.getLiga);

api.get("/ligas/random/new", LigasController.getRandomLiga);

api.get("/ligas/usuario/:idUsuario", LigasController.getLigasUsuario);

api.get('/ligas/join/:idLiga', LigasController.checkJoinLiga)

api.post("/ligas", LigasController.createLiga);

api.post("/ligas/:idLiga", LigasController.añadirUsuarioALiga);

api.post("/pujar/:idLiga", LigasController.pujar);

export default api;
