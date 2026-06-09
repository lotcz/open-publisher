import {useRestClient} from "../../../client/OpRestClient";
import EnumDynamicSelect from "../../general/EnumDynamicSelect";

export type SyncStateSelectProps = {
	state: string;
	onChange: (state: string) => any;
}

export default function SyncStateSelect({state, onChange}: SyncStateSelectProps) {
	const client = useRestClient();
	return <EnumDynamicSelect

		supplier={() => client.enumerations.syncStates.get()}
		value={state}
		onChange={(s) => onChange(String(s))}
	/>
}
