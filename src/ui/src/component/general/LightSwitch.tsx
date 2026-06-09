import {useContext} from "react";
import {BsMoonFill, BsSunFill} from "react-icons/bs";
import {IconSwitch} from "zavadil-react-common";
import {UserSessionUpdateContext, useUserSession} from "../../util/UserSession";

export default function LightSwitch() {
	const session = useUserSession();
	const sessionUpdate = useContext(UserSessionUpdateContext);
	const isDark = session.theme === "dark";

	return (
		<IconSwitch
			checked={!isDark}
			onChange={() => {
				session.theme = isDark ? "light" : "dark";
				if (sessionUpdate) sessionUpdate({...session});
			}}

			iconOn={<BsSunFill/>}
			iconOff={<BsMoonFill/>}
		/>
	);
}

