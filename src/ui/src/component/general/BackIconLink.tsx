import {ConfirmDialogContext} from "zavadil-react-common";
import {BsArrow90DegUp} from "react-icons/bs";
import {useContext} from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router";

export type BackIconLinkProps = {
	changed: boolean;
};

export default function BackIconLink({changed}: BackIconLinkProps) {
	const confirmDialog = useContext(ConfirmDialogContext);
	const navigate = useNavigate();

	return <Button
		variant="link"
		onClick={
			() => {
				if (changed) {
					confirmDialog.confirm(
						"Neuložené změny",
						"Ve formuláři jsou neuložené změny, opravdu se přejete změny zahodit a odejít z formuláře?",
						() => navigate(-1)
					)
				} else {
					navigate(-1);
				}
			}
		}
	>
		<div className="d-flex align-items-center gap-2">
			<BsArrow90DegUp/>
			<div>Zpět</div>
		</div>
	</Button>
}

