import {Col, Row} from "react-bootstrap";
import LightSwitch from "./general/LightSwitch";

export default function Settings() {
	return (
		<div className="p-3 pt-1">
			<h1>Dashboard</h1>
			<Row>
				<Col>
					<LightSwitch/>
				</Col>
			</Row>
		</div>
	);
}
