/**
 * date.utils
 */
/**
 * Creates a date with the given year, month, date, hour, minute and second. Does not allow over/under-flow of the
 * month and date.
 */
export declare function createDate(year: number, month: number, date: number, hours?: number, minutes?: number, seconds?: number): Date;
/**
 * Gets the number of days in the month of the given date.
 */
export declare function getNumDaysInMonth(date: Date): number;
