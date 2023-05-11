import express, { Router } from "express";
import * as UsuariosController from "../controladores/usuariosController";

const api: Router = express.Router();

api.get("/usuario/:email", UsuariosController.getUsuario);

api.post("/usuario", UsuariosController.createUsuario);

api.post("/token", UsuariosController.requestToken);

api.get("/token", UsuariosController.verifyToken);

export default api;
