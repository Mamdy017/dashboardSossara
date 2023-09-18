import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { CalendarMonthViewComponent } from './calendar-month-view.component';
import { CalendarMonthViewHeaderComponent } from './calendar-month-view-header.component';
import { CalendarMonthCellComponent } from './calendar-month-cell.component';
import { CalendarOpenDayEventsComponent } from './calendar-open-day-events.component';
import { CalendarCommonModule } from '../common/calendar-common.module';
import * as i0 from "@angular/core";
export { CalendarMonthViewComponent, } from './calendar-month-view.component';
export { collapseAnimation } from './calendar-open-day-events.component';
// needed for ivy, not part of the public api
export { CalendarMonthCellComponent as ɵCalendarMonthCellComponent } from './calendar-month-cell.component';
export { CalendarMonthViewHeaderComponent as ɵCalendarMonthViewHeaderComponent } from './calendar-month-view-header.component';
export { CalendarOpenDayEventsComponent as ɵCalendarOpenDayEventsComponent } from './calendar-open-day-events.component';
export class CalendarMonthModule {
}
CalendarMonthModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarMonthModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CalendarMonthModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.1.2", ngImport: i0, type: CalendarMonthModule, declarations: [CalendarMonthViewComponent,
        CalendarMonthCellComponent,
        CalendarOpenDayEventsComponent,
        CalendarMonthViewHeaderComponent], imports: [CommonModule, DragAndDropModule, CalendarCommonModule], exports: [DragAndDropModule,
        CalendarMonthViewComponent,
        CalendarMonthCellComponent,
        CalendarOpenDayEventsComponent,
        CalendarMonthViewHeaderComponent] });
CalendarMonthModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarMonthModule, imports: [CommonModule, DragAndDropModule, CalendarCommonModule, DragAndDropModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarMonthModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, DragAndDropModule, CalendarCommonModule],
                    declarations: [
                        CalendarMonthViewComponent,
                        CalendarMonthCellComponent,
                        CalendarOpenDayEventsComponent,
                        CalendarMonthViewHeaderComponent,
                    ],
                    exports: [
                        DragAndDropModule,
                        CalendarMonthViewComponent,
                        CalendarMonthCellComponent,
                        CalendarOpenDayEventsComponent,
                        CalendarMonthViewHeaderComponent,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbW9udGgubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jYWxlbmRhci9zcmMvbW9kdWxlcy9tb250aC9jYWxlbmRhci1tb250aC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDaEUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDMUYsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdEYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7O0FBRXhFLE9BQU8sRUFDTCwwQkFBMEIsR0FHM0IsTUFBTSxpQ0FBaUMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUV6RSw2Q0FBNkM7QUFDN0MsT0FBTyxFQUFFLDBCQUEwQixJQUFJLDJCQUEyQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDNUcsT0FBTyxFQUFFLGdDQUFnQyxJQUFJLGlDQUFpQyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDL0gsT0FBTyxFQUFFLDhCQUE4QixJQUFJLCtCQUErQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFrQnpILE1BQU0sT0FBTyxtQkFBbUI7O2dIQUFuQixtQkFBbUI7aUhBQW5CLG1CQUFtQixpQkFiNUIsMEJBQTBCO1FBQzFCLDBCQUEwQjtRQUMxQiw4QkFBOEI7UUFDOUIsZ0NBQWdDLGFBTHhCLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxvQkFBb0IsYUFRN0QsaUJBQWlCO1FBQ2pCLDBCQUEwQjtRQUMxQiwwQkFBMEI7UUFDMUIsOEJBQThCO1FBQzlCLGdDQUFnQztpSEFHdkIsbUJBQW1CLFlBZnBCLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxvQkFBb0IsRUFRN0QsaUJBQWlCOzJGQU9SLG1CQUFtQjtrQkFoQi9CLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGlCQUFpQixFQUFFLG9CQUFvQixDQUFDO29CQUNoRSxZQUFZLEVBQUU7d0JBQ1osMEJBQTBCO3dCQUMxQiwwQkFBMEI7d0JBQzFCLDhCQUE4Qjt3QkFDOUIsZ0NBQWdDO3FCQUNqQztvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsaUJBQWlCO3dCQUNqQiwwQkFBMEI7d0JBQzFCLDBCQUEwQjt3QkFDMUIsOEJBQThCO3dCQUM5QixnQ0FBZ0M7cUJBQ2pDO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEcmFnQW5kRHJvcE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZSc7XG5pbXBvcnQgeyBDYWxlbmRhck1vbnRoVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItbW9udGgtdmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FsZW5kYXJNb250aFZpZXdIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLW1vbnRoLXZpZXctaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhck1vbnRoQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItbW9udGgtY2VsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FsZW5kYXJPcGVuRGF5RXZlbnRzQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1vcGVuLWRheS1ldmVudHMuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyQ29tbW9uTW9kdWxlIH0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLWNvbW1vbi5tb2R1bGUnO1xuXG5leHBvcnQge1xuICBDYWxlbmRhck1vbnRoVmlld0NvbXBvbmVudCxcbiAgQ2FsZW5kYXJNb250aFZpZXdCZWZvcmVSZW5kZXJFdmVudCxcbiAgQ2FsZW5kYXJNb250aFZpZXdFdmVudFRpbWVzQ2hhbmdlZEV2ZW50LFxufSBmcm9tICcuL2NhbGVuZGFyLW1vbnRoLXZpZXcuY29tcG9uZW50JztcbmV4cG9ydCB7IE1vbnRoVmlld0RheSBhcyBDYWxlbmRhck1vbnRoVmlld0RheSB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcbmV4cG9ydCB7IGNvbGxhcHNlQW5pbWF0aW9uIH0gZnJvbSAnLi9jYWxlbmRhci1vcGVuLWRheS1ldmVudHMuY29tcG9uZW50JztcblxuLy8gbmVlZGVkIGZvciBpdnksIG5vdCBwYXJ0IG9mIHRoZSBwdWJsaWMgYXBpXG5leHBvcnQgeyBDYWxlbmRhck1vbnRoQ2VsbENvbXBvbmVudCBhcyDJtUNhbGVuZGFyTW9udGhDZWxsQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1tb250aC1jZWxsLmNvbXBvbmVudCc7XG5leHBvcnQgeyBDYWxlbmRhck1vbnRoVmlld0hlYWRlckNvbXBvbmVudCBhcyDJtUNhbGVuZGFyTW9udGhWaWV3SGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1tb250aC12aWV3LWhlYWRlci5jb21wb25lbnQnO1xuZXhwb3J0IHsgQ2FsZW5kYXJPcGVuRGF5RXZlbnRzQ29tcG9uZW50IGFzIMm1Q2FsZW5kYXJPcGVuRGF5RXZlbnRzQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1vcGVuLWRheS1ldmVudHMuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRHJhZ0FuZERyb3BNb2R1bGUsIENhbGVuZGFyQ29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ2FsZW5kYXJNb250aFZpZXdDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJNb250aENlbGxDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJPcGVuRGF5RXZlbnRzQ29tcG9uZW50LFxuICAgIENhbGVuZGFyTW9udGhWaWV3SGVhZGVyQ29tcG9uZW50LFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgRHJhZ0FuZERyb3BNb2R1bGUsXG4gICAgQ2FsZW5kYXJNb250aFZpZXdDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJNb250aENlbGxDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJPcGVuRGF5RXZlbnRzQ29tcG9uZW50LFxuICAgIENhbGVuZGFyTW9udGhWaWV3SGVhZGVyQ29tcG9uZW50LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhck1vbnRoTW9kdWxlIHt9XG4iXX0=