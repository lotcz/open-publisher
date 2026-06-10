import {FormEvent, useCallback, useEffect, useState} from "react";
import {Button, Form, Stack} from "react-bootstrap";
import {FormRowControl, Spread} from "zavadil-react-common";
import {StringUtil} from "zavadil-ts-common";

export type LoginPageProps = {
	lastLogin?: string;
	onConfirmed: (login: string, password: string) => any;
}

export function LoginPage({onConfirmed, lastLogin}: LoginPageProps) {
	const [email, setEmail] = useState<string>(lastLogin || '');
	const [password, setPassword] = useState<string>('');
	const [valid, setValid] = useState<boolean>(false);

	useEffect(() => {
		setValid(StringUtil.notBlank(email) && StringUtil.notBlank(password));
	}, [email, password]);

	const confirm = useCallback(
		(e: FormEvent) => {
			e.stopPropagation();
			e.preventDefault();
			if (valid) onConfirmed(email, password);
		},
		[email, password, valid, onConfirmed]
	);

	return (
		<Spread>
			<div className="d-flex flex-column align-items-center justify-content-center">
				<Form onSubmit={confirm}>
					<Stack gap={3}>
						<FormRowControl
							id="email"
							name="email"
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<FormRowControl
							id="password"
							name="password"
							label="Heslo"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div>
							<Button
								type="submit"
								disabled={!valid}
								onClick={confirm}
							>
								Přihlásit
							</Button>
						</div>
					</Stack>
				</Form>
			</div>
		</Spread>
	);
}
