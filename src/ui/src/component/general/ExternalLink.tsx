import { BsBoxArrowUpRight } from "react-icons/bs";

export type ExternalLinkProps = {
	url: string;
	label?: string | null;
};

export default function ExternalLink({ url, label }: ExternalLinkProps) {
	return (
		<a className="d-flex align-items-center gap-2 py-1 px-2" href={url} target="_blank">
			<BsBoxArrowUpRight />
			{label && <div>{label}</div>}
		</a>
	);
}
