import express, { Router } from "express";

import * as LigasController from "../controladores/ligasController";

const api: Router = express.Router();

api.put("/ligas/:id", LigasController.getLiga);

api.get("/ligas/", LigasController.getLigasUsuario);

api.post("/ligas", LigasController.createLiga)

export default api;
