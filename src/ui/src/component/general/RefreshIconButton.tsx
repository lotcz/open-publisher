import {IconButton} from "zavadil-react-common";
import {BsRepeat} from "react-icons/bs";

export type RefreshIconButtonProps = {
	onClick: () => any;
};

export default function RefreshIconButton({onClick}: RefreshIconButtonProps) {
	return <IconButton onClick={onClick} icon={<BsRepeat size={24}/>}/>
}

