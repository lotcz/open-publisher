import {Button, Form, Modal, ModalBody, ModalHeader, Stack} from "react-bootstrap";
import {BasicDialogProps, FormRowControl} from "zavadil-react-common";
import {FormEvent, useCallback, useMemo, useState} from "react";
import {StringUtil} from "zavadil-ts-common";

export type ChangePasswordDialogProps = BasicDialogProps & {
	onConfirm: (password: string) => any;
};

export default function ChangePasswordDialog({onClose, onConfirm, name, text}: ChangePasswordDialogProps) {
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');

	const safe = useMemo(
		() => StringUtil.notBlank(password) && password.length > 7,
		[password]
	);

	const valid = useMemo(
		() => safe && password === passwordConfirm,
		[password, passwordConfirm, safe]
	);

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
					<div>
						<FormRowControl
							id="new_password"
							name="new_password"
							label="Nové Heslo"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{
							safe ? <small className="text-success">Heslo je bezpečné.</small>
								: <small className="error">Heslo musí mít alespoň 8 znaků.</small>
						}
					</div>
					<div>
						<FormRowControl
							id="new_password_confirm"
							name="new_password_confirm"
							label="Nové heslo znovu pro kontrolu"
							type="password"
							value={passwordConfirm}
							onChange={(e) => setPasswordConfirm(e.target.value)}
						/>
						{
							(password === passwordConfirm) ? <small className="text-success">Hesla se shodují.</small>
								: <small className="text-warning">Hesla se neshodují.</small>
						}
					</div>
					<div className="d-flex justify-content-center align-items-center gap-3">
						<Button onClick={onClose} variant="link">Zpět</Button>
						<Button type="submit" onClick={confirm} disabled={!valid} variant="success">Změnit heslo</Button>
					</div>
				</Stack>
			</Form>
		</ModalBody>
	</Modal>

}

