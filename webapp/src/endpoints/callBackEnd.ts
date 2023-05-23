class BackendError extends Error {
	statusCode: number;
	constructor(message: string | undefined, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export async function doRequest(path: string, options?: RequestInit) {
	try {
		const response = await fetch(path);

		if (!response.ok) {
			await response.json().then((data) => {
				throw new BackendError(data.message, response.status);
			});
		}
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
