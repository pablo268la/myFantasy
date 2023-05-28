class BackendError extends Error {}

export async function doRequest(path: string, options?: RequestInit) {
	try {
		const response = await fetch(path, options);

		if (!response.ok) {
			await response.json().then((data) => {
				throw new BackendError(data.message);
			});
		}

		if (response.status === 204) return;
		return response.json();
	} catch (error) {
		if (error instanceof BackendError) {
			console.log(error);
			throw error;
		} else {
			console.log(error);
			throw new Error("Error en el servidor. Intente nuevamente más tarde");
		}
	}
}
