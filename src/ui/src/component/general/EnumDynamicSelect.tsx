import {EnumSelect} from "zavadil-react-common";
import {useContext, useEffect, useState} from "react";
import {UserAlertsContext} from "../../util/UserAlerts";

export type EnumDynamicSelectProps = {
	showEmptyOption?: boolean;
	value: string | null | undefined;
	onChange: (value: string | null | undefined) => any;
	supplier: () => Promise<Array<string>>;
}

export default function EnumDynamicSelect({value, onChange, showEmptyOption, supplier}: EnumDynamicSelectProps) {
	const userAlerts = useContext(UserAlertsContext);
	const [items, setItems] = useState<Array<string>>([]);

	useEffect(() => {
		supplier().then(setItems).catch((e) => userAlerts.err(e));
	}, [supplier, userAlerts]);

	return <EnumSelect
		options={items}
		value={value}
		onChange={onChange}
		showEmptyOption={showEmptyOption}
	/>
}
