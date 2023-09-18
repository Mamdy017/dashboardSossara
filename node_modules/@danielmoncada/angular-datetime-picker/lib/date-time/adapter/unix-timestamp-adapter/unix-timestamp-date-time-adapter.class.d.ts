import { DateTimeAdapter } from '../date-time-adapter.class';
import { Platform } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
export declare class UnixTimestampDateTimeAdapter extends DateTimeAdapter<number> {
    private owlDateTimeLocale;
    constructor(owlDateTimeLocale: string, platform: Platform);
    /** Whether to clamp the date between 1 and 9999 to avoid IE and Edge errors. */
    private readonly _clampDate;
    /**
     * Whether to use `timeZone: 'utc'` with `Intl.DateTimeFormat` when formatting dates.
     * Without this `Intl.DateTimeFormat` sometimes chooses the wrong timeZone, which can throw off
     * the result. (e.g. in the en-US locale `new Date(1800, 7, 14).toLocaleDateString()`
     * will produce `'8/13/1800'`.
     */
    useUtcForDisplay: boolean;
    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     */
    private static search_ltr_rtl_pattern;
    private static stripDirectionalityCharacters;
    /**
     * When converting Date object to string, javascript built-in functions may return wrong
     * results because it applies its internal DST rules. The DST rules around the world change
     * very frequently, and the current valid rule is not always valid in previous years though.
     * We work around this problem building a new Date object which has its internal UTC
     * representation with the local date and time.
     */
    private static _format;
    addCalendarDays(date: number, amount: number): number;
    addCalendarMonths(date: number, amount: number): number;
    addCalendarYears(date: number, amount: number): number;
    clone(date: number): number;
    createDate(year: number, month: number, date: number, hours?: number, minutes?: number, seconds?: number): number;
    differenceInCalendarDays(dateLeft: number, dateRight: number): number;
    format(date: number, displayFormat: any): string;
    getDate(date: number): number;
    getDateNames(): string[];
    getDay(date: number): number;
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[];
    getHours(date: number): number;
    getMinutes(date: number): number;
    getMonth(date: number): number;
    getMonthNames(style: 'long' | 'short' | 'narrow'): string[];
    getNumDaysInMonth(date: number): number;
    getSeconds(date: number): number;
    getTime(date: number): number;
    getYear(date: number): number;
    getYearName(date: number): string;
    invalid(): number;
    isDateInstance(obj: any): boolean;
    isEqual(dateLeft: number, dateRight: number): boolean;
    isSameDay(dateLeft: number, dateRight: number): boolean;
    isValid(date: number): boolean;
    now(): number;
    parse(value: any, parseFormat: any): number | null;
    setHours(date: number, amount: number): number;
    setMinutes(date: number, amount: number): number;
    setSeconds(date: number, amount: number): number;
    toIso8601(date: number): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<UnixTimestampDateTimeAdapter, [{ optional: true; }, null]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UnixTimestampDateTimeAdapter>;
}
