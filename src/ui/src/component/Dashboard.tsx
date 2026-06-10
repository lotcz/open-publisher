import {useUserSession} from "../util/UserSession";
import {useRestClient} from "../client/OpRestClient";
import {Link} from "react-router";

export default function Dashboard() {
	const userSession = useUserSession();
	const restClient = useRestClient();

	return (
		<div className="p-3 pt-1">
			<h1>Centrální publikace článků</h1>
			<hr/>
			<p>
				Systém umožňuje vkládat články, které mohou být použity na více různých webech.
			</p>
			<p>
				Jste přihlášeni jako uživatel <strong>{userSession.user.email}</strong>,
				vaše role je <strong>{userSession.user.userRole}</strong>.
				Odhlásit se můžete <Link to="" onClick={() => restClient.logOut()}>zde</Link>.
			</p>
		</div>
	);
}
