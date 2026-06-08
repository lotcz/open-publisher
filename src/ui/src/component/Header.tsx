import {Stack} from "react-bootstrap";
import {Link} from "react-router";
import {useUserSession} from "../util/UserSession";

export default function Header() {
	const session = useUserSession();

	return (
		<header className={`p-3 bg-body-secondary`}>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<Link to="/admin">
					Centrální publikace článků
				</Link>
				<div className="d-flex gap-2 p-2 rounded bg-body text-body">
					<strong>{session.user.email}</strong>
					({session.user.userRole})
				</div>
			</Stack>
		</header>
	);
}
