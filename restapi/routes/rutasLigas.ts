import express, { Router } from "express";

import * as LigasController from "../controladores/ligasController";

const api: Router = express.Router();

api.get("/ligas/:id", LigasController.getLiga);

api.post("/ligas", LigasController.createLiga)

export default api;
