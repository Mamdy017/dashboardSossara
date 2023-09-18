/**
 * calendar.component
 */
import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit } from '@angular/core';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OwlDateTimeFormats } from './adapter/date-time-format.class';
import { DateView, DateViewType, SelectMode } from './date-time.class';
import * as i0 from "@angular/core";
export declare class OwlCalendarComponent<T> implements OnInit, AfterContentInit, AfterViewChecked, OnDestroy {
    private elmRef;
    private pickerIntl;
    private ngZone;
    private cdRef;
    private dateTimeAdapter;
    private dateTimeFormats;
    DateView: typeof DateView;
    get minDate(): T | null;
    set minDate(value: T | null);
    get maxDate(): T | null;
    set maxDate(value: T | null);
    get pickerMoment(): T;
    set pickerMoment(value: T);
    get selected(): T | null;
    set selected(value: T | null);
    get selecteds(): T[];
    set selecteds(values: T[]);
    get periodButtonText(): string;
    get periodButtonLabel(): string;
    get prevButtonLabel(): string;
    get nextButtonLabel(): string;
    get currentView(): DateViewType;
    set currentView(view: DateViewType);
    get isInSingleMode(): boolean;
    get isInRangeMode(): boolean;
    get showControlArrows(): boolean;
    get isMonthView(): boolean;
    /**
     * Bind class 'owl-dt-calendar' to host
     * */
    get owlDTCalendarClass(): boolean;
    constructor(elmRef: ElementRef, pickerIntl: OwlDateTimeIntl, ngZone: NgZone, cdRef: ChangeDetectorRef, dateTimeAdapter: DateTimeAdapter<T>, dateTimeFormats: OwlDateTimeFormats);
    /**
     * Date filter for the month and year view
     * */
    dateFilter: (date: T) => boolean;
    /**
     * Set the first day of week
     */
    firstDayOfWeek: number;
    /** The minimum selectable date. */
    private _minDate;
    /** The maximum selectable date. */
    private _maxDate;
    /** The current picker moment */
    private _pickerMoment;
    selectMode: SelectMode;
    /** The currently selected moment. */
    private _selected;
    private _selecteds;
    /**
     * The view that the calendar should start in.
     */
    startView: DateViewType;
    /**
     * Whether to should only the year and multi-year views.
     */
    yearOnly: boolean;
    /**
     * Whether to should only the multi-year view.
     */
    multiyearOnly: boolean;
    /**
     * Whether to hide dates in other months at the start or end of the current month.
     * */
    hideOtherMonths: boolean;
    /** Emits when the currently picker moment changes. */
    pickerMomentChange: EventEmitter<T>;
    /** Emits when the selected date changes. */
    readonly dateClicked: EventEmitter<T>;
    /** Emits when the currently selected date changes. */
    readonly selectedChange: EventEmitter<T>;
    /** Emits when any date is selected. */
    readonly userSelection: EventEmitter<void>;
    /**
     * Emits the selected year. This doesn't imply a change on the selected date
     * */
    readonly yearSelected: EventEmitter<T>;
    /**
     * Emits the selected month. This doesn't imply a change on the selected date
     * */
    readonly monthSelected: EventEmitter<T>;
    private _currentView;
    private intlChangesSub;
    /**
     * Used for scheduling that focus should be moved to the active cell on the next tick.
     * We need to schedule it, rather than do it immediately, because we have to wait
     * for Angular to re-evaluate the view children.
     */
    private moveFocusOnNextTick;
    /**
     * Date filter for the month and year view
     */
    dateFilterForViews: (date: T) => boolean;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    /**
     * Toggle between month view and year view
     */
    toggleViews(): void;
    /**
     * Handles user clicks on the previous button.
     * */
    previousClicked(): void;
    /**
     * Handles user clicks on the next button.
     * */
    nextClicked(): void;
    dateSelected(date: T): void;
    /**
     * Change the pickerMoment value and switch to a specific view
     */
    goToDateInView(date: T, view: DateViewType): void;
    /**
     * Change the pickerMoment value
     */
    handlePickerMomentChange(date: T): void;
    userSelected(): void;
    /**
     * Whether the previous period button is enabled.
     */
    prevButtonEnabled(): boolean;
    /**
     * Whether the next period button is enabled.
     */
    nextButtonEnabled(): boolean;
    /**
     * Focus to the host element
     * */
    focusActiveCell(): void;
    selectYearInMultiYearView(normalizedYear: T): void;
    selectMonthInYearView(normalizedMonth: T): void;
    /**
     * Whether the two dates represent the same view in the current view mode (month or year).
     */
    private isSameView;
    /**
     * Get a valid date object
     */
    private getValidDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<OwlCalendarComponent<any>, [null, null, null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OwlCalendarComponent<any>, "owl-date-time-calendar", ["owlDateTimeCalendar"], { "minDate": "minDate"; "maxDate": "maxDate"; "pickerMoment": "pickerMoment"; "selected": "selected"; "selecteds": "selecteds"; "dateFilter": "dateFilter"; "firstDayOfWeek": "firstDayOfWeek"; "selectMode": "selectMode"; "startView": "startView"; "yearOnly": "yearOnly"; "multiyearOnly": "multiyearOnly"; "hideOtherMonths": "hideOtherMonths"; }, { "pickerMomentChange": "pickerMomentChange"; "dateClicked": "dateClicked"; "selectedChange": "selectedChange"; "userSelection": "userSelection"; "yearSelected": "yearSelected"; "monthSelected": "monthSelected"; }, never, never>;
}
