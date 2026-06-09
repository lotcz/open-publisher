import {useCallback, useContext, useEffect, useState} from "react";
import {Form, Modal} from "react-bootstrap";
import {UserAlertsContext} from "../../util/UserAlerts";
import {Img} from "./Img";
import {SaveButton} from "zavadil-react-common";
import {useRestClient} from "../../client/OpRestClient";

export type UploadImageModalProps = {
	onClose: () => any;
	onSelected: (imageName: string) => any;
};

export function UploadImageModal({onClose, onSelected}: UploadImageModalProps) {
	const restClient = useRestClient();
	const alerts = useContext(UserAlertsContext);
	const [uploading, setUploading] = useState<boolean>(false);
	const [file, setFile] = useState<File>();
	const [preview, setPreview] = useState<string>();

	useEffect(() => {
		if (file && file.type.startsWith("image/")) {
			setPreview(URL.createObjectURL(file));
		} else {
			setPreview(undefined);
		}
	}, [file]);

	const upload = useCallback(() => {
		if (!file) return;
		setUploading(true);
		restClient
			.images
			.uploadImage(file)
			.then((name) => onSelected(name))
			.catch((e) => {
				setUploading(false);
				alerts.err(e);
			});
	}, [restClient, alerts, onSelected, file]);

	return (
		<Modal show={true} onHide={onClose} size="xl">
			<Modal.Header closeButton className="align-items-start">
				<div>
					<Modal.Title>Nahrát obrázek</Modal.Title>
				</div>
			</Modal.Header>
			<Modal.Body className="p-0">
				<div>
					<div className="p-4">
						<div className="p-2 text-center">{preview && <Img url={preview} maxHeight={400} maxWidth={600}/>}</div>
						<Form>
							<Form.Control
								type="file"
								accept="image/*"
								onChange={(e) => {
									setFile(undefined);
									const filelist = (e.target as HTMLInputElement).files;
									if (!filelist) {
										alerts.err("No files selected!");
										return;
									}
									const file = filelist.item(0);
									if (!file) {
										alerts.err("No file selected!");
										return;
									}
									setFile(file);
								}}
							/>
						</Form>
					</div>
					<div className="text-center m-2">
						<SaveButton size="lg" loading={uploading} onClick={upload} disabled={file === undefined}>
							Nahrát
						</SaveButton>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
}
