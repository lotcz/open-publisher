import {FormEvent, useCallback, useContext, useEffect, useState} from "react";
import {DateTime, SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {Button, Form} from "react-bootstrap";
import {Page, PagingRequest} from "zavadil-ts-common";
import {useNavigator} from "../../../navigator/OpAppNavigator";
import {useRestClient} from "../../../client/OpRestClient";
import {UserAlertsContext} from "../../../util/UserAlerts";
import {Article} from "../../../types/Article";

const HEADER: SelectableTableHeader<Article> = [
	{name: "header", label: "Nadpis"},
	{name: "owner.email", label: "Vlastník"},
	{name: "partner.email", label: "Partner"},
	{name: "lastUpdatedOn", label: "Upraven", renderer: (p) => <DateTime value={p.lastUpdatedOn}/>},
	{name: "createdOn", label: "Vytvořen", renderer: (p) => <DateTime value={p.createdOn}/>},
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 10, sorting: [{name: "lastUpdatedOn", desc: true}]};

export type UserArticlesListProps = {
	userId: number;
};

export default function UserArticlesList({userId}: UserArticlesListProps) {
	const navigator = useNavigator();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Page<Article>>();
	const [searchInput, setSearchInput] = useState<string>('');
	const [paging, setPaging] = useState<PagingRequest>(DEFAULT_PAGING);

	const load = useCallback(() => {
		restClient
			.articles
			.loadByUser(userId, paging)
			.then(setData)
			.catch((e: Error) => {
				setData(undefined);
				userAlerts.err(e);
			});
	}, [userId, paging, restClient, userAlerts]);

	useEffect(load, [userId, paging]);

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
				<Button variant="primary" size="sm" onClick={() => navigator.articles.add(userId)}>
					+ Vložit
				</Button>
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
					onClick={(item) => navigator.articles.detail(item.id)}
					items={data.content}
					hover={true}
					striped={true}
				/>
			</div>
		</div>
	);
}
