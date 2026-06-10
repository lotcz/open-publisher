import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useRestClient} from "../../../client/OpRestClient";

export type DestinationIdSelectProps = {
	destinationId?: number | null;
	onChange: (destinationId?: number | null) => any;
}

export default function DestinationIdSelect({destinationId, onChange}: DestinationIdSelectProps) {
	const restClient = useRestClient();

	return <AutocompleteEntityIdSelect
		id={destinationId}
		onChange={onChange}
		entityClient={restClient.destinations}
		labelGetter={(d) => d.name}
	/>

}
