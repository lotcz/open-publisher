import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useRestClient} from "../../../client/OpRestClient";

export type UserIdSelectProps = {
	userId?: number | null;
	onChange: (userId?: number | null) => any;
}

export default function UserIdSelect({userId, onChange}: UserIdSelectProps) {
	const restClient = useRestClient();

	return <AutocompleteEntityIdSelect
		id={userId}
		onChange={onChange}
		entityClient={restClient.users}
		labelGetter={(usr) => usr.email}
	/>

}
