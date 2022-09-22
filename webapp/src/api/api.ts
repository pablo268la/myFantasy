import { Jugador } from "../shared/sharedTypes";

const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";

/*export async function addUser(user: User): Promise<boolean> {
	let response = await fetch(apiEndPoint + "/users/add", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: user.name, email: user.email }),
	});
	if (response.status === 200) return true;
	else return false;
}*/

export async function getJugadores(): Promise<Jugador[]> {
	let response = await fetch(apiEndPoint + "/jugadores");
	return response.json();
}

export async function getJugadorById(id: string): Promise<Jugador> {
	let response = await fetch(apiEndPoint + "/jugadores/" + id);
	return response.json();
}
