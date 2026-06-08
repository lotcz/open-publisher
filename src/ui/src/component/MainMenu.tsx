import {useCallback, useContext} from "react";
import {NavLink} from "react-router";
import {Localize} from "zavadil-react-common";
import {useNavigator} from "../navigator/OpAppNavigator";
import {useRestClient} from "../client/OpRestClient";
import {UserAlertsContext} from "../util/UserAlerts";
import {useUserSession} from "../util/UserSession";

function MainMenu() {
	const navigator = useNavigator();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const userSession = useUserSession();

	const logOut = useCallback(() => {
		restClient.logout().then(() => {
			userAlerts.info("Logged out");
			navigator.go();
		});
	}, [navigator, restClient, userAlerts]);

	return (
		<div className="main-menu p-3">
			<h4 className="mt-2">
				Publikace
			</h4>
			<div className="ps-3">
				<div className="text-nowrap">
					<NavLink to={navigator.articles.path.list()}>
						Články
					</NavLink>
				</div>
			</div>
			{
				(userSession.user.userRole === 'Admin') && <>
					<h4 className="mt-2">Administrace</h4>
					<div className="ps-3">
						<div>
							<NavLink to={navigator.admin.destinations.path.list()}>Připojené weby</NavLink>
						</div>
						<div>
							<NavLink to={navigator.admin.users.path.list()}>Uživatelé</NavLink>
						</div>
						<div className="text-nowrap">
							<NavLink to={navigator.admin.path()}>
								<Localize text="System State"/>
							</NavLink>
						</div>
					</div>
				</>
			}

			<div>
				<a
					href="/odhlasit"
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						logOut();
					}}
				>
					<Localize text="Log out"/>
				</a>
			</div>
		</div>
	);
}

export default MainMenu;
