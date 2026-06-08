import { PropsWithChildren, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import { Localize } from "zavadil-react-common";
import {StringUtil} from "zavadil-ts-common";

export type LoadingPageProps = {
	errorMessage? : string;
}

export function LoadingPage({errorMessage} : LoadingPageProps) {
	return (
		<div className="min-h-100 d-flex flex-column align-items-center justify-content-center gap-4">
			{
				StringUtil.notBlank(errorMessage) ?
					<div className="error">{errorMessage}</div>
					: <div>
						<Localize text="Loading..." />
						<Spinner variant="danger" />
					</div>
			}
		</div>
	);
}

export default function SuspensePage({ children }: PropsWithChildren) {
	return <Suspense fallback={<LoadingPage />}>{children}</Suspense>;
}
