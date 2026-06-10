import {Button, Form, Modal, ModalBody, ModalHeader, Stack} from "react-bootstrap";
import {BasicDialogProps, FormRowControl} from "zavadil-react-common";
import {FormEvent, useCallback, useEffect, useState} from "react";
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

	const confirm = useCallback(
		(e: FormEvent) => {
			e.stopPropagation();
			e.preventDefault();
			if (valid) onConfirm(password);
		},
		[password, valid, onConfirm]
	);

	return <Modal show={true} onHide={onClose}>
		{
			name && <ModalHeader>{name}</ModalHeader>
		}
		<ModalBody>
			{
				text && <p>{text}</p>
			}
			<Form onSubmit={confirm}>
				<Stack gap={3}>
					<FormRowControl
						id="new_password"
						name="new_password"
						label="Nové Heslo"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<FormRowControl
						id="new_password_confirm"
						name="new_password_confirm"
						label="Nové heslo znovu pro kontrolu"
						type="password"
						value={passwordConfirm}
						onChange={(e) => setPasswordConfirm(e.target.value)}
					/>
					<div className="d-flex justify-content-center align-items-center gap-3">
						<Button onClick={onClose} variant="link">Zpět</Button>
						<Button type="submit" onClick={confirm} disabled={!valid} variant="success">Změnit heslo</Button>
					</div>
				</Stack>
			</Form>
		</ModalBody>
	</Modal>

}

