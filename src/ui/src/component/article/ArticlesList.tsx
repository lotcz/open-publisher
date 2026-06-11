import {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Button, Form, Stack} from "react-bootstrap";
import {SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useParams} from "react-router";
import {Article} from "../../types/Article";
import {useNavigator} from "../../navigator/OpAppNavigator";
import {useRestClient} from "../../client/OpRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import ArticleStateBadge from "./ArticleStateBadge";
import {DateTimeCs} from "../general/DateTimeCs";
import {useUserSession} from "../../util/UserSession";

const HEADER: SelectableTableHeader<Article> = [
	{name: "header", label: "Nadpis"},
	{name: "destination.name", label: "Web"},
	{name: "owner.name", label: "Autor"},
	{name: "partner.name", label: "Partner"},
	{name: "articleState", label: "Stav publikace", renderer: (a) => <ArticleStateBadge state={a.articleState}/>},
	{name: "createdOn", label: "Vytvořeno", renderer: (p) => <DateTimeCs value={p.createdOn}/>},
	{name: "lastUpdatedOn", label: "Upraveno", renderer: (p) => <DateTimeCs value={p.lastUpdatedOn}/>}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: "lastUpdatedOn", desc: true}]};

export default function ArticlesList() {
	const {pagingString} = useParams();
	const navigator = useNavigator();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const userSession = useUserSession();
	const [data, setData] = useState<Page<Article> | null>(null);

	const paging = useMemo(
		() => (StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING) : PagingUtil.pagingRequestFromString(pagingString)),
		[pagingString],
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			navigator.articles.list(paging);
		},
		[paging, searchInput, navigator],
	);

	const loadPageHandler = useCallback(() => {
		setData(null);
		restClient.articles
			.loadPage(paging)
			.then(setData)
			.catch((e: Error) => {
				setData(null);
				userAlerts.err(e);
			});
	}, [paging, restClient, userAlerts]);

	useEffect(loadPageHandler, [paging]);

	const reload = useCallback(() => {
		setData(null);
		loadPageHandler();
	}, [loadPageHandler]);

	return (
		<Stack gap={2}>
			<Stack direction="horizontal" gap={2}>
				<RefreshIconButton onClick={reload}/>
				{
					userSession.user.userRole !== 'Guest' &&
					<Button onClick={() => navigator.articles.add()} className="text-nowrap" variant="success">
						+ Nový článek
					</Button>
				}
				<div style={{width: "250px"}}>
					<Form onSubmit={applySearch}>
						<TextInputWithReset
							value={searchInput}
							onChange={setSearchInput}
							onReset={() => {
								setSearchInput("");
								navigator.articles.list(DEFAULT_PAGING);
							}}
						/>
					</Form>
				</div>
				<Button onClick={applySearch}>Hledat</Button>
			</Stack>

			<div>
				{data === null ? (
					<TablePlaceholder/>
				) : (
					<TableWithSelect
						showSelect={false}
						header={HEADER}
						paging={paging}
						totalItems={data.totalItems}
						onPagingChanged={(p) => navigator.articles.list(p)}
						onClick={(item) => navigator.articles.detail(item.id)}
						items={data.content}
						hover={true}
						striped={true}
					/>
				)}
			</div>
		</Stack>
	);
}
