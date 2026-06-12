import {Button, Form, Modal, ModalBody, ModalHeader, Spinner, Stack} from "react-bootstrap";
import {BasicDialogProps, FormRowControl, TextToClipboard} from "zavadil-react-common";
import {FormEvent, useCallback, useContext, useEffect, useState} from "react";
import {EmailUtil, StringUtil} from "zavadil-ts-common";
import {useRestClient} from "../../client/OpRestClient";
import {ArticleStub} from "../../types/Article";
import {useUserSession} from "../../util/UserSession";
import {UserAlertsContext} from "../../util/UserAlerts";

export type GrantGuestAccessDialogProps = BasicDialogProps & {
	articleId?: number;
	destinationId?: number;
	onConfirm: (partnerEmail: string) => any;
};

export default function GrantGuestAccessDialog({
	articleId,
	destinationId,
	onClose,
	onConfirm,
	name = 'Udělit partnerský přístup',
	text = 'Vložte email partnera, kterému chcete udělit přístup.'
}: GrantGuestAccessDialogProps) {
	const restClient = useRestClient();
	const userSession = useUserSession();
	const userAlerts = useContext(UserAlertsContext);
	const [partnerEmail, setPartnerEmail] = useState<string>('');
	const [url, setUrl] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);
	const [valid, setValid] = useState<boolean>(false);

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
					.grantGuestAccess(articleId, partnerEmail)
					.then(setUrl)
					.catch((e) => userAlerts.err(e))
					.finally(() => setLoading(false));
			} else {
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
							.grantGuestAccess(Number(newArticle.id), partnerEmail)
							.then(setUrl)
					)
					.catch((e) => userAlerts.err(e))
					.finally(() => setLoading(false));
			}
		},
		[partnerEmail, articleId, destinationId, restClient, userSession, userAlerts]
	);

	const confirm = useCallback(
		() => {
			onConfirm(partnerEmail);
		},
		[partnerEmail, onConfirm]
	);

	return <Modal show={true} onHide={() => url ? confirm() : onClose()}>
		{
			name && <ModalHeader>{name}</ModalHeader>
		}
		<ModalBody>
			{
				text && <p>{text}</p>
			}
			<Form onSubmit={confirm}>
				<Stack gap={3}>
					{
						loading ? <Spinner/>
							: (
								url ? <div>
										<div>Na vložený email byla odeslána pozvánka k editaci článku.</div>
										<div>
											<TextToClipboard text={url} onClipboardCopy={() => userAlerts.info("Url bylo zkopírováno do schránky")}/>
										</div>
									</div>
									: <div>
										<FormRowControl
											id="partner_email"
											name="partner_email"
											label="Email partnera"
											type="email"
											value={partnerEmail}
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
		</ModalBody>
	</Modal>
}

