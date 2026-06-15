import {Form, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {NumberUtil, ObjectUtil, StringUtil} from "zavadil-ts-common";
import {ConfirmDialogContext, DeleteButton, FormRow, IconButton, SaveButton} from "zavadil-react-common";
import {useNavigator} from "../../navigator/OpAppNavigator";
import {useRestClient} from "../../client/OpRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {ArticleStub} from "../../types/Article";
import BackIconLink from "../general/BackIconLink";
import RefreshIconButton from "../general/RefreshIconButton";
import {useUserSession} from "../../util/UserSession";
import {GrantGuestAccessDialogContext} from "../../util/GrantGuestAccessDialogContext";
import ArticleDetailContentTab from "./ArticleDetailContentTab";
import ArticleDetailPublishingTab from "./ArticleDetailPublishingTab";
import ArticleStateBadge from "./ArticleStateBadge";
import {BsCheck, BsEnvelopeAt, BsEyeSlash, BsFileArrowDown} from "react-icons/bs";
import ArticleHistoryTab from "./ArticleHistoryTab";

const TAB_PARAM_NAME = "tab";
const DEFAULT_TAB = "obsah";

export default function ArticleDetail() {
	const {id, destinationId} = useParams();
	const navigator = useNavigator();
	const session = useUserSession();
	const canApproveArticles = useMemo<boolean>(() => session.user.userRole === 'Admin' || session.user.userRole === 'Superuser', [session]);
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const grantGuestAccessDialog = useContext(GrantGuestAccessDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<ArticleStub>();
	const [updatedCategories, setUpdatedCategories] = useState<Array<number>>();
	const [valid, setValid] = useState<boolean>(false);
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	const isReadOnly = useMemo<boolean>(() => !data || data.articleState === 'Approved', [data]);

	useEffect(() => {
		if (!activeTab) return;
		searchParams.set(TAB_PARAM_NAME, activeTab);
		setSearchParams(searchParams, {replace: true});
	}, [activeTab]);

	useEffect(() => {
		setActiveTab(StringUtil.getNonEmpty(searchParams.get(TAB_PARAM_NAME), DEFAULT_TAB));
	}, [id]);

	useEffect(() => {
		setValid(ObjectUtil.notEmpty(data) && StringUtil.notBlank(data.header) && NumberUtil.notEmpty(data.destinationId));
	}, [data]);

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
				ownerId: Number(session.user.id),
				destinationId: StringUtil.notBlank(destinationId) ? Number(destinationId) : null
			});
			return;
		}
		setData(undefined);
		restClient.articles
			.loadSingleStub(Number(id))
			.then((d) => {
				setData(d);
				setChanged(false);
			})
			.catch((e: Error) => userAlerts.err(e));
	}, [id, restClient, userAlerts, session, destinationId]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		if (!valid) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient
			.articles
			.saveStub(data)
			.then((f) => {
				if (updatedCategories) {
					return restClient.articles
						.updateArticleCategories(Number(f.id), updatedCategories)
						.then(() => f);
				}
				return f;
			})
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
	}, [restClient, data, userAlerts, navigator, valid, updatedCategories]);

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
		<Stack gap={2}>
			<Stack direction="horizontal" gap={2}>
				<BackIconLink changed={changed}/>
				<RefreshIconButton onClick={reload}/>
				<SaveButton loading={saving} disabled={!valid || !changed} onClick={saveData}>
					Uložit
				</SaveButton>
				{
					(data.articleState === 'Draft' && !canApproveArticles) && <>
						<IconButton
							icon={<BsCheck/>}
							variant="success"
							disabled={!valid}
							onClick={() => {
								confirmDialog.confirm(
									'Odeslat ke schválení?',
									'Opravdu si přejete odeslat článek ke schválení?',
									() => {
										data.articleState = 'Ready';
										saveData();
									}
								);
							}}>Odeslat ke schválení</IconButton>
					</>
				}
				{
					(canApproveArticles && data.articleState !== 'Hidden') && <>
						<IconButton
							icon={<BsEyeSlash/>}
							variant="secondary"
							disabled={!valid}
							onClick={() => {
								confirmDialog.confirm(
									'Skrýt článek?',
									'Opravdu si přejete skrýt článek? Článek bude odebrán z webu, pokud již byl publikován.',
									() => {
										data.articleState = 'Hidden';
										saveData();
									}
								);
							}}>Skrýt</IconButton>
					</>
				}
				{
					(canApproveArticles && (data.articleState === 'Draft' || data.articleState === 'Ready')) && <>
						<IconButton
							icon={<BsCheck/>}
							variant="success"
							disabled={!valid}
							onClick={() => {
								confirmDialog.confirm(
									'Schválit k publikaci?',
									'Opravdu si přejete schválit článek k publikaci?',
									() => {
										data.articleState = 'Approved';
										saveData();
									}
								);
							}}>Schválit a publikovat</IconButton>
					</>
				}
				{
					(canApproveArticles && data.articleState !== 'Draft') && <>
						<IconButton
							icon={<BsFileArrowDown/>}
							variant="primary"
							disabled={!valid}
							onClick={() => {
								confirmDialog.confirm(
									'Zpět do konceptu?',
									'Opravdu si přejete vrátit článek do konceptu? Článek bude odebrán z webu, pokud již byl publikován.',
									() => {
										data.articleState = 'Draft';
										saveData();
									}
								);
							}}>Vrátit do konceptu</IconButton>
					</>
				}
				{
					canApproveArticles && <IconButton
						icon={<BsEnvelopeAt/>}
						variant="warning"
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
					>Odeslat pozvánku</IconButton>
				}
				{
					(session.user.userRole === 'Admin' || session.user.userRole === 'Superuser') &&
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteAccount}>
						Smazat
					</DeleteButton>
				}
			</Stack>

			<Form
				onSubmit={
					(e) => {
						e.preventDefault();
						e.stopPropagation();
						saveData();
					}
				}
			>
				<Stack gap={2}>
					<FormRow label="Stav publikace">
						<Stack direction="horizontal" gap={2}>
							<ArticleStateBadge state={data.articleState}/>
						</Stack>
					</FormRow>
					<div>
						<FormRow label="Nadpis">
							<Form.Control
								size="lg"
								type="text"
								disabled={isReadOnly}
								value={data.header}
								onChange={(e) => {
									data.header = e.target.value;
									onChanged();
								}}
							/>
						</FormRow>
						{
							StringUtil.isBlank(data.header) && <small className="error">Vložte nadpis článku</small>
						}
					</div>
				</Stack>
			</Form>

			<div>
				<Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}>
					<Tab title="Obsah" eventKey="obsah"/>
					{
						session.user.userRole !== 'Guest' &&
						<Tab
							title={
								<div className="position-relative">
									Publikace
									{
										NumberUtil.isEmpty(data.destinationId) && <span
											className="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle">
												<span className="visually-hidden">New alerts</span>
											  </span>
									}
								</div>
							}
							eventKey="publikace"
						/>
					}
					{
						data.id && (session.user.userRole === 'Superuser' || session.user.userRole === 'Admin') &&
						<Tab title="Historie" eventKey="historie"/>
					}
				</Tabs>
				<div className="px-3 py-1">
					{
						activeTab === "obsah" &&
						<ArticleDetailContentTab
							article={data}
							isReadOnly={isReadOnly}
							onChanged={onChanged}
							onCategoriesChanged={
								(cats) => {
									setUpdatedCategories(cats);
									onChanged();
								}
							}
						/>
					}
					{activeTab === "publikace" && <ArticleDetailPublishingTab isReadOnly={isReadOnly} article={data} onChanged={onChanged}/>}
					{data.id && activeTab === "historie" && <ArticleHistoryTab articleId={data.id}/>}
				</div>
			</div>
		</Stack>
	);
}
