import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoyrideDirective } from './directives/joyride.directive';
import { JoyrideService } from './services/joyride.service';
import { JoyrideStepComponent } from './components/step/joyride-step.component';
import { JoyrideButtonComponent } from './components/button/button.component';
import { JoyrideCloseButtonComponent } from './components/close-button/close-button.component';
import { JoyrideStepService } from './services/joyride-step.service';
import { JoyrideBackdropService } from './services/joyride-backdrop.service';
import { JoyrideArrowComponent } from './components/arrow/arrow.component';
import { EventListenerService } from './services/event-listener.service';
import { JoyrideStepsContainerService } from './services/joyride-steps-container.service';
import { DocumentService } from './services/document.service';
import { JoyrideOptionsService } from './services/joyride-options.service';
import { StepDrawerService } from './services/step-drawer.service';
import { DomRefService } from './services/dom.service';
import { LoggerService } from './services/logger.service';
import { RouterModule } from '@angular/router';
import { TemplatesService } from './services/templates.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
export const routerModuleForChild = RouterModule.forChild([]);
export class JoyrideModule {
    static forRoot() {
        return {
            ngModule: JoyrideModule,
            providers: [
                JoyrideService,
                JoyrideStepService,
                JoyrideStepsContainerService,
                JoyrideBackdropService,
                EventListenerService,
                DocumentService,
                JoyrideOptionsService,
                StepDrawerService,
                DomRefService,
                LoggerService,
                TemplatesService,
            ],
        };
    }
    static forChild() {
        return {
            ngModule: JoyrideModule,
            providers: [],
        };
    }
}
JoyrideModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
JoyrideModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideModule, declarations: [JoyrideDirective,
        JoyrideStepComponent,
        JoyrideArrowComponent,
        JoyrideButtonComponent,
        JoyrideCloseButtonComponent], imports: [CommonModule, i1.RouterModule], exports: [JoyrideDirective] });
JoyrideModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideModule, imports: [[CommonModule, routerModuleForChild]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, routerModuleForChild],
                    declarations: [
                        JoyrideDirective,
                        JoyrideStepComponent,
                        JoyrideArrowComponent,
                        JoyrideButtonComponent,
                        JoyrideCloseButtonComponent,
                    ],
                    exports: [JoyrideDirective],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam95cmlkZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtam95cmlkZS9zcmMvbGliL2pveXJpZGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDNUQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDaEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDOUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDL0YsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDckUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDekUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDMUYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7QUFFaEUsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQTZCLFlBQVksQ0FBQyxRQUFRLENBQy9FLEVBQUUsQ0FDTCxDQUFDO0FBYUYsTUFBTSxPQUFPLGFBQWE7SUFDdEIsTUFBTSxDQUFDLE9BQU87UUFDVixPQUFPO1lBQ0gsUUFBUSxFQUFFLGFBQWE7WUFDdkIsU0FBUyxFQUFFO2dCQUNQLGNBQWM7Z0JBQ2Qsa0JBQWtCO2dCQUNsQiw0QkFBNEI7Z0JBQzVCLHNCQUFzQjtnQkFDdEIsb0JBQW9CO2dCQUNwQixlQUFlO2dCQUNmLHFCQUFxQjtnQkFDckIsaUJBQWlCO2dCQUNqQixhQUFhO2dCQUNiLGFBQWE7Z0JBQ2IsZ0JBQWdCO2FBQ25CO1NBQ0osQ0FBQztJQUNOLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUTtRQUNYLE9BQU87WUFDSCxRQUFRLEVBQUUsYUFBYTtZQUN2QixTQUFTLEVBQUUsRUFBRTtTQUNoQixDQUFDO0lBQ04sQ0FBQzs7MEdBeEJRLGFBQWE7MkdBQWIsYUFBYSxpQkFSbEIsZ0JBQWdCO1FBQ2hCLG9CQUFvQjtRQUNwQixxQkFBcUI7UUFDckIsc0JBQXNCO1FBQ3RCLDJCQUEyQixhQU5yQixZQUFZLDhCQVFaLGdCQUFnQjsyR0FFakIsYUFBYSxZQVZiLENBQUMsWUFBWSxFQUFFLG9CQUFvQixDQUFDOzJGQVVwQyxhQUFhO2tCQVh6QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxvQkFBb0IsQ0FBQztvQkFDN0MsWUFBWSxFQUFFO3dCQUNWLGdCQUFnQjt3QkFDaEIsb0JBQW9CO3dCQUNwQixxQkFBcUI7d0JBQ3JCLHNCQUFzQjt3QkFDdEIsMkJBQTJCO3FCQUM5QjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEpveXJpZGVEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvam95cmlkZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSm95cmlkZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2pveXJpZGUuc2VydmljZSc7XG5pbXBvcnQgeyBKb3lyaWRlU3RlcENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zdGVwL2pveXJpZGUtc3RlcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSm95cmlkZUJ1dHRvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24vYnV0dG9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBKb3lyaWRlQ2xvc2VCdXR0b25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2xvc2UtYnV0dG9uL2Nsb3NlLWJ1dHRvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgSm95cmlkZVN0ZXBTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9qb3lyaWRlLXN0ZXAuc2VydmljZSc7XG5pbXBvcnQgeyBKb3lyaWRlQmFja2Ryb3BTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9qb3lyaWRlLWJhY2tkcm9wLnNlcnZpY2UnO1xuaW1wb3J0IHsgSm95cmlkZUFycm93Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Fycm93L2Fycm93LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFdmVudExpc3RlbmVyU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvZXZlbnQtbGlzdGVuZXIuc2VydmljZSc7XG5pbXBvcnQgeyBKb3lyaWRlU3RlcHNDb250YWluZXJTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9qb3lyaWRlLXN0ZXBzLWNvbnRhaW5lci5zZXJ2aWNlJztcbmltcG9ydCB7IERvY3VtZW50U2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvZG9jdW1lbnQuc2VydmljZSc7XG5pbXBvcnQgeyBKb3lyaWRlT3B0aW9uc1NlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2pveXJpZGUtb3B0aW9ucy5zZXJ2aWNlJztcbmltcG9ydCB7IFN0ZXBEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9zdGVwLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IERvbVJlZlNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2RvbS5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBUZW1wbGF0ZXNTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy90ZW1wbGF0ZXMuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCByb3V0ZXJNb2R1bGVGb3JDaGlsZDogTW9kdWxlV2l0aFByb3ZpZGVyczxhbnk+ID0gUm91dGVyTW9kdWxlLmZvckNoaWxkKFxuICAgIFtdXG4pO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIHJvdXRlck1vZHVsZUZvckNoaWxkXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgSm95cmlkZURpcmVjdGl2ZSxcbiAgICAgICAgSm95cmlkZVN0ZXBDb21wb25lbnQsXG4gICAgICAgIEpveXJpZGVBcnJvd0NvbXBvbmVudCxcbiAgICAgICAgSm95cmlkZUJ1dHRvbkNvbXBvbmVudCxcbiAgICAgICAgSm95cmlkZUNsb3NlQnV0dG9uQ29tcG9uZW50LFxuICAgIF0sXG4gICAgZXhwb3J0czogW0pveXJpZGVEaXJlY3RpdmVdLFxufSlcbmV4cG9ydCBjbGFzcyBKb3lyaWRlTW9kdWxlIHtcbiAgICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEpveXJpZGVNb2R1bGU+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5nTW9kdWxlOiBKb3lyaWRlTW9kdWxlLFxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgICAgICAgICAgSm95cmlkZVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgSm95cmlkZVN0ZXBTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIEpveXJpZGVTdGVwc0NvbnRhaW5lclNlcnZpY2UsXG4gICAgICAgICAgICAgICAgSm95cmlkZUJhY2tkcm9wU2VydmljZSxcbiAgICAgICAgICAgICAgICBFdmVudExpc3RlbmVyU2VydmljZSxcbiAgICAgICAgICAgICAgICBEb2N1bWVudFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgSm95cmlkZU9wdGlvbnNTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIFN0ZXBEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIERvbVJlZlNlcnZpY2UsXG4gICAgICAgICAgICAgICAgTG9nZ2VyU2VydmljZSxcbiAgICAgICAgICAgICAgICBUZW1wbGF0ZXNTZXJ2aWNlLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhdGljIGZvckNoaWxkKCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Sm95cmlkZU1vZHVsZT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmdNb2R1bGU6IEpveXJpZGVNb2R1bGUsXG4gICAgICAgICAgICBwcm92aWRlcnM6IFtdLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdfQ==