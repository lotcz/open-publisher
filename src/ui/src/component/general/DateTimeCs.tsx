import DateUtilCs from "../../util/DateUtilCs";

export type DateTimeProps = {
	value?: Date | null;
};

export function DateTimeCs({value}: DateTimeProps) {
	return (
		<div className="text-nowrap">{DateUtilCs.formatDateTimeForHumans(value)}</div>
	);
}
