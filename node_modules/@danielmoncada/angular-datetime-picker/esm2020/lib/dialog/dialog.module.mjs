/**
 * dialog.module
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { OWL_DIALOG_SCROLL_STRATEGY_PROVIDER, OwlDialogService } from './dialog.service';
import { OwlDialogContainerComponent } from './dialog-container.component';
import * as i0 from "@angular/core";
export class OwlDialogModule {
}
OwlDialogModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
OwlDialogModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogModule, declarations: [OwlDialogContainerComponent], imports: [CommonModule, A11yModule, OverlayModule, PortalModule] });
OwlDialogModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogModule, providers: [
        OWL_DIALOG_SCROLL_STRATEGY_PROVIDER,
        OwlDialogService,
    ], imports: [[CommonModule, A11yModule, OverlayModule, PortalModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, A11yModule, OverlayModule, PortalModule],
                    exports: [],
                    declarations: [
                        OwlDialogContainerComponent,
                    ],
                    providers: [
                        OWL_DIALOG_SCROLL_STRATEGY_PROVIDER,
                        OwlDialogService,
                    ],
                    entryComponents: [
                        OwlDialogContainerComponent,
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BpY2tlci9zcmMvbGliL2RpYWxvZy9kaWFsb2cubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sOEJBQThCLENBQUM7O0FBZ0IzRSxNQUFNLE9BQU8sZUFBZTs7NEdBQWYsZUFBZTs2R0FBZixlQUFlLGlCQVZwQiwyQkFBMkIsYUFIckIsWUFBWSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsWUFBWTs2R0FhdEQsZUFBZSxhQVJiO1FBQ1AsbUNBQW1DO1FBQ25DLGdCQUFnQjtLQUNuQixZQVJRLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDOzJGQWF2RCxlQUFlO2tCQWQzQixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQztvQkFDaEUsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsWUFBWSxFQUFFO3dCQUNWLDJCQUEyQjtxQkFDOUI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNQLG1DQUFtQzt3QkFDbkMsZ0JBQWdCO3FCQUNuQjtvQkFDRCxlQUFlLEVBQUU7d0JBQ2IsMkJBQTJCO3FCQUM5QjtpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZGlhbG9nLm1vZHVsZVxuICovXG5cbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQTExeU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IE92ZXJsYXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBQb3J0YWxNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7IE9XTF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSLCBPd2xEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBPd2xEaWFsb2dDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2RpYWxvZy1jb250YWluZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBBMTF5TW9kdWxlLCBPdmVybGF5TW9kdWxlLCBQb3J0YWxNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBPd2xEaWFsb2dDb250YWluZXJDb21wb25lbnQsXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgT1dMX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVIsXG4gICAgICAgIE93bERpYWxvZ1NlcnZpY2UsXG4gICAgXSxcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICAgICAgT3dsRGlhbG9nQ29udGFpbmVyQ29tcG9uZW50LFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgT3dsRGlhbG9nTW9kdWxlIHtcbn1cbiJdfQ==