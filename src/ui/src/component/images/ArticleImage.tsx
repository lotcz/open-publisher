import {useMemo} from "react";
import {Img} from "./Img";
import {Spinner} from "react-bootstrap";
import {useRestClient} from "../../client/OpRestClient";

export type ArticleImageProps = {
	name?: string | null;
	size: string;
};

export function ArticleImage({name, size}: ArticleImageProps) {
	const restClient = useRestClient();
	const url = useMemo<URL | null>(
		() => {
			if (!name) return null;
			return new URL(`images/${name}/${size}`, restClient.getBaseUrl());
		},
		[restClient, name, size]
	);

	if (!url) return <Spinner size="sm"/>;

	return <Img url={url.toString()}/>;
}

export type ImageResizedProps = {
	name?: string | null;
};

export function ArticleImageThumb({name}: ImageResizedProps) {
	return <ArticleImage name={name} size="thumb"/>;
}

export function ArticleImagePreview({name}: ImageResizedProps) {
	return <ArticleImage name={name} size="preview"/>;
}

export function ArticleImageView({name}: ImageResizedProps) {
	return <ArticleImage name={name} size="view"/>;
}
