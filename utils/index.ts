/**
 *
 * @param num
 * @returns formatted string or just the same number
 */
export const leftZeroPad = (num: number) => {
	if (num < 10) return `0${num}`
	return num
}
