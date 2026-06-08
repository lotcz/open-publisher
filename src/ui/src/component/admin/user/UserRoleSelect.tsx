import {useRestClient} from "../../../client/OpRestClient";
import EnumDynamicSelect from "../../general/EnumDynamicSelect";

export type UserRoleSelectProps = {
	state: string;
	onChange: (state: string) => any;
}

export default function UserRoleSelect({state, onChange}: UserRoleSelectProps) {
	const client = useRestClient();
	return <EnumDynamicSelect
		supplier={() => client.enumerations.userRoles.get()}
		value={state}
		onChange={(s) => onChange(String(s))}
	/>
}
