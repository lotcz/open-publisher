import {Button, Form, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {ConfirmDialogContext, DeleteButton, FormRowControl, SaveButton} from "zavadil-react-common";
import {useNavigator} from "../../navigator/OpAppNavigator";
import {useRestClient} from "../../client/OpRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {ArticleStub} from "../../types/Article";
import BackIconLink from "../general/BackIconLink";
import RefreshIconButton from "../general/RefreshIconButton";
import {useUserSession} from "../../util/UserSession";
import {WaitingDialogContext} from "../../util/WaitingDialogContext";
import {GrantGuestAccessDialogContext} from "../../util/GrantGuestAccessDialogContext";
import ArticleDetailContentTab from "./ArticleDetailContentTab";
import ArticleDetailPublishingTab from "./ArticleDetailPublishingTab";

const TAB_PARAM_NAME = "tab";
const DEFAULT_TAB = "obsah";

export default function ArticleDetail() {
	const {id} = useParams();
	const navigator = useNavigator();
	const session = useUserSession();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const waitingDialog = useContext(WaitingDialogContext);
	const grantGuestAccessDialog = useContext(GrantGuestAccessDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<ArticleStub>();
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [importing, setImporting] = useState<boolean>(false);

	useEffect(() => {
		if (!activeTab) return;
		searchParams.set(TAB_PARAM_NAME, activeTab);
		setSearchParams(searchParams, {replace: true});
	}, [activeTab]);

	useEffect(() => {
		setActiveTab(StringUtil.getNonEmpty(searchParams.get(TAB_PARAM_NAME), DEFAULT_TAB));
	}, [id]);

	const onChanged = useCallback(() => {
		if (!data) return;
		setData({...data});
		setChanged(true);
	}, [data]);

	const reload = useCallback(() => {
		if (!id) {
			setData({
				header: "",
				articleState: "Draft",
				contentHtml: '',
				previewText: '',
				publishDate: null,
				ownerId: Number(session.user.id)
			});
			return;
		}
		setData(undefined);
		restClient.articles
			.loadSingleStub(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, restClient, userAlerts, session]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient
			.articles
			.saveStub(data)
			.then((f) => {
				if (inserting) {
					navigator.articles.detail(f.id, true);
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
		confirmDialog.confirm("Smazat článek?", "Opravdu si přejete smazat tento článek? Smazané články zůstanou publikované na připojených webech, pokud již proběhla synchronizace, proto bývá výhodnější pouze vynulovat datum publikace.", () => {
			setDeleting(true);
			restClient
				.articles
				.delete(Number(data.id))
				.then((f) => {
					navigator.articles.list();
				})
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setDeleting(false));
		});
	}, [restClient, data, userAlerts, navigator, confirmDialog]);

	if (!data) {
		return <Spinner/>;
	}

	return (
		<div>
			<div className="p-2">
				<Stack direction="horizontal" gap={2}>
					<BackIconLink changed={changed}/>
					<RefreshIconButton onClick={reload}/>
					<SaveButton loading={saving} disabled={StringUtil.isBlank(data.header) || !changed} onClick={saveData}>
						Uložit
					</SaveButton>
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteAccount}>
						Smazat
					</DeleteButton>
					{
						session.user.userRole !== 'Guest' && <Button
							disabled={changed || !data.id}
							onClick={
								() => {
									if (!data.id) return;
									grantGuestAccessDialog.show(
										{
											articleId: data.id,
											onClose: () => grantGuestAccessDialog.hide(),
											onConfirm: (url: string) => {
												grantGuestAccessDialog.hide();
												reload();
											}
										}
									)
								}
							}
						>Udělit přístup</Button>
					}
				</Stack>
			</div>

			<Form className="px-3">
				<Stack direction="vertical" gap={2}>
					<div style={{maxWidth: 900}}>
						<FormRowControl
							label="Nadpis"
							type="text"
							value={data.header}
							onChange={(e) => {
								data.header = e.target.value;
								onChanged();
							}}
						/>
					</div>

					<div>
						<Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}>
							<Tab title="Obsah" eventKey="obsah"/>
							<Tab title="Publikace" eventKey="publikace"/>
						</Tabs>
						<div className="px-3 py-1">
							{activeTab === "obsah" && <ArticleDetailContentTab article={data} onChanged={onChanged}/>}
							{activeTab === "publikace" && <ArticleDetailPublishingTab article={data} onChanged={onChanged}/>}
						</div>
					</div>
				</Stack>
			</Form>
		</div>
	);
}
