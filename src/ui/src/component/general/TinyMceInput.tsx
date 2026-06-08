import {Editor} from "@tinymce/tinymce-react";
import {useMemo} from "react";

export type TinyMceInputProps = {
	initialValue: string;
	onChange: (value: string) => any;
};

export default function TinyMceInput({initialValue, onChange}: TinyMceInputProps) {
	const value = useMemo(() => initialValue, []);
	return <Editor
		initialValue={value}
		tinymceScriptSrc="https://zavadil.eu/tinymce8/tinymce.min.js"
		licenseKey="gpl"
		init={{
			promotion: false,
			branding: false,
			plugins: 'advlist autolink lists link image',
			toolbar: 'undo redo | bold italic | bullist numlist',
		}}
		onInput={(evt, editor) => onChange(editor.getContent())}
	/>
}
