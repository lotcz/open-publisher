import {EntityWithName} from "zavadil-ts-common";

export type Destination = EntityWithName & {
	isActive: boolean;
	headerLevel: number;
	previewWidthPx: number;
	previewBgColor: string;
	previewTextColor: string;
	previewLinkColor: string;
	previewFontFamily: string;
}
