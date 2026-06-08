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

	return <footer className="flex-fill p-3 small bg-body-secondary">{status}</footer>;
}

export default Footer;
