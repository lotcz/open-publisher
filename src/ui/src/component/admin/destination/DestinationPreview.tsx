import {useMemo} from "react";
import {Destination} from "../../../types/Destination";
import ArticlePreviewUtil from "../../../util/ArticlePreviewUtil";

export type DestinationPreviewParams = {
	destination: Destination;
};

export default function DestinationPreview({destination}: DestinationPreviewParams) {
	const style = useMemo(() => ArticlePreviewUtil.getStyle(destination), [destination])

	return <div className="article-preview p-3" style={style}>
		<h2>Náhled článku {destination.name}</h2>
		<p>Lorem ipsum dolor sit <a href="#">amet</a>, consectetur adipiscing elit. Cras in sollicitudin metus. In hac habitasse platea dictumst.
			Pellentesque
			ultricies varius enim et feugiat. Vivamus vitae feugiat odio, nec molestie neque. In cursus dictum odio mattis ultricies. Pellentesque
			posuere est in elit aliquam, eu molestie justo maximus. Pellentesque viverra convallis semper. Nunc condimentum dui vel nunc interdum,
			eget interdum lacus aliquet. Integer mollis posuere faucibus.</p>
		<p>Maecenas ornare bibendum neque, vitae cursus nibh lobortis a. Proin lobortis velit turpis, et condimentum elit dapibus eget. Proin ut
			ullamcorper tortor, ac <a href="#">pellentesque</a> tellus. Nunc ipsum dolor, ornare vitae consectetur sed, tincidunt nec ipsum. Mauris id
			nibh
			quis urna
			condimentum tempus blandit sed nisl. Mauris sit amet lacinia mi, eu interdum purus. Nulla eu bibendum ex. Nullam sodales dolor in dui
			fermentum, sed rhoncus est <a href="#">condimentum</a>. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
			turpis egestas.
			Donec et volutpat sapien. Morbi pulvinar viverra turpis, eu condimentum metus viverra et. Pellentesque iaculis suscipit magna, in
			hendrerit elit iaculis in. In nec mattis nibh, quis mollis felis. Aliquam dolor quam, porta vel orci eu, posuere lacinia quam. Mauris
			pulvinar sem volutpat convallis semper. Phasellus nec lacus lectus. </p>
	</div>
}
