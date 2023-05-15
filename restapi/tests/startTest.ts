import { GlobalConfig, ProjectConfig } from "@jest/types/build/Config";
import { MongoDBContainer, StartedMongoDBContainer } from "testcontainers";
import { modeloEquipo } from "../model/equipo";
import { modeloJugador } from "../model/jugador";
import { modeloPartido } from "../model/partido";
import { modelPuntuacionJugador } from "../model/puntuacion/puntuacionJugador";
import { modeloUsuario } from "../model/usuario";

const mongoose = require("mongoose");

module.exports = async function (
	globalConfig: GlobalConfig,
	projectConfig: ProjectConfig
) {
	const oldContainer: StartedMongoDBContainer = await new MongoDBContainer()
		.withReuse()
		.start();
	await oldContainer.stop();

	const container: StartedMongoDBContainer = await new MongoDBContainer()
		.withReuse()
		.start();

	await mongoose.connect(container.getConnectionString(), {
		directConnection: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		config: { autoIndex: false },
	});
	await crearUsuarios();
	await crearEquipos();
	await crearJugadores();
	await crearPartidos();
	await crearPuntuacionesJugadores();
};

async function crearUsuarios() {
	console.log("Creando usuarios");
	const json = require("./bdUsuarios.json");

	for (let i = 0; i < json.length; i++) {
		const usuario = json[i];
		await new modeloUsuario(usuario).save();
	}
	console.log("Usuarios creados");
}

async function crearEquipos() {
	console.log("Creando equipos");
	const json = require("./bdEquipos.json");

	for (let i = 0; i < json.length; i++) {
		const equipo = json[i];
		await new modeloEquipo(equipo).save();
	}
	console.log("Equipos creados");
}

async function crearJugadores() {
	console.log("Creando jugadores");
	const json = require("./bdJugadores.json");

	for (let i = 0; i < json.length; i++) {
		const jugador = json[i];
		await new modeloJugador(jugador).save();
	}
	console.log("Jugadores creados");
}

async function crearPartidos() {
	console.log("Creando partidos");
	const json = require("./bdPartidos.json");

	for (let i = 0; i < json.length; i++) {
		const partido = json[i];
		await new modeloPartido(partido).save();
	}
	console.log("Partidos creados");
}

async function crearPuntuacionesJugadores() {
	console.log("Creando puntuaciones jugadores");
	const json = require("./bdPuntuacionesJugadores.json");

	for (let i = 0; i < json.length; i++) {
		const puntuacionJugador = json[i];
		await new modelPuntuacionJugador(puntuacionJugador).save();
	}
	console.log("Puntuaciones jugadores creadas");
}
