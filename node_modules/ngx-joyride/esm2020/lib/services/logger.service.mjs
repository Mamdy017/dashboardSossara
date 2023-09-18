import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./joyride-options.service";
const JOYRIDE = 'ngx-joyride:::';
export class LoggerService {
    constructor(optionService) {
        this.optionService = optionService;
    }
    debug(message, data = "") {
        if (this.optionService.areLogsEnabled()) {
            console.debug(JOYRIDE + message, data);
        }
    }
    info(message, data = "") {
        if (this.optionService.areLogsEnabled()) {
            console.info(JOYRIDE + message, data);
        }
    }
    warn(message, data = "") {
        if (this.optionService.areLogsEnabled()) {
            console.warn(JOYRIDE + message, data);
        }
    }
    error(message, data = "") {
        if (this.optionService.areLogsEnabled()) {
            console.error(JOYRIDE + message, data);
        }
    }
}
LoggerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: LoggerService, deps: [{ token: i1.JoyrideOptionsService }], target: i0.ɵɵFactoryTarget.Injectable });
LoggerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: LoggerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: LoggerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.JoyrideOptionsService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtam95cmlkZS9zcmMvbGliL3NlcnZpY2VzL2xvZ2dlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUczQyxNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztBQUdqQyxNQUFNLE9BQU8sYUFBYTtJQUV0QixZQUE2QixhQUFvQztRQUFwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBdUI7SUFBSSxDQUFDO0lBRXRFLEtBQUssQ0FBQyxPQUFnQixFQUFFLE9BQVksRUFBRTtRQUNsQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDckMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzFDO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFnQixFQUFFLE9BQVksRUFBRTtRQUNqQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pDO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFnQixFQUFFLE9BQVksRUFBRTtRQUNqQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFnQixFQUFFLE9BQVksRUFBRTtRQUNsQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDckMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzFDO0lBQ0wsQ0FBQzs7MEdBMUJRLGFBQWE7OEdBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSm95cmlkZU9wdGlvbnNTZXJ2aWNlIH0gZnJvbSAnLi9qb3lyaWRlLW9wdGlvbnMuc2VydmljZSc7XG5cbmNvbnN0IEpPWVJJREUgPSAnbmd4LWpveXJpZGU6OjonO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTG9nZ2VyU2VydmljZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG9wdGlvblNlcnZpY2U6IEpveXJpZGVPcHRpb25zU2VydmljZSkgeyB9XG5cbiAgICBkZWJ1ZyhtZXNzYWdlPzogc3RyaW5nLCBkYXRhOiBhbnkgPSBcIlwiKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvblNlcnZpY2UuYXJlTG9nc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhKT1lSSURFICsgbWVzc2FnZSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbmZvKG1lc3NhZ2U/OiBzdHJpbmcsIGRhdGE6IGFueSA9IFwiXCIpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uU2VydmljZS5hcmVMb2dzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oSk9ZUklERSArIG1lc3NhZ2UsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2FybihtZXNzYWdlPzogc3RyaW5nLCBkYXRhOiBhbnkgPSBcIlwiKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvblNlcnZpY2UuYXJlTG9nc0VuYWJsZWQoKSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKEpPWVJJREUgKyBtZXNzYWdlLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVycm9yKG1lc3NhZ2U/OiBzdHJpbmcsIGRhdGE6IGFueSA9IFwiXCIpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uU2VydmljZS5hcmVMb2dzRW5hYmxlZCgpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKEpPWVJJREUgKyBtZXNzYWdlLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxufSJdfQ==