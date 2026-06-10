import {Button, Form, Spinner, Stack} from "react-bootstrap";
import {useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {ConfirmDialogContext, DateTimeInput, DeleteButton, FormRow, FormRowControl, IconButton, SaveButton} from "zavadil-react-common";
import {useNavigator} from "../../navigator/OpAppNavigator";
import {useRestClient} from "../../client/OpRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {ArticleStub} from "../../types/Article";
import BackIconLink from "../general/BackIconLink";
import RefreshIconButton from "../general/RefreshIconButton";
import TinyMceInput from "../general/TinyMceInput";
import {useUserSession} from "../../util/UserSession";
import ArticleStateBadge from "./ArticleStateBadge";
import {ArticleImage} from "../images/ArticleImage";
import {ImageUploadButton} from "../images/ImageUploadButton";

const TAB_PARAM_NAME = "tab";
const DEFAULT_TAB = "images";

export default function ArticleDetail() {
	const {id} = useParams();
	const navigator = useNavigator();
	const session = useUserSession();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<ArticleStub>();
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

					<FormRow label="Stav publikace">
						<Stack direction="horizontal" gap={2}>
							<ArticleStateBadge state={data.articleState}/>
							{
								data.articleState === 'Draft' && <>
									<div>Článek není zatím publikován.</div>
									<Button
										variant="success"
										size="sm"
										onClick={() => {
											data.articleState = 'Published';
											onChanged();
										}}>Publikovat</Button>
								</>
							}
							{
								data.articleState === 'Published' && <>
									<div>Článek je publikován.</div>
									<Button
										variant="secondary"
										size="sm"
										onClick={() => {
											data.articleState = 'Hidden';
											onChanged();
										}}>Skrýt</Button>
								</>
							}
							{
								data.articleState === 'Hidden' && <>
									<div>Článek je skrytý.</div>
									<Button
										variant="success"
										size="sm"
										onClick={() => {
											data.articleState = 'Published';
											onChanged();
										}}>Publikovat</Button>
								</>
							}
						</Stack>
					</FormRow>

					<FormRow label="Odložená publikace">
						<div className="float-start">
							<Stack direction="horizontal" gap={2}>
								<DateTimeInput
									value={data.publishDate}
									onChange={(d) => {
										data.publishDate = d || null;
										onChanged();
									}}
								/>
								{
									data.publishDate && <IconButton
										variant="warning"
										onClick={() => {
											data.publishDate = null;
											onChanged();
										}}
									>Vynulovat</IconButton>
								}
							</Stack>
						</div>
					</FormRow>

					<FormRow label="Hlavní obrázek">
						<div className="float-start">
							<Stack gap={2}>
								{
									data.imageName && <ArticleImage size="thumb" name={data.imageName}/>
								}
								<Stack direction="horizontal" gap={2}>
									<ImageUploadButton
										label="Nahrát..."
										onSelected={(d) => {
											data.imageName = d || null;
											onChanged();
										}}
									/>
									{
										data.imageName && <IconButton
											size="sm"
											variant="warning"
											onClick={() => {
												data.imageName = null;
												onChanged();
											}}
										>Odstranit obrázek</IconButton>
									}
								</Stack>
							</Stack>
						</div>
					</FormRow>

					<FormRow label="Text článku">
						<div style={{maxWidth: 900}}>
							<TinyMceInput
								initialValue={StringUtil.getNonEmpty(data.contentHtml)}
								onChange={(e) => {
									data.contentHtml = e;
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
