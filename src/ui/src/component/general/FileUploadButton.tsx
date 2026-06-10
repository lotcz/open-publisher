import {useMemo} from "react";
import {Form} from "react-bootstrap";
import {StringUtil} from "zavadil-ts-common";

export type FileUploadButtonProps = {
	id?: string;
	accept?: string;
	label?: string;
	onSelected: (file: File) => any;
};

export function FileUploadButton({id, label = "...", onSelected, accept = "*"}: FileUploadButtonProps) {
	const finalId = useMemo(() => id || StringUtil.randomString(), [id]);

	return (
		<div>
			<Form.Label htmlFor={finalId} className="m-0">
				<div className="btn btn-primary btn-sm m-0 d-flex align-items-center gap-2">
					{label}
				</div>
			</Form.Label>
			<Form.Control
				id={finalId}
				className="d-none"
				type="file"
				accept={accept}
				onChange={(e) => {
					const filelist = (e.target as HTMLInputElement).files;
					if (!filelist) {
						return;
					}
					const file = filelist.item(0);
					if (!file) {
						return;
					}
					onSelected(file);
				}}
			/>
		</div>
	);
}
