import {Spinner} from "react-bootstrap";
import {BsImage} from "react-icons/bs";

export type ImgProps = {
	url?: string | null;
	alt?: string | null;
	maxWidth?: number;
	maxHeight?: number;
};

export function Img({url, alt, maxWidth, maxHeight}: ImgProps) {
	if (url === undefined) return <Spinner size="sm"/>
	if (url === null) return <BsImage size="15"/>
	return <img
		className="img"
		src={url}
		alt={alt || 'image'}
		style={{maxHeight, maxWidth}}
		draggable={false}
		crossOrigin="anonymous"
	/>
}
