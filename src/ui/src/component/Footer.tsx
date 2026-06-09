import {useEffect, useState} from "react";
import {useRestClient} from "../client/OpRestClient";

function Footer() {
	const restClient = useRestClient();
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		restClient
			.version()
			.then((s) => setStatus(s))
			.catch((e) => setStatus(String(e)));
	}, []);

	return <footer className="flex-fill p-3 small text-muted bg-body-secondary">
		<div className="text-center">
			Centrální publikace článků, verze {status}
		</div>
	</footer>;
}

export default Footer;
