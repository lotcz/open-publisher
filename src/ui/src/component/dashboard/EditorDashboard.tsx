import {useUserSession} from "../../util/UserSession";
import {useRestClient} from "../../client/OpRestClient";
import {Link} from "react-router";
import {Destination} from "../../types/Destination";
import {useCallback, useContext, useEffect, useState} from "react";
import {UserAlertsContext} from "../../util/UserAlerts";
import {Spinner, Stack} from "react-bootstrap";
import {IconButton} from "zavadil-react-common";
import {BsEnvelopeAt, BsPlus} from "react-icons/bs";
import {useNavigator} from "../../navigator/OpAppNavigator";
import {GrantGuestAccessDialogContext} from "../../util/GrantGuestAccessDialogContext";

export default function EditorDashboard() {
	const userSession = useUserSession();
	const restClient = useRestClient();
	const navigator = useNavigator();
	const userAlerts = useContext(UserAlertsContext);
	const grantGuestAccessDialog = useContext(GrantGuestAccessDialogContext);
	const [activeDestinations, setActiveDestinations] = useState<Array<Destination>>();

	useEffect(() => {
		restClient.destinations.loadActive()
			.then(setActiveDestinations)
			.catch((e) => userAlerts.err(e));
	}, []);

	const inviteGuest = useCallback(
		(destinationId: number) => {
			grantGuestAccessDialog.show(
				{
					destinationId: destinationId,
					onClose: () => grantGuestAccessDialog.hide(),
					onConfirm: () => {
						grantGuestAccessDialog.hide();
						userAlerts.info("Pozvánka byla vytvořena");
					}
				}
			)
		},
		[grantGuestAccessDialog, userAlerts]
	)

	return (
		<div>
			<p>
				Systém umožňuje vkládat články, které budou publikované na různých webech.
				Můžete též pozvat k tvorbě článků externího partnera.
			</p>

			{
				activeDestinations ? <Stack gap={3} className="mb-3">
						{
							activeDestinations.map(
								(destination) => <div>
									<h4>{destination.name}</h4>
									<Stack key={destination.id} gap={2}>
										<div>
											<IconButton
												icon={<BsEnvelopeAt/>}
												variant="warning"
												onClick={() => inviteGuest(Number(destination.id))}
											>
												Získat odkaz pro nahrání obsahu na {destination.name}
											</IconButton>
										</div>
										<div>
											<IconButton
												icon={<BsPlus/>}
												variant="success"
												onClick={() => navigator.articles.add(Number(destination.id))}
											>
												Přidat článkek na {destination.name}
											</IconButton>
										</div>
									</Stack>
								</div>
							)
						}
					</Stack>
					: <Spinner/>
			}
			<p>
				Jste přihlášeni jako uživatel <strong>{userSession.user.email}</strong>,
				vaše role je <strong>{userSession.user.userRole}</strong>.
				Odhlásit se můžete <Link to="" onClick={() => restClient.logOut()}>zde</Link>.
			</p>
		</div>
	);
}
