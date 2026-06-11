import {FormEvent, useCallback, useContext, useEffect, useState} from "react";
import {SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {Button, Form} from "react-bootstrap";
import {Page, PagingRequest} from "zavadil-ts-common";
import {useNavigator} from "../../navigator/OpAppNavigator";
import {useRestClient} from "../../client/OpRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {ArticleHistory} from "../../types/ArticleHistory";
import {DateTimeCs} from "../general/DateTimeCs";
import ArticleHistoryContent from "./ArticleHistoryContent";

const HEADER: SelectableTableHeader<ArticleHistory> = [
	{name: "createdOn", label: "Datum", renderer: (p) => <DateTimeCs value={p.createdOn}/>},
	{name: "user.email", label: "Uživatel"},
	{name: "action", label: "Akce"},
	{name: "content", label: "Hodnota", renderer: (ah) => <ArticleHistoryContent history={ah}/>},
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 50, sorting: [{name: "createdOn", desc: true}]};

export type ArticleHistoryProps = {
	articleId: number;
};

export default function ArticleHistoryTab({articleId}: ArticleHistoryProps) {
	const navigator = useNavigator();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Page<ArticleHistory>>();
	const [searchInput, setSearchInput] = useState<string>('');
	const [paging, setPaging] = useState<PagingRequest>(DEFAULT_PAGING);

	const load = useCallback(() => {
		restClient
			.articleHistory
			.loadByArticle(articleId, paging)
			.then(setData)
			.catch((e: Error) => {
				setData(undefined);
				userAlerts.err(e);
			});
	}, [articleId, paging, restClient, userAlerts]);

	useEffect(load, [articleId, paging]);

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			setPaging({...paging});
		},
		[paging, searchInput],
	);

	if (!data) return <TablePlaceholder/>;

	return (
		<div>
			<div className="pt-2 d-flex gap-2 align-items-center">
				<div style={{width: "250px"}}>
					<Form onSubmit={applySearch}>
						<TextInputWithReset
							value={searchInput}
							onChange={setSearchInput}
							onReset={() => {
								setSearchInput("");
								setPaging(DEFAULT_PAGING);
							}}
						/>
					</Form>
				</div>
				<Button onClick={applySearch} size="sm">Hledat</Button>
			</div>
			<div className="pt-2">
				<TableWithSelect
					showSelect={false}
					header={HEADER}
					paging={paging}
					totalItems={data.totalItems}
					onPagingChanged={setPaging}
					items={data.content}
					hover={true}
					striped={true}
				/>
			</div>
		</div>
	);
}
