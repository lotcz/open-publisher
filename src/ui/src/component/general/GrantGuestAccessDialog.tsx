import {Button, Form, Modal, ModalBody, ModalHeader, Spinner, Stack} from "react-bootstrap";
import {BasicDialogProps, FormRowControl} from "zavadil-react-common";
import {FormEvent, useCallback, useEffect, useState} from "react";
import {EmailUtil, StringUtil} from "zavadil-ts-common";
import {useRestClient} from "../../client/OpRestClient";

export type GrantGuestAccessDialogProps = BasicDialogProps & {
	articleId: number;
	onConfirm: (partnerEmail: string) => any;
};

export default function GrantGuestAccessDialog({
	articleId,
	onClose,
	onConfirm,
	name = 'Udělit partnerský přístup',
	text = 'Vložte email partnera, kterému chcete udělit přístup.'
}: GrantGuestAccessDialogProps) {
	const restClient = useRestClient();
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
			restClient.articles
				.grantGuestAccess(articleId, partnerEmail)
				.then(setUrl);
		},
		[partnerEmail, articleId, restClient]
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
										{url}
									</div>
									: <>
										<FormRowControl
											id="partner_email"
											name="partner_email"
											label="Email partnera"
											type="email"
											value={partnerEmail}
											onChange={(e) => setPartnerEmail(e.target.value)}
										/>
										{
											StringUtil.notBlank(partnerEmail) && !valid && <div className="error">Vložte platný email</div>
										}
									</>
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

