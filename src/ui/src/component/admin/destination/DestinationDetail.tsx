import {Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {ConfirmDialogContext, DeleteButton, FormRow, FormRowControl, SaveButton} from "zavadil-react-common";
import DestinationArticlesList from "./DestinationArticlesList";
import {useNavigator} from "../../../navigator/OpAppNavigator";
import {useRestClient} from "../../../client/OpRestClient";
import {UserAlertsContext} from "../../../util/UserAlerts";
import {Destination} from "../../../types/Destination";
import BackIconLink from "../../general/BackIconLink";
import RefreshIconButton from "../../general/RefreshIconButton";
import DestinationPreview from "./DestinationPreview";

const TAB_PARAM_NAME = "tab";
const DEFAULT_TAB = "articles";

export default function DestinationDetail() {
	const {id} = useParams();
	const navigator = useNavigator();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<Destination>();
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
		setChanged(false);
		if (!id) {
			setData({
				name: "",
				headerLevel: 2,
				previewWidthPx: 1000,
				previewBgColor: "#ffffff",
				previewTextColor: "#000000",
				previewLinkColor: "#0000ff",
				previewFontFamily: "Times New Roman, serif"
			});
			return;
		}
		setData(undefined);
		restClient
			.admin
			.destinations
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
			.admin
			.destinations
			.save(data)
			.then((f) => {
				if (inserting) {
					navigator.admin.destinations.detail(f.id, true);
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
		confirmDialog.confirm("Smazat?", "Opravdu si přejete smazat napojení na tento web?", () => {
			setDeleting(true);
			restClient
				.admin
				.destinations
				.delete(Number(data.id))
				.then((f) => {
					navigator.admin.destinations.list();
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
					<SaveButton loading={saving} disabled={!changed} onClick={saveData}>
						Uložit
					</SaveButton>
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteAccount}>
						Smazat
					</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<FormRowControl
						label="Název"
						type="text"
						value={data.name}
						onChange={(e) => {
							data.name = e.target.value;
							onChanged();
						}}
					/>
					<Row>
						<Col>
							<Stack direction="horizontal" gap={3}>
								<FormRowControl
									label="Barva pozadí"
									type="color"
									value={data.previewBgColor}
									onChange={(e) => {
										data.previewBgColor = e.target.value;
										onChanged();
									}}
								/>
								<FormRowControl
									label="Barva textu"
									type="color"
									value={data.previewTextColor}
									onChange={(e) => {
										data.previewTextColor = e.target.value;
										onChanged();
									}}
								/>
								<FormRowControl
									label="Barva odkazu"
									type="color"
									value={data.previewLinkColor}
									onChange={(e) => {
										data.previewLinkColor = e.target.value;
										onChanged();
									}}
								/>
							</Stack>
							<FormRowControl
								label="Typ písma"
								type="text"
								maxLength={255}
								value={data.previewFontFamily}
								onChange={(e) => {
									data.previewFontFamily = e.target.value;
									onChanged();
								}}
							/>
							<FormRowControl
								label="Maximální šířka stránky (px)"
								type="number"
								value={data.previewWidthPx}
								onChange={(e) => {
									data.previewFontFamily = e.target.value;
									onChanged();
								}}
							/>
							<small className="text-muted">Používá se při náhledu na celou obrazovku</small>
							<FormRow label="Základní úroveň nadpisů">
								<Form.Select
									value={data.headerLevel}
									onChange={(e) => {
										data.headerLevel = Number(e.target.value);
										onChanged();
									}}
								>
									<option value={2}>h2</option>
									<option value={3}>h3</option>
									<option value={4}>h4</option>
									<option value={5}>h5</option>
								</Form.Select>
							</FormRow>
						</Col>
						<Col>
							<DestinationPreview destination={data}/>
						</Col>
					</Row>
				</Stack>
			</Form>
			{
				data.id && (
					<div className="mt-2">
						<Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}>
							<Tab title="Články" eventKey="articles"/>
						</Tabs>
						<div className="px-3 py-1">
							{activeTab === "article" && <DestinationArticlesList destinationId={data.id}/>}
						</div>
					</div>
				)
			}
		</div>
	);
}
