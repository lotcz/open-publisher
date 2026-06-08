import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {
	ConfirmDialog,
	ConfirmDialogContext,
	ConfirmDialogContextData,
	ConfirmDialogProps,
	IconButton,
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
import {BsRepeat} from "react-icons/bs";
import {User} from "./types/User";

export default function App() {
	const userAlerts = useContext(UserAlertsContext);
	const restClient = useMemo(() => new OpRestClient(), []);
	const navigate = useNavigate();
	const appNavigator = useMemo(() => new OpAppNavigator(navigate), [navigate]);
	const [initialized, setInitialized] = useState<boolean>();
	const [session, setSession] = useState<UserSession | null>(null);
	const [showAlerts, setShowAlerts] = useState<boolean>();
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
	const [waitingDialog, setWaitingDialog] = useState<WaitingDialogProps>();
	const [uploadImageDialog, setUploadImageDialog] = useState<UploadImageModalProps>();

	const updateSessionValues = useCallback((s: UserSession) => {
		document.documentElement.dataset.bsTheme = s.theme;
	}, []);

	const saveSession = useCallback(
		(s: UserSession) => {
			updateSessionValues(s);
			localStorage.setItem("op-session", JSON.stringify(s));
			setSession({...s});
		},
		[updateSessionValues],
	);

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

	const restInitialize = useCallback(() => {
		setInitialized(undefined);
		try {
			restClient
				.initialize()
				.then(
					() => restClient.profile().then(
						(u: User) => {
							let newSession: UserSession = new UserSession(u);
							const json = localStorage.getItem("op-session");
							if (json) {
								const session = JSON.parse(json);
								newSession.theme = session.theme;
							}
							setSession(newSession);
							updateSessionValues(newSession);
							setInitialized(true);
						}
					)
				)
				.catch((e) => {
					userAlerts.err(`Rest initialization failed: ${e}`);
					setInitialized(false);
				});
		} catch (e: any) {
			userAlerts.err(`Rest initialization failed: ${e}`);
			setInitialized(false);
		}
	}, [restClient, userAlerts, updateSessionValues]);

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
									<div className="min-h-100 d-flex flex-column align-items-stretch">
										{initialized === undefined && (
											<Spread>
												<div className="d-flex flex-column align-items-center">
													<div>
														<Spinner/>
													</div>
													<div>
														Inicializace...
													</div>
												</div>
											</Spread>
										)}
										{initialized === false && (
											<Spread>
												<div className="d-flex flex-column align-items-center">
													<div className="p-3 error">
														Inicializace selhala!
													</div>
													<div>
														<IconButton onClick={restInitialize} icon={<BsRepeat/>}>
															Opakovat
														</IconButton>
													</div>
												</div>
											</Spread>
										)}
										{initialized === true && (
											<>
												<Header/>
												<Main/>
												<Footer/>
											</>
										)}
										{confirmDialog && <ConfirmDialog {...confirmDialog} />}
										{waitingDialog && <WaitingDialog {...waitingDialog} />}
										{uploadImageDialog && <UploadImageModal {...uploadImageDialog} />}
										{showAlerts && <UserAlertsWidget userAlerts={userAlerts}/>}
									</div>
								</ConfirmDialogContext.Provider>
							</WaitingDialogContext.Provider>
						</UploadImageDialogContext.Provider>
					</UserSessionUpdateContext.Provider>
				</UserSessionContext.Provider>
			</OpAppNavigatorContext.Provider>
		</OpRestClientContext.Provider>
	);
}
