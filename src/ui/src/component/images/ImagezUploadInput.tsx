import {Form} from "react-bootstrap";
import {StringUtil} from "zavadil-ts-common";
import {ImageUploadButton} from "./ImageUploadButton";
import {ArticleImageThumb} from "./ArticleImage";

export type ImageUploadInputProps = {
	imageName?: string | null;
	onSelected: (imageName: string) => any;
};

export function ImageUploadInput({imageName, onSelected}: ImageUploadInputProps) {
	return <div>
		<div className="d-flex gap-2 align-items-center">
			{
				imageName && <ArticleImageThumb name={imageName}/>
			}
			<Form.Control
				type="text"
				disabled={true}
				value={StringUtil.getNonEmpty(imageName)}
			/>
			<ImageUploadButton
				label="..."
				onSelected={onSelected}
			/>
		</div>
	</div>
}
