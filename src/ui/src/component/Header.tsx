import {Dropdown, Stack} from "react-bootstrap";
import {Link} from "react-router";
import {useUserSession} from "../util/UserSession";
import {Img} from "./images/Img";
import {BsPersonCircle} from "react-icons/bs";
import LightSwitch from "./general/LightSwitch";
import {useRestClient} from "../client/OpRestClient";
import {useContext} from "react";
import {ChangePasswordDialogContext} from "../util/ChangePasswordDialogContext";
import {UserAlertsContext} from "../util/UserAlerts";

export default function Header() {
	const session = useUserSession();
	const restClient = useRestClient();
	const changePassword = useContext(ChangePasswordDialogContext);
	const userAlerts = useContext(UserAlertsContext);

	return (
		<header className={`p-3 bg-body-secondary`}>
			<Stack direction="horizontal" className="justify-content-between">
				<Link to="/" className="brand-logo">
					<Stack direction="horizontal" gap={2}>
						<Img
							url="/android-chrome-192x192.png"
							maxWidth={50}
							maxHeight={50}
						/>
						<div>
							Centrální publikace článků
						</div>
					</Stack>
				</Link>
				<Dropdown>
					<Dropdown.Toggle className="d-flex align-items-center gap-2 p-2 rounded bg-body text-body">
						<BsPersonCircle/>
						<div>{session.user.name}</div>
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Header>Role: <strong>{session.user.userRole}</strong></Dropdown.Header>
						<Dropdown.ItemText><LightSwitch/></Dropdown.ItemText>
						<Dropdown.Item
							onClick={() => {
								changePassword.show(
									{
										name: 'Změna hesla',
										text: 'Zde si můžete změnit vaše heslo.',
										onClose: () => changePassword.hide(),
										onConfirm: (password: string) => {
											restClient.users
												.changeMyPassword(password)
												.then(() => {
													userAlerts.info("Vaše heslo bylo změněno");
													changePassword.hide();
												})
										}
									}
								)
							}}
						>
							Změnit heslo
						</Dropdown.Item>
						<Dropdown.Item onClick={() => restClient.logOut()}>Odhlásit</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Stack>
		</header>
	);
}
