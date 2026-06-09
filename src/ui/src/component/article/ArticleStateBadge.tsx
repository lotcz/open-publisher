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
			if (state === 'Published') return 'success';
			return 'primary';
		},
		[state]
	);

	return <Badge bg={variant}><Localize text={state}/></Badge>
}
