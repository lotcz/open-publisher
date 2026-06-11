import {Variant} from "react-bootstrap/types";
import {useMemo} from "react";
import {Badge} from "react-bootstrap";

export type ActiveInactiveBadgeProps = {
	active: boolean;
}

export default function ActiveInactiveBadge({active}: ActiveInactiveBadgeProps) {
	const variant: Variant = useMemo(() => active ? 'success' : 'secondary', [active]);
	const text: string = useMemo(() => active ? 'Aktivní' : 'Neaktivní', [active]);

	return <Badge className={`bg-${variant} text-bg-${variant}`}>{text}</Badge>
}
