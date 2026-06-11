import {NavLink} from "react-router";
import {useNavigator} from "../navigator/OpAppNavigator";
import {useUserSession} from "../util/UserSession";

function MainMenu() {
	const navigator = useNavigator();
	const userSession = useUserSession();

	return (
		<div className="main-menu ps-3">
			<h4 className="mt-2">
				Publikace
			</h4>
			<div className="ps-3">
				<div className="text-nowrap">
					<NavLink to={navigator.path()}>
						Domů
					</NavLink>
				</div>
				<div className="text-nowrap">
					<NavLink to={navigator.articles.path.list()}>
						Články
					</NavLink>
				</div>
			</div>
			{
				(userSession.user.userRole === 'Admin' || userSession.user.userRole === 'Superuser') && <>
					<h4 className="mt-2">Administrace</h4>
					<div className="ps-3">
						<div className="text-nowrap">
							<NavLink to={navigator.admin.destinations.path.list()}>Připojené weby</NavLink>
						</div>
						<div>
							<NavLink to={navigator.admin.users.path.list()}>Uživatelé</NavLink>
						</div>
					</div>
				</>
			}
		</div>
	);
}

export default MainMenu;
