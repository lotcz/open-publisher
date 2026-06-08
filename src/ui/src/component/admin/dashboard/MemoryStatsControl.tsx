import {useCallback, useContext, useEffect, useState} from "react";
import {Card, Placeholder} from "react-bootstrap";
import {JavaHeapControl} from "zavadil-react-common";
import {useRestClient} from "../../../client/OpRestClient";
import {UserAlertsContext} from "../../../util/UserAlerts";
import {OpStats} from "../../../types/Stats";

function MemoryStatsControl() {
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [stats, setStats] = useState<OpStats>();

	const loadStats = useCallback(() => {
		restClient
			.stats()
			.then(setStats)
			.catch((e) => userAlerts.err(e));
	}, [restClient, userAlerts]);

	useEffect(() => {
		loadStats();
		const h = setInterval(loadStats, 2000);
		return () => clearInterval(h);
	}, []);

	return (
		<Card>
			<Card.Header>
				<Card.Title>Server Memory</Card.Title>
			</Card.Header>
			<Card.Body>
				{stats ? (
					<JavaHeapControl stats={stats.javaHeap}/>
				) : (
					<Placeholder className="w-100" as="p" animation="glow">
						<Placeholder className="w-100"/>
					</Placeholder>
				)}
			</Card.Body>
		</Card>
	);
}

export default MemoryStatsControl;
