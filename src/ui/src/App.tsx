import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import LocalizationFileCzech from "./lang/dictionary.cs.json";
import {
	ConfirmDialog,
	ConfirmDialogContext,
	ConfirmDialogContextData,
	ConfirmDialogProps,
	LocalizationContext,
	Spread,
	UserAlertsWidget
} from "zavadil-react-common";
import {OpRestClient, OpRestClientContext} from "./client/OpRestClient";
import {UserAlertsContext} from "./util/UserAlerts";
import OpAppNavigator, {OpAppNavigatorContext} from "./navigator/OpAppNavigator";
import {UserSession, UserSessionContext, UserSessionUpdateContext} from "./util/UserSession";
import WaitingDialog, {WaitingDialogProps} from "./component/general/WaitingDialog";
import {UploadImageModal, UploadImageModalProps} from "./component/images/UploadImageModal";
import {WaitingDialogContext, WaitingDialogContextContent} from "./util/WaitingDialogContext";
import {UploadImageDialogContext, UploadImageDialogContextContent} from "./util/UploadImageDialogContext";
import Main from "./component/Main";
import Header from "./component/Header";
import Footer from "./component/Footer";
import {Spinner} from "react-bootstrap";
import {User} from "./types/User";
import {BasicLocalization, MemoryDictionary} from "zavadil-ts-common";
import ChangePasswordDialog, {ChangePasswordDialogProps} from "./component/general/ChangePasswordDialog";
import {ChangePasswordDialogContext, ChangePasswordDialogContextContent} from "./util/ChangePasswordDialogContext";
import {LoginPage} from "./component/LoginPage";

export default function App() {
	const userAlerts = useContext(UserAlertsContext);
	const navigate = useNavigate();
	const appNavigator = useMemo(() => new OpAppNavigator(navigate), [navigate]);
	const [loggedIn, setLoggedIn] = useState<boolean>();
	const [sessionInitialized, setSessionInitialized] = useState<boolean>();
	const [message, setMessage] = useState<string>();
	const restClient = useMemo(() => new OpRestClient(() => setSessionInitialized(false)), []);
	const [session, setSession] = useState<UserSession | null>(null);
	const [showAlerts, setShowAlerts] = useState<boolean>();
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
	const [waitingDialog, setWaitingDialog] = useState<WaitingDialogProps>();
	const [uploadImageDialog, setUploadImageDialog] = useState<UploadImageModalProps>();
	const [changePasswordDialog, setChangePasswordDialog] = useState<ChangePasswordDialogProps>();

	const localization = useMemo(
		() => {
			// czech localization
			const local = new BasicLocalization('cs');
			local.addDictionary('cs', new MemoryDictionary(LocalizationFileCzech));
			return local;
		},
		[]
	);

	const saveSession = useCallback(
		(s: UserSession) => {
			document.documentElement.dataset.bsTheme = s.theme;
			localStorage.setItem("op-session", JSON.stringify(s));
			setSession({...s});
		},
		[],
	);

	useEffect(() => {
		if (loggedIn && !sessionInitialized) {
			restClient.users.profile().then(
				(u: User) => {
					let newSession: UserSession = new UserSession(u);
					const json = localStorage.getItem("op-session");
					if (json) {
						const session = JSON.parse(json);
						newSession.theme = session.theme;
					}
					saveSession(newSession);
					setSessionInitialized(true);
				}
			).catch(
				(e) => {
					userAlerts.err(e);
					setLoggedIn(false);
				}
			);
		} else if (!loggedIn) {
			setSessionInitialized(false);
		}
	}, [loggedIn, sessionInitialized]);

	const confirmDialogContext = useMemo<ConfirmDialogContextData>(() => new ConfirmDialogContextData(setConfirmDialog), []);

	const waitingDialogContext = useMemo<WaitingDialogContextContent>(() => {
		return {
			show: (text, onCancel) => {
				setWaitingDialog({text: text, onCancel: onCancel, onClose: () => (onCancel ? onCancel() : null)});
			},
			progress: (progress?: number, max?: number) => {
				if (!waitingDialog) return;
				waitingDialog.progress = progress;
				waitingDialog.max = max;
				setWaitingDialog({...waitingDialog});
			},
			hide: () => {
				setWaitingDialog(undefined);
			},
		};
	}, [waitingDialog]);

	const uploadImageDialogContext = useMemo<UploadImageDialogContextContent>(() => {
		return {
			show: (props: UploadImageModalProps) => setUploadImageDialog(props),
			hide: () => setUploadImageDialog(undefined),
		};
	}, []);

	const changePasswordDialogContext = useMemo<ChangePasswordDialogContextContent>(() => {
		return {
			show: (props: ChangePasswordDialogProps) => setChangePasswordDialog(props),
			hide: () => setChangePasswordDialog(undefined),
		}
	}, []);

	const restInitialize = useCallback(() => {
		setSessionInitialized(undefined);
		setMessage('Inicializace...');
		restClient
			.initialize()
			.then(() => setLoggedIn(true))
			.catch((e) => {
				if (e) userAlerts.err(`Rest initialization failed: ${e}`);
				setLoggedIn(false);
			});
	}, [restClient, userAlerts]);

	const alertsChanged = useCallback(() => {
		setShowAlerts(userAlerts.alerts.length > 0);
	}, [userAlerts]);

	useEffect(() => {
		userAlerts.addOnChangeHandler(alertsChanged);

		// rest client
		restInitialize();

		return () => {
			userAlerts.removeOnChangeHandler(alertsChanged);
		};
	}, []);

	return (
		<OpRestClientContext.Provider value={restClient}>
			<OpAppNavigatorContext.Provider value={appNavigator}>
				<UserSessionContext.Provider value={session}>
					<UserSessionUpdateContext.Provider value={saveSession}>
						<UploadImageDialogContext.Provider value={uploadImageDialogContext}>
							<WaitingDialogContext.Provider value={waitingDialogContext}>
								<ConfirmDialogContext.Provider value={confirmDialogContext}>
									<ChangePasswordDialogContext.Provider value={changePasswordDialogContext}>
										<LocalizationContext.Provider value={localization}>
											<div className="min-h-100 d-flex flex-column align-items-stretch">
												{sessionInitialized === undefined && (
													<Spread>
														<div className="d-flex flex-column align-items-center">
															<div>
																<Spinner/>
															</div>
															<div>
																{message}
															</div>
														</div>
													</Spread>
												)}
												{sessionInitialized === false && <LoginPage
													onConfirmed={
														(login, password) => {
															setSessionInitialized(undefined);
															setMessage('Probíhá přihlašování...');
															restClient.logIn(login, password)
																.then((at) => setLoggedIn(true))
																.catch((e) => {
																	let message = 'Přihlášení selhalo';
																	if (e instanceof Error) {
																		message += `: ${e.message}`;
																	} else if (typeof e === 'string') {
																		message += `: ${e}`;
																	}
																	userAlerts.err(message);
																	setLoggedIn(false);
																});
														}
													}
												/>
												}
												{sessionInitialized === true && (
													<>
														<Header/>
														<Main/>
														<Footer/>
													</>
												)}
												{confirmDialog && <ConfirmDialog {...confirmDialog} />}
												{waitingDialog && <WaitingDialog {...waitingDialog} />}
												{uploadImageDialog && <UploadImageModal {...uploadImageDialog} />}
												{changePasswordDialog && <ChangePasswordDialog {...changePasswordDialog} />}
												{showAlerts && <UserAlertsWidget userAlerts={userAlerts}/>}
											</div>
										</LocalizationContext.Provider>
									</ChangePasswordDialogContext.Provider>
								</ConfirmDialogContext.Provider>
							</WaitingDialogContext.Provider>
						</UploadImageDialogContext.Provider>
					</UserSessionUpdateContext.Provider>
				</UserSessionContext.Provider>
			</OpAppNavigatorContext.Provider>
		</OpRestClientContext.Provider>
	);
}
