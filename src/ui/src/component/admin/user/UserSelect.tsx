import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useRestClient} from "../../../client/OpRestClient";

export type UserSelectProps = {
	userId?: number | null;
	onChange: (userId?: number | null) => any;
}

export default function UserSelect({userId, onChange}: UserSelectProps) {
	const restClient = useRestClient();

	return <AutocompleteEntityIdSelect
		id={userId}
		onChange={onChange}
		entityClient={restClient.admin.users}
		labelGetter={(usr) => usr.email}
	/>

}
