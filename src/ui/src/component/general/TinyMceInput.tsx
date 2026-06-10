import {Editor} from "@tinymce/tinymce-react";
import {useCallback, useMemo} from "react";
import {useRestClient} from "../../client/OpRestClient";
import {useUserSession} from "../../util/UserSession";

export type TinyMceInputProps = {
	initialValue: string;
	onChange: (value: string) => any;
};

export default function TinyMceInput({initialValue, onChange}: TinyMceInputProps) {
	const value = useMemo(() => initialValue, []);
	const restClient = useRestClient();
	const userSession = useUserSession();

	const imageUploadHandler = useCallback(
		(blobInfo: any, progress: any) => {
			return restClient.images.uploadTinyMceImage(blobInfo)
				.catch((error) => {
					throw new Error(`Image upload failed: ${error.message}`);
				});
		},
		[restClient]
	);

	return <Editor
		initialValue={value}
		tinymceScriptSrc="https://zavadil.eu/tinymce8/tinymce.min.js"
		licenseKey="gpl"
		init={{
			promotion: false,
			branding: false,
			language: 'cs',
			plugins: 'advlist autolink lists link image fullscreen',
			toolbar: 'undo redo | bold italic | image | bullist numlist | fullscreen',
			skin: userSession.theme === 'dark' ? 'oxide-dark' : undefined,
			images_upload_handler: imageUploadHandler
		}}
		onEditorChange={(evt, editor) => onChange(editor.getContent())}
	/>
}
