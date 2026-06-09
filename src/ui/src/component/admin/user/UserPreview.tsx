import {Spinner} from "react-bootstrap";
import {Link} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {useNavigator} from "../../../navigator/OpAppNavigator";
import {useRestClient} from "../../../client/OpRestClient";
import {UserAlertsContext} from "../../../util/UserAlerts";
import {User} from "../../../types/User";

export type UserPreviewParams = {
	userId: number;
};

export default function UserPreview({userId}: UserPreviewParams) {
	const navigator = useNavigator();
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<User>();

	const reload = useCallback(() => {
		setData(undefined);
		if (userId) {
			restClient.users
				.loadSingle(userId)
				.then(setData)
				.catch((e: Error) => userAlerts.err(e));
		}
	}, [userId, restClient, userAlerts]);

	useEffect(reload, [userId]);

	if (!data) {
		return <Spinner/>;
	}

	return <Link to={navigator.admin.users.path.detail(userId)}>{data.email}</Link>;
}
