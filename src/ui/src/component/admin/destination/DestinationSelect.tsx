import {AutocompleteEntitySelect} from "zavadil-react-common";
import {useRestClient} from "../../../client/OpRestClient";
import {Destination} from "../../../types/Destination";

export type DestinationIdSelectProps = {
	destination?: Destination | null;
	onChange: (destination?: Destination | null) => any;
}

export default function DestinationSelect({destination, onChange}: DestinationIdSelectProps) {
	const restClient = useRestClient();

	return <AutocompleteEntitySelect
		selected={destination}
		onChange={onChange}
		entityClient={restClient.destinations}
		labelGetter={(d) => d.name}
	/>

}
