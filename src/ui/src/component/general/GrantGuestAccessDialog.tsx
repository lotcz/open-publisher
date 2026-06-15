import {Button, Form, Modal, ModalBody, ModalHeader, Spinner, Stack} from "react-bootstrap";
import {BasicDialogProps, FormRow, FormRowControl, Switch, TextToClipboard} from "zavadil-react-common";
import {FormEvent, useCallback, useContext, useEffect, useState} from "react";
import {EmailUtil, ObjectUtil, StringUtil} from "zavadil-ts-common";
import {useRestClient} from "../../client/OpRestClient";
import {ArticleStub} from "../../types/Article";
import {useUserSession} from "../../util/UserSession";
import {UserAlertsContext} from "../../util/UserAlerts";
import {User} from "../../types/User";

export type GrantGuestAccessDialogProps = BasicDialogProps & {
	articleId?: number;
	destinationId?: number;
	user?: User;
	onConfirm: (partnerEmail: string) => any;
};

export default function GrantGuestAccessDialog({
	articleId,
	destinationId,
	user,
	onClose,
	onConfirm,
	name = 'Udělit partnerský přístup',
	text = 'Vložte email partnera, kterému chcete udělit přístup.'
}: GrantGuestAccessDialogProps) {
	const restClient = useRestClient();
	const userSession = useUserSession();
	const userAlerts = useContext(UserAlertsContext);
	const [partnerEmail, setPartnerEmail] = useState<string>(StringUtil.getNonEmpty(user?.email));
	const [url, setUrl] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);
	const [valid, setValid] = useState<boolean>(false);
	const [sendEmail, setSendEmail] = useState<boolean>(false);

	useEffect(() => {
		setValid(EmailUtil.isValidEmail(partnerEmail));
	}, [partnerEmail]);

	const createUrl = useCallback(
		(e: FormEvent) => {
			e.stopPropagation();
			e.preventDefault();
			setLoading(true);

			if (articleId) {
				restClient.articles
					.grantGuestAccess(articleId, partnerEmail, sendEmail)
					.then(setUrl)
					.catch((e) => userAlerts.err(e))
					.finally(() => setLoading(false));
			} else if (destinationId) {
				const article: ArticleStub = {
					ownerId: Number(userSession.user.id),
					destinationId: destinationId,
					articleState: 'Draft',
					header: 'Nový článek',
				}
				restClient.articles
					.saveStub(article)
					.then(
						(newArticle) => restClient.articles
							.grantGuestAccess(Number(newArticle.id), partnerEmail, sendEmail)
							.then(setUrl)
					)
					.catch((e) => userAlerts.err(e))
					.finally(() => setLoading(false));
			} else if (user) {
				restClient.users
					.sendInvitationLink(Number(user?.id), sendEmail)
					.then(setUrl)
					.catch((e) => userAlerts.err(e))
					.finally(() => setLoading(false));
			} else {
				userAlerts.err('Nebyl dodán článek, web ani uživatel pro udělení přístupu');
			}
		},
		[partnerEmail, articleId, destinationId, restClient, userSession, userAlerts, user, sendEmail]
	);

	const confirm = useCallback(
		() => {
			onConfirm(partnerEmail);
		},
		[partnerEmail, onConfirm]
	);

	return <Modal show={true} onHide={() => url ? confirm() : onClose()}>
		{
			name && <ModalHeader><h3>{name}</h3></ModalHeader>
		}
		<ModalBody>
			<Stack gap={2}>
				{
					text && <div>{text}</div>
				}
				{
					!url && <Switch label="Odeslat odkaz na email" checked={sendEmail} onChange={setSendEmail}/>
				}
				<Form onSubmit={confirm}>
					<Stack gap={3}>
						{
							loading ? <Spinner/>
								: (
									url ? <Stack gap={2}>
											{
												sendEmail && <div className="text-success">
													{
														user ? 'Uživateli byl odeslán odkaz pro přihlášení.' :
															'Na vložený email byla odeslána pozvánka k editaci článku.'
													}
												</div>
											}
											<FormRow label="Odkaz">
												<TextToClipboard text={url} onClipboardCopy={() => userAlerts.info("Url bylo zkopírováno do schránky")}/>
											</FormRow>
										</Stack>
										: <div>
											<FormRowControl
												id="partner_email"
												name="partner_email"
												label="Email"
												type="email"
												value={partnerEmail}
												disabled={ObjectUtil.notEmpty(user)}
												onChange={(e) => setPartnerEmail(e.target.value)}
											/>
											{
												StringUtil.notBlank(partnerEmail) && !valid && <small className="error">Vložte platný email</small>
											}
										</div>
								)
						}
						<div className="d-flex justify-content-center align-items-center gap-3">
							{
								url ? <>
										<Button onClick={confirm} variant="success">Zavřít</Button>
									</>
									: <>
										<Button onClick={onClose} variant="link">Zpět</Button>
										<Button type="submit" onClick={createUrl} disabled={!valid} variant="success">Vytvořit přístup</Button>
									</>
							}
						</div>
					</Stack>
				</Form>
			</Stack>
		</ModalBody>
	</Modal>
}

