import {useUserSession} from "../../util/UserSession";
import GuestDashboard from "./GuestDashboard";
import EditorDashboard from "./EditorDashboard";

export default function Dashboard() {
	const userSession = useUserSession();

	return (
		<div>
			<h1>Centrální publikace článků</h1>
			<hr/>
			{
				userSession.user.userRole === 'Guest' ? <GuestDashboard/> : <EditorDashboard/>
			}
		</div>
	);
}
