import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Stack} from "react-bootstrap";
import {BasicDialogProps, FormRowControl} from "zavadil-react-common";
import {useEffect, useState} from "react";
import {StringUtil} from "zavadil-ts-common";

export type ChangePasswordDialogProps = BasicDialogProps & {
	onConfirm: (password: string) => any;
};

export default function ChangePasswordDialog({onClose, onConfirm, name, text}: ChangePasswordDialogProps) {
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');
	const [valid, setValid] = useState<boolean>(false);

	useEffect(() => {
		setValid(StringUtil.notBlank(password) && StringUtil.notBlank(passwordConfirm) && password === passwordConfirm);
	}, [password, passwordConfirm]);

	return <Modal show={true} onHide={onClose}>
		{
			name && <ModalHeader>{name}</ModalHeader>
		}
		<ModalBody>
			{
				text && <p>{text}</p>
			}
			<Stack gap={3}>
				<FormRowControl
					label="Nové Heslo"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<FormRowControl
					label="Nové heslo znovu pro kontrolu"
					type="password"
					value={passwordConfirm}
					onChange={(e) => setPasswordConfirm(e.target.value)}
				/>
			</Stack>
		</ModalBody>
		<ModalFooter>
			<div className="d-flex justify-content-center align-items-center gap-3">
				<Button onClick={onClose} variant="link">Zpět</Button>
				<Button onClick={() => onConfirm(password)} disabled={!valid} variant="success">Změnit heslo</Button>
			</div>
		</ModalFooter>
	</Modal>
}

