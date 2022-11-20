import { RequestHandler } from "express";
import * as UUID from "uuid";
import { modeloLiga } from "../model/liga";
import { modeloUsuario } from "../model/usuario";
import { verifyUser } from "./usuariosController";

export const getLiga: RequestHandler = async (req, res) => {
	const email = req.body.email;
	const token = req.body.token;
	try {
		let usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			const ligaEncontrada = await modeloLiga.findById(req.params.id);
			if (!ligaEncontrada) return res.status(204).json();

			if (ligaEncontrada.idUsuarios.indexOf(usuario.id) === -1)
				return res
					.status(401)
					.json({ message: "Usuario no autorizado: No pertence a esta liga" });

			return res.status(200).json(ligaEncontrada);
		} else {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}
	} catch (error) {
		return res.status(500).json(error);
	}
};

export const getLigasUsuario: RequestHandler = async (req, res) => {
	const email = req.body.email;
	const token = req.body.token;
	try {
		let usuario = await modeloUsuario.findOne({ email: email });
		const verified = await verifyUser(email, token);

		if (usuario && verified) {
			return res.status(200).json(usuario.ligas);
		} else {
			return res.status(401).json({ message: "Usuario no autorizado" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

export const createLiga: RequestHandler = async (req, res) => {
	const email = req.body.email;
	const token = req.body.token;

	let usuario = await modeloUsuario.findOne({ email: email });
	const verified = await verifyUser(email, token);
	try {
		if (usuario && verified) {
			const ligaCreada = new modeloLiga({
				_id: UUID.v4(),
				nombre: req.body.nombre,
				idUsuarios: [usuario.id],
				propiedadJugadores: [],
				enlaceInvitacion: "miEnlace",
				configuracion: "",
			});
			const ligaGuardada = await ligaCreada.save();

			usuario.ligas.push(ligaGuardada._id);
			await usuario.save();
			return res.status(201).json(ligaGuardada);
		} else {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};
