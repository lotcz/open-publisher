import {useUserSession} from "../../util/UserSession";
import {Link} from "react-router";
import {useNavigator} from "../../navigator/OpAppNavigator";
import {useRestClient} from "../../client/OpRestClient";

export default function GuestDashboard() {
	const userSession = useUserSession();
	const restClient = useRestClient();
	const navigator = useNavigator();

	return (
		<div>
			<p>
				Vítejte v partnerské publikaci článků. Systém umožňuje vkládat a upravovat články.
			</p>
			<p>
				Vaše články naleznete <Link to={navigator.articles.path.list()}>zde</Link>.
			</p>
			<p>
				Jste přihlášeni jako uživatel <strong>{userSession.user.email}</strong>.
				Odhlásit se můžete <Link to="" onClick={() => restClient.logOut()}>zde</Link>.
			</p>
		</div>
	);
}
