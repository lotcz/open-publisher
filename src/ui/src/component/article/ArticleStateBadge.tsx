import {Variant} from "react-bootstrap/types";
import {useMemo} from "react";
import {Badge} from "react-bootstrap";
import {Localize} from "zavadil-react-common";

export type ArticleStateBadgeProps = {
	state: string;
}

export default function ArticleStateBadge({state}: ArticleStateBadgeProps) {
	const variant: Variant = useMemo(
		() => {
			if (state === 'Hidden') return 'secondary';
			if (state === 'Ready') return 'info';
			if (state === 'Approved') return 'success';
			return 'primary';
		},
		[state]
	);

	return <Badge className={`bg-${variant} text-bg-${variant}`}><Localize text={state}/></Badge>
}
