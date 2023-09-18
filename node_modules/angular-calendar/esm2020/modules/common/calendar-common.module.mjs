import { NgModule } from '@angular/core';
import { CommonModule, I18nPluralPipe } from '@angular/common';
import { CalendarEventActionsComponent } from './calendar-event-actions.component';
import { CalendarEventTitleComponent } from './calendar-event-title.component';
import { CalendarTooltipDirective, CalendarTooltipWindowComponent, } from './calendar-tooltip.directive';
import { CalendarPreviousViewDirective } from './calendar-previous-view.directive';
import { CalendarNextViewDirective } from './calendar-next-view.directive';
import { CalendarTodayDirective } from './calendar-today.directive';
import { CalendarDatePipe } from './calendar-date.pipe';
import { CalendarEventTitlePipe } from './calendar-event-title.pipe';
import { ClickDirective } from './click.directive';
import { KeydownEnterDirective } from './keydown-enter.directive';
import { CalendarEventTitleFormatter } from './calendar-event-title-formatter.provider';
import { CalendarDateFormatter } from './calendar-date-formatter.provider';
import { CalendarUtils } from './calendar-utils.provider';
import { CalendarA11y } from './calendar-a11y.provider';
import { CalendarA11yPipe } from './calendar-a11y.pipe';
import * as i0 from "@angular/core";
export * from './calendar-event-title-formatter.provider';
export * from './calendar-moment-date-formatter.provider';
export * from './calendar-native-date-formatter.provider';
export * from './calendar-angular-date-formatter.provider';
export * from './calendar-date-formatter.provider';
export * from './calendar-utils.provider';
export * from './calendar-a11y.provider';
export * from './calendar-a11y.interface';
export * from './calendar-date-formatter.interface';
export * from './calendar-event-times-changed-event.interface';
export * from '../../date-adapters/date-adapter';
export * from './calendar-view.enum';
// needed for ivy, not part of the public api
export { CalendarEventActionsComponent as ɵCalendarEventActionsComponent } from './calendar-event-actions.component';
export { CalendarEventTitleComponent as ɵCalendarEventTitleComponent } from './calendar-event-title.component';
export { CalendarTooltipDirective as ɵCalendarTooltipDirective, CalendarTooltipWindowComponent as ɵCalendarTooltipWindowComponent, } from './calendar-tooltip.directive';
export { CalendarPreviousViewDirective as ɵCalendarPreviousViewDirective } from './calendar-previous-view.directive';
export { CalendarNextViewDirective as ɵCalendarNextViewDirective } from './calendar-next-view.directive';
export { CalendarTodayDirective as ɵCalendarTodayDirective } from './calendar-today.directive';
export { CalendarDatePipe as ɵCalendarDatePipe } from './calendar-date.pipe';
export { CalendarEventTitlePipe as ɵCalendarEventTitlePipe } from './calendar-event-title.pipe';
export { ClickDirective as ɵClickDirective } from './click.directive';
export { KeydownEnterDirective as ɵKeydownEnterDirective } from './keydown-enter.directive';
export { CalendarA11yPipe as ɵCalendarA11yPipe } from './calendar-a11y.pipe';
export { DAYS_OF_WEEK, } from 'calendar-utils';
/**
 * Import this module to if you're just using a singular view and want to save on bundle size. Example usage:
 *
 * ```typescript
 * import { CalendarCommonModule, CalendarMonthModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalendarCommonModule.forRoot(),
 *     CalendarMonthModule
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
export class CalendarCommonModule {
    static forRoot(dateAdapter, config = {}) {
        return {
            ngModule: CalendarCommonModule,
            providers: [
                dateAdapter,
                config.eventTitleFormatter || CalendarEventTitleFormatter,
                config.dateFormatter || CalendarDateFormatter,
                config.utils || CalendarUtils,
                config.a11y || CalendarA11y,
            ],
        };
    }
}
CalendarCommonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarCommonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CalendarCommonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.1.2", ngImport: i0, type: CalendarCommonModule, declarations: [CalendarEventActionsComponent,
        CalendarEventTitleComponent,
        CalendarTooltipWindowComponent,
        CalendarTooltipDirective,
        CalendarPreviousViewDirective,
        CalendarNextViewDirective,
        CalendarTodayDirective,
        CalendarDatePipe,
        CalendarEventTitlePipe,
        CalendarA11yPipe,
        ClickDirective,
        KeydownEnterDirective], imports: [CommonModule], exports: [CalendarEventActionsComponent,
        CalendarEventTitleComponent,
        CalendarTooltipWindowComponent,
        CalendarTooltipDirective,
        CalendarPreviousViewDirective,
        CalendarNextViewDirective,
        CalendarTodayDirective,
        CalendarDatePipe,
        CalendarEventTitlePipe,
        CalendarA11yPipe,
        ClickDirective,
        KeydownEnterDirective] });
CalendarCommonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarCommonModule, providers: [I18nPluralPipe], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarCommonModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        CalendarEventActionsComponent,
                        CalendarEventTitleComponent,
                        CalendarTooltipWindowComponent,
                        CalendarTooltipDirective,
                        CalendarPreviousViewDirective,
                        CalendarNextViewDirective,
                        CalendarTodayDirective,
                        CalendarDatePipe,
                        CalendarEventTitlePipe,
                        CalendarA11yPipe,
                        ClickDirective,
                        KeydownEnterDirective,
                    ],
                    imports: [CommonModule],
                    exports: [
                        CalendarEventActionsComponent,
                        CalendarEventTitleComponent,
                        CalendarTooltipWindowComponent,
                        CalendarTooltipDirective,
                        CalendarPreviousViewDirective,
                        CalendarNextViewDirective,
                        CalendarTodayDirective,
                        CalendarDatePipe,
                        CalendarEventTitlePipe,
                        CalendarA11yPipe,
                        ClickDirective,
                        KeydownEnterDirective,
                    ],
                    providers: [I18nPluralPipe],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItY29tbW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2FsZW5kYXIvc3JjL21vZHVsZXMvY29tbW9uL2NhbGVuZGFyLWNvbW1vbi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNuRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQ0wsd0JBQXdCLEVBQ3hCLDhCQUE4QixHQUMvQixNQUFNLDhCQUE4QixDQUFDO0FBQ3RDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ25GLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUN4RixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFB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RTt3QkFDWiw2QkFBNkI7d0JBQzdCLDJCQUEyQjt3QkFDM0IsOEJBQThCO3dCQUM5Qix3QkFBd0I7d0JBQ3hCLDZCQUE2Qjt3QkFDN0IseUJBQXlCO3dCQUN6QixzQkFBc0I7d0JBQ3RCLGdCQUFnQjt3QkFDaEIsc0JBQXNCO3dCQUN0QixnQkFBZ0I7d0JBQ2hCLGNBQWM7d0JBQ2QscUJBQXFCO3FCQUN0QjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRTt3QkFDUCw2QkFBNkI7d0JBQzdCLDJCQUEyQjt3QkFDM0IsOEJBQThCO3dCQUM5Qix3QkFBd0I7d0JBQ3hCLDZCQUE2Qjt3QkFDN0IseUJBQXlCO3dCQUN6QixzQkFBc0I7d0JBQ3RCLGdCQUFnQjt3QkFDaEIsc0JBQXNCO3dCQUN0QixnQkFBZ0I7d0JBQ2hCLGNBQWM7d0JBQ2QscUJBQXFCO3FCQUN0QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxjQUFjLENBQUM7aUJBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIEkxOG5QbHVyYWxQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnRBY3Rpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1ldmVudC1hY3Rpb25zLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50VGl0bGVDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLWV2ZW50LXRpdGxlLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBDYWxlbmRhclRvb2x0aXBEaXJlY3RpdmUsXG4gIENhbGVuZGFyVG9vbHRpcFdpbmRvd0NvbXBvbmVudCxcbn0gZnJvbSAnLi9jYWxlbmRhci10b29sdGlwLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDYWxlbmRhclByZXZpb3VzVmlld0RpcmVjdGl2ZSB9IGZyb20gJy4vY2FsZW5kYXItcHJldmlvdXMtdmlldy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJOZXh0Vmlld0RpcmVjdGl2ZSB9IGZyb20gJy4vY2FsZW5kYXItbmV4dC12aWV3LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDYWxlbmRhclRvZGF5RGlyZWN0aXZlIH0gZnJvbSAnLi9jYWxlbmRhci10b2RheS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJEYXRlUGlwZSB9IGZyb20gJy4vY2FsZW5kYXItZGF0ZS5waXBlJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnRUaXRsZVBpcGUgfSBmcm9tICcuL2NhbGVuZGFyLWV2ZW50LXRpdGxlLnBpcGUnO1xuaW1wb3J0IHsgQ2xpY2tEaXJlY3RpdmUgfSBmcm9tICcuL2NsaWNrLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBLZXlkb3duRW50ZXJEaXJlY3RpdmUgfSBmcm9tICcuL2tleWRvd24tZW50ZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnRUaXRsZUZvcm1hdHRlciB9IGZyb20gJy4vY2FsZW5kYXItZXZlbnQtdGl0bGUtZm9ybWF0dGVyLnByb3ZpZGVyJztcbmltcG9ydCB7IENhbGVuZGFyRGF0ZUZvcm1hdHRlciB9IGZyb20gJy4vY2FsZW5kYXItZGF0ZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuaW1wb3J0IHsgQ2FsZW5kYXJVdGlscyB9IGZyb20gJy4vY2FsZW5kYXItdXRpbHMucHJvdmlkZXInO1xuaW1wb3J0IHsgQ2FsZW5kYXJBMTF5IH0gZnJvbSAnLi9jYWxlbmRhci1hMTF5LnByb3ZpZGVyJztcbmltcG9ydCB7IENhbGVuZGFyQTExeVBpcGUgfSBmcm9tICcuL2NhbGVuZGFyLWExMXkucGlwZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsZW5kYXJNb2R1bGVDb25maWcge1xuICBldmVudFRpdGxlRm9ybWF0dGVyPzogUHJvdmlkZXI7XG4gIGRhdGVGb3JtYXR0ZXI/OiBQcm92aWRlcjtcbiAgdXRpbHM/OiBQcm92aWRlcjtcbiAgYTExeT86IFByb3ZpZGVyO1xufVxuXG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLWV2ZW50LXRpdGxlLWZvcm1hdHRlci5wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLW1vbWVudC1kYXRlLWZvcm1hdHRlci5wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLW5hdGl2ZS1kYXRlLWZvcm1hdHRlci5wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLWFuZ3VsYXItZGF0ZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci1kYXRlLWZvcm1hdHRlci5wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLXV0aWxzLnByb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItYTExeS5wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLWExMXkuaW50ZXJmYWNlJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItZGF0ZS1mb3JtYXR0ZXIuaW50ZXJmYWNlJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItZXZlbnQtdGltZXMtY2hhbmdlZC1ldmVudC5pbnRlcmZhY2UnO1xuZXhwb3J0ICogZnJvbSAnLi4vLi4vZGF0ZS1hZGFwdGVycy9kYXRlLWFkYXB0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci12aWV3LmVudW0nO1xuXG4vLyBuZWVkZWQgZm9yIGl2eSwgbm90IHBhcnQgb2YgdGhlIHB1YmxpYyBhcGlcbmV4cG9ydCB7IENhbGVuZGFyRXZlbnRBY3Rpb25zQ29tcG9uZW50IGFzIMm1Q2FsZW5kYXJFdmVudEFjdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLWV2ZW50LWFjdGlvbnMuY29tcG9uZW50JztcbmV4cG9ydCB7IENhbGVuZGFyRXZlbnRUaXRsZUNvbXBvbmVudCBhcyDJtUNhbGVuZGFyRXZlbnRUaXRsZUNvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItZXZlbnQtdGl0bGUuY29tcG9uZW50JztcbmV4cG9ydCB7XG4gIENhbGVuZGFyVG9vbHRpcERpcmVjdGl2ZSBhcyDJtUNhbGVuZGFyVG9vbHRpcERpcmVjdGl2ZSxcbiAgQ2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50IGFzIMm1Q2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50LFxufSBmcm9tICcuL2NhbGVuZGFyLXRvb2x0aXAuZGlyZWN0aXZlJztcbmV4cG9ydCB7IENhbGVuZGFyUHJldmlvdXNWaWV3RGlyZWN0aXZlIGFzIMm1Q2FsZW5kYXJQcmV2aW91c1ZpZXdEaXJlY3RpdmUgfSBmcm9tICcuL2NhbGVuZGFyLXByZXZpb3VzLXZpZXcuZGlyZWN0aXZlJztcbmV4cG9ydCB7IENhbGVuZGFyTmV4dFZpZXdEaXJlY3RpdmUgYXMgybVDYWxlbmRhck5leHRWaWV3RGlyZWN0aXZlIH0gZnJvbSAnLi9jYWxlbmRhci1uZXh0LXZpZXcuZGlyZWN0aXZlJztcbmV4cG9ydCB7IENhbGVuZGFyVG9kYXlEaXJlY3RpdmUgYXMgybVDYWxlbmRhclRvZGF5RGlyZWN0aXZlIH0gZnJvbSAnLi9jYWxlbmRhci10b2RheS5kaXJlY3RpdmUnO1xuZXhwb3J0IHsgQ2FsZW5kYXJEYXRlUGlwZSBhcyDJtUNhbGVuZGFyRGF0ZVBpcGUgfSBmcm9tICcuL2NhbGVuZGFyLWRhdGUucGlwZSc7XG5leHBvcnQgeyBDYWxlbmRhckV2ZW50VGl0bGVQaXBlIGFzIMm1Q2FsZW5kYXJFdmVudFRpdGxlUGlwZSB9IGZyb20gJy4vY2FsZW5kYXItZXZlbnQtdGl0bGUucGlwZSc7XG5leHBvcnQgeyBDbGlja0RpcmVjdGl2ZSBhcyDJtUNsaWNrRGlyZWN0aXZlIH0gZnJvbSAnLi9jbGljay5kaXJlY3RpdmUnO1xuZXhwb3J0IHsgS2V5ZG93bkVudGVyRGlyZWN0aXZlIGFzIMm1S2V5ZG93bkVudGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9rZXlkb3duLWVudGVyLmRpcmVjdGl2ZSc7XG5leHBvcnQgeyBDYWxlbmRhckExMXlQaXBlIGFzIMm1Q2FsZW5kYXJBMTF5UGlwZSB9IGZyb20gJy4vY2FsZW5kYXItYTExeS5waXBlJztcblxuZXhwb3J0IHtcbiAgQ2FsZW5kYXJFdmVudCxcbiAgRXZlbnRBY3Rpb24gYXMgQ2FsZW5kYXJFdmVudEFjdGlvbixcbiAgREFZU19PRl9XRUVLLFxuICBWaWV3UGVyaW9kIGFzIENhbGVuZGFyVmlld1BlcmlvZCxcbn0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuXG4vKipcbiAqIEltcG9ydCB0aGlzIG1vZHVsZSB0byBpZiB5b3UncmUganVzdCB1c2luZyBhIHNpbmd1bGFyIHZpZXcgYW5kIHdhbnQgdG8gc2F2ZSBvbiBidW5kbGUgc2l6ZS4gRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBDYWxlbmRhckNvbW1vbk1vZHVsZSwgQ2FsZW5kYXJNb250aE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXItY2FsZW5kYXInO1xuICpcbiAqIEBOZ01vZHVsZSh7XG4gKiAgIGltcG9ydHM6IFtcbiAqICAgICBDYWxlbmRhckNvbW1vbk1vZHVsZS5mb3JSb290KCksXG4gKiAgICAgQ2FsZW5kYXJNb250aE1vZHVsZVxuICogICBdXG4gKiB9KVxuICogY2xhc3MgTXlNb2R1bGUge31cbiAqIGBgYFxuICpcbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ2FsZW5kYXJFdmVudEFjdGlvbnNDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJFdmVudFRpdGxlQ29tcG9uZW50LFxuICAgIENhbGVuZGFyVG9vbHRpcFdpbmRvd0NvbXBvbmVudCxcbiAgICBDYWxlbmRhclRvb2x0aXBEaXJlY3RpdmUsXG4gICAgQ2FsZW5kYXJQcmV2aW91c1ZpZXdEaXJlY3RpdmUsXG4gICAgQ2FsZW5kYXJOZXh0Vmlld0RpcmVjdGl2ZSxcbiAgICBDYWxlbmRhclRvZGF5RGlyZWN0aXZlLFxuICAgIENhbGVuZGFyRGF0ZVBpcGUsXG4gICAgQ2FsZW5kYXJFdmVudFRpdGxlUGlwZSxcbiAgICBDYWxlbmRhckExMXlQaXBlLFxuICAgIENsaWNrRGlyZWN0aXZlLFxuICAgIEtleWRvd25FbnRlckRpcmVjdGl2ZSxcbiAgXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBDYWxlbmRhckV2ZW50QWN0aW9uc0NvbXBvbmVudCxcbiAgICBDYWxlbmRhckV2ZW50VGl0bGVDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50LFxuICAgIENhbGVuZGFyVG9vbHRpcERpcmVjdGl2ZSxcbiAgICBDYWxlbmRhclByZXZpb3VzVmlld0RpcmVjdGl2ZSxcbiAgICBDYWxlbmRhck5leHRWaWV3RGlyZWN0aXZlLFxuICAgIENhbGVuZGFyVG9kYXlEaXJlY3RpdmUsXG4gICAgQ2FsZW5kYXJEYXRlUGlwZSxcbiAgICBDYWxlbmRhckV2ZW50VGl0bGVQaXBlLFxuICAgIENhbGVuZGFyQTExeVBpcGUsXG4gICAgQ2xpY2tEaXJlY3RpdmUsXG4gICAgS2V5ZG93bkVudGVyRGlyZWN0aXZlLFxuICBdLFxuICBwcm92aWRlcnM6IFtJMThuUGx1cmFsUGlwZV0sXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyQ29tbW9uTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoXG4gICAgZGF0ZUFkYXB0ZXI6IFByb3ZpZGVyLFxuICAgIGNvbmZpZzogQ2FsZW5kYXJNb2R1bGVDb25maWcgPSB7fVxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPENhbGVuZGFyQ29tbW9uTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBDYWxlbmRhckNvbW1vbk1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICBkYXRlQWRhcHRlcixcbiAgICAgICAgY29uZmlnLmV2ZW50VGl0bGVGb3JtYXR0ZXIgfHwgQ2FsZW5kYXJFdmVudFRpdGxlRm9ybWF0dGVyLFxuICAgICAgICBjb25maWcuZGF0ZUZvcm1hdHRlciB8fCBDYWxlbmRhckRhdGVGb3JtYXR0ZXIsXG4gICAgICAgIGNvbmZpZy51dGlscyB8fCBDYWxlbmRhclV0aWxzLFxuICAgICAgICBjb25maWcuYTExeSB8fCBDYWxlbmRhckExMXksXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==