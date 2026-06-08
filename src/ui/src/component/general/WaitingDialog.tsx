import {Button, Modal, ModalBody, ModalFooter, ModalHeader, ProgressBar, Spinner} from "react-bootstrap";
import {BasicDialogProps, Localize} from "zavadil-react-common";

export type WaitingDialogProps = BasicDialogProps & {
	onCancel?: () => any;
	progress?: number;
	max?: number;
};

function WaitingDialog({onClose, onCancel, progress, max, name, text}: WaitingDialogProps) {

	return <Modal show={true} onHide={onClose}>
		{
			name && <ModalHeader><Localize text={name}/></ModalHeader>
		}
		<ModalBody>
			<Spinner/>
			{
				text && <div>{text}</div>
			}
			{
				(progress !== undefined) && <div>
					<ProgressBar min={0} max={max === undefined ? 1 : max} now={progress}/>
				</div>
			}
		</ModalBody>
		{
			onCancel &&
			<ModalFooter>
				<div>
					<Button onClick={onCancel} variant="link"><Localize text="Cancel"/></Button>
				</div>
			</ModalFooter>
		}
	</Modal>
}

export default WaitingDialog;
