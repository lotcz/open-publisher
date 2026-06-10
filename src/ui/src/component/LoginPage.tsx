import {useEffect, useState} from "react";
import {Button, Form, Stack} from "react-bootstrap";
import {FormRowControl, Spread} from "zavadil-react-common";
import {StringUtil} from "zavadil-ts-common";

export type LoginPageProps = {
	onConfirmed: (login: string, password: string) => any;
}

export function LoginPage({onConfirmed}: LoginPageProps) {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [valid, setValid] = useState<boolean>(false);

	useEffect(() => {
		setValid(StringUtil.notBlank(email) && StringUtil.notBlank(password));
	}, [email, password]);

	return (
		<Spread>
			<div className="d-flex flex-column align-items-center justify-content-center">
				<Form
					onSubmit={
						() => {
							if (valid) onConfirmed(email, password);
						}
					}
				>
					<Stack gap={3}>
						<FormRowControl
							id="email"
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<FormRowControl
							id="password"
							label="Heslo"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div>
							<Button
								type="submit"
								disabled={!valid}
								onClick={() => onConfirmed(email, password)}
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
