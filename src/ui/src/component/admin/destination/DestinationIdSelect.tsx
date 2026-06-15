import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useRestClient} from "../../../client/OpRestClient";

export type DestinationIdSelectProps = {
	destinationId?: number | null;
	onChange: (destinationId?: number | null) => any;
	disabled?: boolean;
}

export default function DestinationIdSelect({disabled, destinationId, onChange}: DestinationIdSelectProps) {
	const restClient = useRestClient();

	return <AutocompleteEntityIdSelect
		id={destinationId}
		disabled={disabled}
		onChange={onChange}
		entityClient={restClient.destinations}
		labelGetter={(d) => d.name}
	/>

}
