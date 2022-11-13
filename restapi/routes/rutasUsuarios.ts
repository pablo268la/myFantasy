import express, { Router } from "express";
import * as UsuariosController from "../controladores/usuariosController";

const api: Router = express.Router();

api.get("/usuario/:email", UsuariosController.getUsuario);

api.post("/usuario", UsuariosController.createUsuario);

api.put("/usuario/:email", UsuariosController.updateUsuario);

export default api;
