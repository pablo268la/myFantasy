import { RequestHandler } from "express";
import { modeloEquipo } from "../model/equipo";

export const getEquipos: RequestHandler = async (req, res) => {
	try {
		res.status(200).json(await modeloEquipo.find());
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

export const getEquipo: RequestHandler = async (req, res) => {
	try {
		const j = await modeloEquipo.findOne({ _id: req.params.idEquipo });
		if (j) {
			res.json(j);
		} else {
			res.status(404).json({ message: "Equipo no encontrado" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};
