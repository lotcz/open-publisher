import {Button, Form, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {EmailUtil, NumberUtil, ObjectUtil, StringUtil} from "zavadil-ts-common";
import {ConfirmDialogContext, DateTimeInput, DeleteButton, FormRow, FormRowControl, IconButton, SaveButton, Switch} from "zavadil-react-common";
import {useNavigator} from "../../../navigator/OpAppNavigator";
import {useRestClient} from "../../../client/OpRestClient";
import {UserAlertsContext} from "../../../util/UserAlerts";
import {User} from "../../../types/User";
import BackIconLink from "../../general/BackIconLink";
import RefreshIconButton from "../../general/RefreshIconButton";
import UserRoleSelect from "./UserRoleSelect";
import {ChangePasswordDialogContext} from "../../../util/ChangePasswordDialogContext";
import {WaitingDialogContext} from "../../../util/WaitingDialogContext";
import UserArticlesList from "./UserArticlesList";
import UserArticleHistory from "./UserArticleHistory";
import {BsEnvelopeAt} from "react-icons/bs";
import {GrantGuestAccessDialogContext} from "../../../util/GrantGuestAccessDialogContext";

const TAB_PARAM_NAME = "zalozka";
const DEFAULT_TAB = "clanky";

export default function UserDetail() {
	const {id} = useParams();
	const navigator = useNavigator();
	const restClient = useRestClient();
	const [searchParams, setSearchParams] = useSearchParams();
	const [activeTab, setActiveTab] = useState<string>();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const changePasswordDialog = useContext(ChangePasswordDialogContext);
	const grantGuestAccessDialog = useContext(GrantGuestAccessDialogContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const [data, setData] = useState<User>();
	const [valid, setValid] = useState<boolean>(false);
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	useEffect(() => {
		if (!activeTab) return;
		searchParams.set(TAB_PARAM_NAME, activeTab);
		setSearchParams(searchParams, {replace: true});
	}, [activeTab]);

	useEffect(() => {
		setActiveTab(StringUtil.getNonEmpty(searchParams.get(TAB_PARAM_NAME), DEFAULT_TAB));
	}, [id]);

	useEffect(() => {
		setValid(ObjectUtil.notEmpty(data) && StringUtil.notBlank(data.name) && EmailUtil.isValidEmail(data.email));
	}, [data]);

	const onChanged = useCallback(() => {
		if (!data) return;
		setData({...data});
		setChanged(true);
	}, [data]);

	const reload = useCallback(() => {
		if (!id) {
			setData({
				name: "",
				email: "",
				userRole: "Guest",
				isActive: true,
				failedLoginAttempts: 0
			});
			return;
		}
		setData(undefined);
		restClient
			.users
			.loadSingle(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, restClient, userAlerts]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		if (!valid) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient
			.users
			.save(data)
			.then((f) => {
				if (inserting) {
					navigator.admin.users.detail(f.id, true);
				} else {
					setData(f);
				}
				setChanged(false);
			})
			.catch((e: Error) => userAlerts.err(e))
			.finally(() => setSaving(false));
	}, [restClient, data, valid, userAlerts, navigator]);

	const deleteAccount = useCallback(() => {
		if (!data?.id) return;
		confirmDialog.confirm(
			"Smazat uživatele",
			"Opravdu si přejete smazat tohoto uživatele? Pokud je uživatel autorem článků, nepůjde smazat a je lepší jej pouze deaktivovat.",
			() => {
				setDeleting(true);
				restClient
					.users
					.delete(Number(data.id))
					.then((f) => {
						navigator.admin.users.list();
					})
					.catch((e: Error) => userAlerts.err(e))
					.finally(() => setDeleting(false));
			}
		);
	}, [restClient, data, userAlerts, navigator, confirmDialog]);

	const changePassword = useCallback(() => {
		if (!data?.id) return;
		changePasswordDialog.show(
			{
				name: "Změna hesla",
				text: `Vložte nové heslo pro uživatele ${data.email}.`,
				onClose: () => changePasswordDialog.hide(),
				onConfirm: (password) => {
					changePasswordDialog.hide();
					waitingDialog.show("Probíhá změna hesla");
					restClient.users
						.changePassword(Number(data.id), password)
						.then(() => {
							waitingDialog.hide();
							userAlerts.info('Heslo bylo změneno');
						})
				}
			},
		);
	}, [restClient, data, userAlerts, changePasswordDialog, waitingDialog]);

	if (!data) {
		return <Spinner/>;
	}

	return (
		<Stack gap={2}>
			<Stack direction="horizontal" gap={2}>
				<BackIconLink changed={changed}/>
				<RefreshIconButton onClick={reload}/>
				<SaveButton loading={saving} disabled={!changed || !valid} onClick={saveData}>
					Uložit
				</SaveButton>
				{
					data.id && <>
						<DeleteButton loading={deleting} onClick={deleteAccount}>
							Smazat
						</DeleteButton>
						<Button onClick={changePassword}>
							Změnit heslo...
						</Button>
						<IconButton
							icon={<BsEnvelopeAt/>}
							disabled={StringUtil.isBlank(data.email) || (!data.id) || changed}
							variant="warning"
							onClick={
								() => {
									grantGuestAccessDialog.show(
										{
											name: 'Odeslat pozvánku',
											text: `Opravdu si přejete odeslat odkaz pro přihlášení do systému uživateli ${data.email}?`,
											user: data,
											onClose: () => grantGuestAccessDialog.hide(),
											onConfirm: (url: string) => {
												grantGuestAccessDialog.hide();
												reload();
											}
										}
									);
								}
							}
						>Odeslat pozvánku</IconButton>
					</>
				}
			</Stack>

			<Form>
				<Stack direction="vertical" gap={2}>
					<div>
						<FormRowControl
							label="Jméno"
							type="name"
							minLength={1}
							maxLength={255}
							value={data.name}
							onChange={(e) => {
								data.name = e.target.value;
								onChanged();
							}}
						/>
						{
							StringUtil.isBlank(data.name) && <small className="error">Vyplňte jméno uživatele</small>
						}
					</div>

					<div>
						<FormRowControl
							label="Email"
							type="email"
							minLength={1}
							maxLength={255}
							value={data.email}
							onChange={(e) => {
								data.email = e.target.value;
								onChanged();
							}}
						/>
						{
							!EmailUtil.isValidEmail(data.email) && <small className="error">Vyplňte platný email</small>
						}
					</div>

					<FormRow label="Uživatelská role">
						<Stack direction="horizontal" gap={3} className="justify-content-start align-items-center">
							<div>
								<UserRoleSelect
									state={data.userRole}
									onChange={(e) => {
										data.userRole = e;
										onChanged();
									}}
								/>
							</div>
							<Switch
								label="Uživatel aktivní"
								checked={data.isActive}
								onChange={(e) => {
									data.isActive = e;
									onChanged();
								}}
							/>
						</Stack>
					</FormRow>

					<div className="d-flex">
						<FormRow label="Poslední přihlášení">
							<DateTimeInput
								value={data.lastSuccessfulLogin}
								onChange={(e) => {
									data.lastSuccessfulLogin = e;
									onChanged();
								}}
							/>
						</FormRow>
					</div>

					<div className="d-flex">
						<FormRow label="Poslední zaslání odkazu">
							<DateTimeInput
								value={data.lastLinkSent}
								onChange={(e) => {
									data.lastLinkSent = e;
									onChanged();
								}}
							/>
						</FormRow>
					</div>

					<div className="d-flex gap-3">
						<FormRowControl
							label="Neplatné pokusy o přihlášení"
							type="number"
							min={0}
							max={100}
							value={data.failedLoginAttempts}
							onChange={(e) => {
								data.failedLoginAttempts = Number(e.target.value);
								onChanged();
							}}
						/>
						<FormRow label="Poslední neplatný pokus o přihlášení">
							<DateTimeInput
								value={data.lastFailedLogin}
								onChange={(e) => {
									data.lastFailedLogin = e;
									onChanged();
								}}
							/>
						</FormRow>
					</div>
				</Stack>
			</Form>
			{
				data.id && (
					<div>
						<Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}>
							<Tab title="Články" eventKey="clanky"/>
							<Tab title="Historie" eventKey="historie"/>
						</Tabs>
						<div className="px-3 py-1">
							{activeTab === "clanky" && <UserArticlesList userId={data.id}/>}
							{activeTab === "historie" && <UserArticleHistory userId={data.id}/>}
						</div>
					</div>
				)
			}
		</Stack>
	);
}
