import {useCallback, useState} from "react";
import {Form, Spinner} from "react-bootstrap";
import {useRestClient} from "../../client/OpRestClient";

export type ImageUploadButtonProps = {
	label?: string | null;
	onSelected: (imageName: string) => any;
};

export function ImageUploadButton({label, onSelected}: ImageUploadButtonProps) {
	const restClient = useRestClient();
	const [uploading, setUploading] = useState<boolean>(false);

	const upload = useCallback(
		(file: File) => {
			if (!file) return;
			setUploading(true);
			restClient
				.uploadImage(file)
				.then((ih) => onSelected(ih))
				.catch((e) => console.error(e))
				.finally(() => setUploading(false));
		},
		[restClient, onSelected],
	);

	return (
		<div>
			<Form.Label htmlFor="image_upload_button" className="m-0">
				<div className="btn btn-primary btn-sm m-0 d-flex align-items-center gap-2">
					{uploading && <Spinner size="sm"/>}
					{label}
				</div>
			</Form.Label>
			<Form.Control
				id="image_upload_button"
				className="d-none"
				type="file"
				accept="image/*"
				onChange={(e) => {
					const filelist = (e.target as HTMLInputElement).files;
					if (!filelist) {
						return;
					}
					const file = filelist.item(0);
					if (!file) {
						return;
					}
					upload(file);
				}}
			/>
		</div>
	);
}
