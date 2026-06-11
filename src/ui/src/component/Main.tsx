import {Route, Routes} from "react-router";
import MainMenu from "./MainMenu";
import {Stack} from "react-bootstrap";

import UsersList from "./admin/user/UsersList";
import UserDetail from "./admin/user/UserDetail";
import Dashboard from "./dashboard/Dashboard";
import DestinationsList from "./admin/destination/DestinationsList";
import DestinationDetail from "./admin/destination/DestinationDetail";
import ArticlesList from "./article/ArticlesList";
import ArticleDetail from "./article/ArticleDetail";
import NotFoundPage from "./NotFoundPage";

export default function Main() {
	return (
		<main className="p-2">
			<Stack direction="horizontal" className="align-items-start" gap={3}>
				<MainMenu/>
				<div className="flex-grow-1 pb-4">
					<Routes>
						<Route path="/" element={<Dashboard/>}/>

						<Route path="clanky">
							<Route path="" element={<ArticlesList/>}/>
							<Route path="detail">
								<Route path="vlozit" element={<ArticleDetail/>}/>
								<Route path="vlozit/:destinationId" element={<ArticleDetail/>}/>
								<Route path=":id" element={<ArticleDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<ArticlesList/>}/>
						</Route>

						<Route path="administrace">
							<Route path="" element={<Dashboard/>}/>
							<Route path="uzivatele">
								<Route path="" element={<UsersList/>}/>
								<Route path="detail">
									<Route path="vlozit" element={<UserDetail/>}/>
									<Route path=":id" element={<UserDetail/>}/>
								</Route>
								<Route path=":pagingString" element={<UsersList/>}/>
							</Route>
							<Route path="weby">
								<Route path="" element={<DestinationsList/>}/>
								<Route path="detail">
									<Route path="vlozit" element={<DestinationDetail/>}/>
									<Route path=":id" element={<DestinationDetail/>}/>
								</Route>
								<Route path=":pagingString" element={<DestinationsList/>}/>
							</Route>
						</Route>

						<Route path="*" element={<NotFoundPage/>}/>
					</Routes>
				</div>
			</Stack>
		</main>
	);
}
