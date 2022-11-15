import { useHistory } from "react-router-dom";
import { MenuLateral } from "./MenuLateral";

export function Home(props: any): JSX.Element {
	const history = useHistory();

	return (
		<>
			<MenuLateral></MenuLateral>
		</>
	);
}
