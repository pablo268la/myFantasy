import express, { Router } from "express";
import * as UsuariosController from "../controladores/usuariosController";

const api: Router = express.Router();

api.get("/usuario/:id", UsuariosController.getUsuario);

api.get("/eusuario/:email", UsuariosController.getUsuarioByEmail);

api.post("/usuario", UsuariosController.createUsuario);

api.put("/usuario/:email", UsuariosController.updateUsuario);

api.post("/token", UsuariosController.requestToken);

api.get("/token", UsuariosController.verifyToken);

export default api;
