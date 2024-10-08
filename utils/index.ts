/**
 *
 * @param num
 * @returns formatted string or just the same number
 */
export function leftZeroPad(num: number): string | number {
	return num < 10 ? `0${num}` : num
}

/**
 *
 * @param date
 * @returns formatted date
 */
export function getFormattedDate(date: Date): string {
	return `${date.getFullYear()}-${leftZeroPad(date.getMonth() + 1)}-${leftZeroPad(date.getDate())}`
}
