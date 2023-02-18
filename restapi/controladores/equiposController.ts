import { RequestHandler } from "express";
import { modeloEquipo } from "../model/equipo";

export const getEquipos: RequestHandler = async (req, res) => {
	try {
		res.status(200).json(await modeloEquipo.find());
	} catch (error) {
		res.status(500).json(error);
	}
};

export const getEquipo: RequestHandler = async (req, res) => {
	try {
		res
			.status(200)
			.json(await modeloEquipo.findOne({ _id: req.params.idEquipo }));
	} catch (error) {
		res.status(500).json(error);
	}
};
