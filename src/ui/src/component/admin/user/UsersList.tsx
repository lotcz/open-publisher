import {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Button, Form, Stack} from "react-bootstrap";
import {DateTime, SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useParams} from "react-router";
import {useNavigator} from "../../../navigator/OpAppNavigator";
import {useRestClient} from "../../../client/OpRestClient";
import {UserAlertsContext} from "../../../util/UserAlerts";
import {User} from "../../../types/User";
import RefreshIconButton from "../../general/RefreshIconButton";


const HEADER: SelectableTableHeader<User> = [
	{name: "id", label: "ID"},
	{name: "name", label: "Name"},
	{name: "email", label: "Email"},
	{name: "state", label: "State"},
	{name: "lastUpdatedOn", label: "Updated", renderer: (p) => <DateTime value={p.lastUpdatedOn}/>},
	{name: "createdOn", label: "Created", renderer: (p) => <DateTime value={p.createdOn}/>},
	{name: "syncState", label: "Sync"},
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: "lastUpdatedOn", desc: true}]};

export default function UsersList() {
	const {pagingString} = useParams();
	const navigator = useNavigator();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Page<User> | null>(null);

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
			navigator.admin.users.list(paging);
		},
		[paging, searchInput, navigator],
	);

	const loadPageHandler = useCallback(() => {
		setData(null);
		restClient.admin.users
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
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={reload}/>
					<Button onClick={() => navigator.admin.users.add()} className="text-nowrap">
						+ Add
					</Button>
					<div style={{width: "250px"}}>
						<Form onSubmit={applySearch}>
							<TextInputWithReset
								value={searchInput}
								onChange={setSearchInput}
								onReset={() => {
									setSearchInput("");
									navigator.admin.users.list(DEFAULT_PAGING);
								}}
							/>
						</Form>
					</div>
					<Button onClick={applySearch}>Hledat</Button>
				</Stack>
			</div>

			<div className="px-3 gap-3">
				{data === null ? (
					<TablePlaceholder/>
				) : (
					<TableWithSelect
						showSelect={false}
						header={HEADER}
						paging={paging}
						totalItems={data.totalItems}
						onPagingChanged={(p) => navigator.admin.users.list(p)}
						onClick={(item) => navigator.admin.users.detail(item.id)}
						items={data.content}
						hover={true}
						striped={true}
					/>
				)}
			</div>
		</div>
	);
}
