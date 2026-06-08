import MemoryStatsControl from "./MemoryStatsControl";
import { Col, Row } from "react-bootstrap";

function Dashboard() {
	return (
		<div className="p-3 pt-1">
			<h1>Dashboard</h1>
			<Row>
				<Col>
					<MemoryStatsControl />
				</Col>
			</Row>
		</div>
	);
}

export default Dashboard;
