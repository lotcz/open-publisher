import {Destination} from "../types/Destination";

export default class ArticlePreviewUtil {
	static getStyle(destination: Destination): React.CSSProperties {
		return {
			"--preview-background-color": destination.previewBgColor,
			"--preview-text-color": destination.previewTextColor,
			"--preview-font-family": destination.previewFontFamily,
			"--preview-link-color": destination.previewLinkColor,

		} as React.CSSProperties
	}
}
