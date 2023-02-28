import { apiEndPoint } from "../helpers/constants";
import { Liga } from "../shared/sharedTypes";

export async function resetMercado(liga: Liga): Promise<Liga> {
	let response = await fetch(apiEndPoint + "/resetMercado/" + liga._id);

	switch (response.status) {
		case 200:
			return response.json();
		case 401:
			throw new Error("Unauthorized");
		case 404:
			throw new Error("Not Found");
		case 500:
			throw new Error("Internal Server Error");
		default:
			throw new Error("Unknown Error");
	}
}
