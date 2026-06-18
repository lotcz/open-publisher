import {FormEvent, useCallback, useContext, useEffect, useState} from "react";
import {Button, Form, Stack} from "react-bootstrap";
import {FormRowControl, Spread} from "zavadil-react-common";
import {EmailUtil, StringUtil} from "zavadil-ts-common";
import {useRestClient} from "../client/OpRestClient";
import {UserAlertsContext} from "../util/UserAlerts";

export type LoginPageProps = {
	lastLogin?: string;
	onConfirmed: (login: string, password: string) => any;
}

export function LoginPage({onConfirmed, lastLogin}: LoginPageProps) {
	const restClient = useRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [email, setEmail] = useState<string>(lastLogin || '');
	const [password, setPassword] = useState<string>('');
	const [valid, setValid] = useState<boolean>(false);
	const [forgottenPassword, setForgottenPassword] = useState<boolean>(false);

	useEffect(() => {
		if (forgottenPassword) {
			setValid(EmailUtil.isValidEmail(email));
		} else {
			setValid(EmailUtil.isValidEmail(email) && StringUtil.notBlank(password));
		}
	}, [email, password, forgottenPassword]);

	const confirm = useCallback(
		(e: FormEvent) => {
			e.stopPropagation();
			e.preventDefault();
			if (valid) onConfirmed(email, password);
		},
		[email, password, valid, onConfirmed]
	);

	const sendLink = useCallback(
		(e: FormEvent) => {
			e.stopPropagation();
			e.preventDefault();
			if (valid) restClient.tokenManager.accessTokensClient
				.forgottenPassword(email)
				.then(() => userAlerts.info("Odkaz pro přihlášení byl odeslán."))
				.catch((e) => userAlerts.err(e));
		},
		[email, valid, userAlerts, restClient]
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
						{
							!forgottenPassword && <FormRowControl
								id="password"
								name="password"
								label="Heslo"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						}
						<div className="d-flex flex-column gap-2">
							{
								forgottenPassword ? <>
										<Button
											type="submit"
											disabled={!valid}
											onClick={sendLink}
										>
											Zaslat odkaz pro přihlášení
										</Button>
										<small>
											<Button
												size="sm"
												type="button"
												variant="link"
												onClick={() => setForgottenPassword(false)}
											>
												Přihlásit
											</Button>
										</small>
									</>
									: <>
										<Button
											type="submit"
											disabled={!valid}
											onClick={confirm}
										>
											Přihlásit
										</Button>
										<small>
											<Button
												size="sm"
												type="button"
												variant="link"
												onClick={() => setForgottenPassword(true)}
											>
												Zapomenuté heslo
											</Button>
										</small>
									</>
							}
						</div>
					</Stack>
				</Form>
			</div>
		</Spread>
	);
}
