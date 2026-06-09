import {Form, Spinner, Stack} from "react-bootstrap";
import {useParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {ConfirmDialogContext, DeleteButton, FormRow, FormRowControl, IconButton, SaveButton, Switch} from "zavadil-react-common";
import {useNavigator} from "../../../navigator/OpAppNavigator";
import {useRestClient} from "../../../client/OpRestClient";
import {UserAlertsContext} from "../../../util/UserAlerts";
import {User} from "../../../types/User";
import BackIconLink from "../../general/BackIconLink";
import RefreshIconButton from "../../general/RefreshIconButton";
import SyncStateSelect from "./SyncStateSelect";
import UserRoleSelect from "./UserRoleSelect";
import {ChangePasswordDialogContext} from "../../../util/ChangePasswordDialogContext";
import {WaitingDialogContext} from "../../../util/WaitingDialogContext";
import {BiShekel} from "react-icons/bi";

export default function UserDetail() {
	const {id} = useParams();
	const navigator = useNavigator();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const changePasswordDialog = useContext(ChangePasswordDialogContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const [data, setData] = useState<User>();
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	const onChanged = useCallback(() => {
		if (!data) return;
		setData({...data});
		setChanged(true);
	}, [data]);

	const reload = useCallback(() => {
		if (!id) {
			setData({
				email: "",
				syncState: "Pending",
				userRole: "Guest",
				isActive: true
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
	}, [restClient, data, userAlerts, navigator]);

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
		<div>
			<div className="p-2">
				<Stack direction="horizontal" gap={2}>
					<BackIconLink changed={changed}/>
					<RefreshIconButton onClick={reload}/>
					<SaveButton loading={saving} disabled={!changed} onClick={saveData}>
						Save
					</SaveButton>
					{
						data.id && <>
							<DeleteButton loading={deleting} onClick={deleteAccount}>
								Delete
							</DeleteButton>
							<IconButton onClick={changePassword} icon={<BiShekel/>}>
								Změnit heslo
							</IconButton>
						</>
					}

				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<FormRowControl
						label="Email"
						type="email"
						maxLength={255}
						value={data.email}
						onChange={(e) => {
							data.email = e.target.value;
							onChanged();
						}}
					/>

					<FormRow label="Uživatelská role">
						<div className="float-start">
							<UserRoleSelect
								state={data.userRole}
								onChange={(e) => {
									data.userRole = e;
									onChanged();
								}}
							/>
						</div>
					</FormRow>

					<Switch
						label="Aktivní"
						checked={data.isActive}
						onChange={(e) => {
							data.isActive = e;
							onChanged();
						}}
					/>

					<FormRowControl
						label="OAuth subject"
						type="text"
						disabled={true}
						value={StringUtil.getNonEmpty(data.oauthSubject)}
						onChange={(e) => {
							data.oauthSubject = e.target.value;
							onChanged();
						}}
					/>

					<FormRow label="OAuth synchronizace">
						<div className="float-start">
							<SyncStateSelect
								state={data.syncState}
								onChange={(e) => {
									data.syncState = e;
									onChanged();
								}}
							/>
						</div>
					</FormRow>
				</Stack>
			</Form>
		</div>
	);
}
