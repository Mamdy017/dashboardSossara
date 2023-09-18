/**
 * dialog-container.component
 */
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Optional, ViewChild } from '@angular/core';
import { animate, animateChild, keyframes, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { BasePortalOutlet, CdkPortalOutlet } from '@angular/cdk/portal';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/cdk/portal";
const zoomFadeIn = {
    opacity: 0,
    transform: 'translateX({{ x }}) translateY({{ y }}) scale({{scale}})'
};
const zoomFadeInFrom = {
    opacity: 0,
    transform: 'translateX({{ x }}) translateY({{ y }}) scale({{scale}})',
    transformOrigin: '{{ ox }} {{ oy }}'
};
export class OwlDialogContainerComponent extends BasePortalOutlet {
    constructor(changeDetector, elementRef, focusTrapFactory, document) {
        super();
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
        this.focusTrapFactory = focusTrapFactory;
        this.document = document;
        this.portalOutlet = null;
        /** ID of the element that should be considered as the dialog's label. */
        this.ariaLabelledBy = null;
        /** Emits when an animation state changes. */
        this.animationStateChanged = new EventEmitter();
        this.isAnimating = false;
        this.state = 'enter';
        // for animation purpose
        this.params = {
            x: '0px',
            y: '0px',
            ox: '50%',
            oy: '50%',
            scale: 0
        };
        // A variable to hold the focused element before the dialog was open.
        // This would help us to refocus back to element when the dialog was closed.
        this.elementFocusedBeforeDialogWasOpened = null;
    }
    get config() {
        return this._config;
    }
    get owlDialogContainerClass() {
        return true;
    }
    get owlDialogContainerTabIndex() {
        return -1;
    }
    get owlDialogContainerId() {
        return this._config.id;
    }
    get owlDialogContainerRole() {
        return this._config.role || null;
    }
    get owlDialogContainerAriaLabelledby() {
        return this.ariaLabelledBy;
    }
    get owlDialogContainerAriaDescribedby() {
        return this._config.ariaDescribedBy || null;
    }
    get owlDialogContainerAnimation() {
        return { value: this.state, params: this.params };
    }
    ngOnInit() { }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     */
    attachComponentPortal(portal) {
        if (this.portalOutlet.hasAttached()) {
            throw Error('Attempting to attach dialog content after content is already attached');
        }
        this.savePreviouslyFocusedElement();
        return this.portalOutlet.attachComponentPortal(portal);
    }
    attachTemplatePortal(portal) {
        throw new Error('Method not implemented.');
    }
    setConfig(config) {
        this._config = config;
        if (config.event) {
            this.calculateZoomOrigin(event);
        }
    }
    onAnimationStart(event) {
        this.isAnimating = true;
        this.animationStateChanged.emit(event);
    }
    onAnimationDone(event) {
        if (event.toState === 'enter') {
            this.trapFocus();
        }
        else if (event.toState === 'exit') {
            this.restoreFocus();
        }
        this.animationStateChanged.emit(event);
        this.isAnimating = false;
    }
    startExitAnimation() {
        this.state = 'exit';
        this.changeDetector.markForCheck();
    }
    /**
     * Calculate origin used in the `zoomFadeInFrom()`
     * for animation purpose
     */
    calculateZoomOrigin(event) {
        if (!event) {
            return;
        }
        const clientX = event.clientX;
        const clientY = event.clientY;
        const wh = window.innerWidth / 2;
        const hh = window.innerHeight / 2;
        const x = clientX - wh;
        const y = clientY - hh;
        const ox = clientX / window.innerWidth;
        const oy = clientY / window.innerHeight;
        this.params.x = `${x}px`;
        this.params.y = `${y}px`;
        this.params.ox = `${ox * 100}%`;
        this.params.oy = `${oy * 100}%`;
        this.params.scale = 0;
        return;
    }
    /**
     * Save the focused element before dialog was open
     */
    savePreviouslyFocusedElement() {
        if (this.document) {
            this.elementFocusedBeforeDialogWasOpened = this.document
                .activeElement;
            Promise.resolve().then(() => this.elementRef.nativeElement.focus());
        }
    }
    trapFocus() {
        if (!this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
        }
        if (this._config.autoFocus) {
            this.focusTrap.focusInitialElementWhenReady();
        }
    }
    restoreFocus() {
        const toFocus = this.elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }
        if (this.focusTrap) {
            this.focusTrap.destroy();
        }
    }
}
OwlDialogContainerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogContainerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlDialogContainerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlDialogContainerComponent, selector: "owl-dialog-container", host: { listeners: { "@slideModal.start": "onAnimationStart($event)", "@slideModal.done": "onAnimationDone($event)" }, properties: { "class.owl-dialog-container": "owlDialogContainerClass", "attr.tabindex": "owlDialogContainerTabIndex", "attr.id": "owlDialogContainerId", "attr.role": "owlDialogContainerRole", "attr.aria-labelledby": "owlDialogContainerAriaLabelledby", "attr.aria-describedby": "owlDialogContainerAriaDescribedby", "@slideModal": "owlDialogContainerAnimation" } }, viewQueries: [{ propertyName: "portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<ng-template [cdkPortalOutlet]></ng-template>\n", directives: [{ type: i2.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [
        trigger('slideModal', [
            transition('void => enter', [
                style(zoomFadeInFrom),
                animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style('*')),
                animate('150ms', keyframes([
                    style({ transform: 'scale(1)', offset: 0 }),
                    style({ transform: 'scale(1.05)', offset: 0.3 }),
                    style({ transform: 'scale(.95)', offset: 0.8 }),
                    style({ transform: 'scale(1)', offset: 1.0 })
                ])),
                animateChild()
            ], {
                params: {
                    x: '0px',
                    y: '0px',
                    ox: '50%',
                    oy: '50%',
                    scale: 1
                }
            }),
            transition('enter => exit', [animateChild(), animate(200, style(zoomFadeIn))], { params: { x: '0px', y: '0px', ox: '50%', oy: '50%' } })
        ])
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-dialog-container', animations: [
                        trigger('slideModal', [
                            transition('void => enter', [
                                style(zoomFadeInFrom),
                                animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style('*')),
                                animate('150ms', keyframes([
                                    style({ transform: 'scale(1)', offset: 0 }),
                                    style({ transform: 'scale(1.05)', offset: 0.3 }),
                                    style({ transform: 'scale(.95)', offset: 0.8 }),
                                    style({ transform: 'scale(1)', offset: 1.0 })
                                ])),
                                animateChild()
                            ], {
                                params: {
                                    x: '0px',
                                    y: '0px',
                                    ox: '50%',
                                    oy: '50%',
                                    scale: 1
                                }
                            }),
                            transition('enter => exit', [animateChild(), animate(200, style(zoomFadeIn))], { params: { x: '0px', y: '0px', ox: '50%', oy: '50%' } })
                        ])
                    ], host: {
                        '(@slideModal.start)': 'onAnimationStart($event)',
                        '(@slideModal.done)': 'onAnimationDone($event)',
                        '[class.owl-dialog-container]': 'owlDialogContainerClass',
                        '[attr.tabindex]': 'owlDialogContainerTabIndex',
                        '[attr.id]': 'owlDialogContainerId',
                        '[attr.role]': 'owlDialogContainerRole',
                        '[attr.aria-labelledby]': 'owlDialogContainerAriaLabelledby',
                        '[attr.aria-describedby]': 'owlDialogContainerAriaDescribedby',
                        '[@slideModal]': 'owlDialogContainerAnimation'
                    }, template: "<ng-template [cdkPortalOutlet]></ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.FocusTrapFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9waWNrZXIvc3JjL2xpYi9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9waWNrZXIvc3JjL2xpYi9kaWFsb2cvZGlhbG9nLWNvbnRhaW5lci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFDSCxpQkFBaUIsRUFDakIsU0FBUyxFQUVULFVBQVUsRUFFVixZQUFZLEVBQ1osTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNILE9BQU8sRUFDUCxZQUFZLEVBRVosU0FBUyxFQUNULEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxFQUNWLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBYSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hFLE9BQU8sRUFDSCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUdsQixNQUFNLHFCQUFxQixDQUFDOzs7O0FBRzdCLE1BQU0sVUFBVSxHQUFHO0lBQ2YsT0FBTyxFQUFFLENBQUM7SUFDVixTQUFTLEVBQUUsMERBQTBEO0NBQ3hFLENBQUM7QUFDRixNQUFNLGNBQWMsR0FBRztJQUNuQixPQUFPLEVBQUUsQ0FBQztJQUNWLFNBQVMsRUFBRSwwREFBMEQ7SUFDckUsZUFBZSxFQUFFLG1CQUFtQjtDQUN2QyxDQUFDO0FBb0RGLE1BQU0sT0FBTywyQkFBNEIsU0FBUSxnQkFBZ0I7SUFnRTdELFlBQ1ksY0FBaUMsRUFDakMsVUFBc0IsRUFDdEIsZ0JBQWtDLEVBR2xDLFFBQWE7UUFFckIsS0FBSyxFQUFFLENBQUM7UUFQ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QWlCLEVBQUUsNEJBQTRCO3dCQUMvQyxXQUFXLEVBQUUsc0JBQXNCO3dCQUNuQyxhQUFhLEVBQUUsd0JBQXdCO3dCQUN2Qyx3QkFBd0IsRUFBRSxrQ0FBa0M7d0JBQzVELHlCQUF5QixFQUFFLG1DQUFtQzt3QkFDOUQsZUFBZSxFQUFFLDZCQUE2QjtxQkFDakQ7OzBCQXNFSSxRQUFROzswQkFDUixNQUFNOzJCQUFDLFFBQVE7NENBbEVwQixZQUFZO3NCQURYLFNBQVM7dUJBQUMsZUFBZSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZGlhbG9nLWNvbnRhaW5lci5jb21wb25lbnRcbiAqL1xuXG5pbXBvcnQge1xuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb21wb25lbnRSZWYsXG4gICAgRWxlbWVudFJlZixcbiAgICBFbWJlZGRlZFZpZXdSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEluamVjdCxcbiAgICBPbkluaXQsXG4gICAgT3B0aW9uYWwsXG4gICAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBhbmltYXRlLFxuICAgIGFuaW1hdGVDaGlsZCxcbiAgICBBbmltYXRpb25FdmVudCxcbiAgICBrZXlmcmFtZXMsXG4gICAgc3R5bGUsXG4gICAgdHJhbnNpdGlvbixcbiAgICB0cmlnZ2VyXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9jdXNUcmFwLCBGb2N1c1RyYXBGYWN0b3J5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtcbiAgICBCYXNlUG9ydGFsT3V0bGV0LFxuICAgIENka1BvcnRhbE91dGxldCxcbiAgICBDb21wb25lbnRQb3J0YWwsXG4gICAgVGVtcGxhdGVQb3J0YWxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBPd2xEaWFsb2dDb25maWdJbnRlcmZhY2UgfSBmcm9tICcuL2RpYWxvZy1jb25maWcuY2xhc3MnO1xuXG5jb25zdCB6b29tRmFkZUluID0ge1xuICAgIG9wYWNpdHk6IDAsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCh7eyB4IH19KSB0cmFuc2xhdGVZKHt7IHkgfX0pIHNjYWxlKHt7c2NhbGV9fSknXG59O1xuY29uc3Qgem9vbUZhZGVJbkZyb20gPSB7XG4gICAgb3BhY2l0eTogMCxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKHt7IHggfX0pIHRyYW5zbGF0ZVkoe3sgeSB9fSkgc2NhbGUoe3tzY2FsZX19KScsXG4gICAgdHJhbnNmb3JtT3JpZ2luOiAne3sgb3ggfX0ge3sgb3kgfX0nXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ293bC1kaWFsb2ctY29udGFpbmVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZGlhbG9nLWNvbnRhaW5lci5jb21wb25lbnQuaHRtbCcsXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdzbGlkZU1vZGFsJywgW1xuICAgICAgICAgICAgdHJhbnNpdGlvbihcbiAgICAgICAgICAgICAgICAndm9pZCA9PiBlbnRlcicsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBzdHlsZSh6b29tRmFkZUluRnJvbSksXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoJzMwMG1zIGN1YmljLWJlemllcigwLjM1LCAwLCAwLjI1LCAxKScsIHN0eWxlKCcqJykpLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgJzE1MG1zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleWZyYW1lcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUoeyB0cmFuc2Zvcm06ICdzY2FsZSgxKScsIG9mZnNldDogMCB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSh7IHRyYW5zZm9ybTogJ3NjYWxlKDEuMDUpJywgb2Zmc2V0OiAwLjMgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUoeyB0cmFuc2Zvcm06ICdzY2FsZSguOTUpJywgb2Zmc2V0OiAwLjggfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUoeyB0cmFuc2Zvcm06ICdzY2FsZSgxKScsIG9mZnNldDogMS4wIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlQ2hpbGQoKVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6ICcwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogJzBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBveDogJzUwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBveTogJzUwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oXG4gICAgICAgICAgICAgICAgJ2VudGVyID0+IGV4aXQnLFxuICAgICAgICAgICAgICAgIFthbmltYXRlQ2hpbGQoKSwgYW5pbWF0ZSgyMDAsIHN0eWxlKHpvb21GYWRlSW4pKV0sXG4gICAgICAgICAgICAgICAgeyBwYXJhbXM6IHsgeDogJzBweCcsIHk6ICcwcHgnLCBveDogJzUwJScsIG95OiAnNTAlJyB9IH1cbiAgICAgICAgICAgIClcbiAgICAgICAgXSlcbiAgICBdLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJyhAc2xpZGVNb2RhbC5zdGFydCknOiAnb25BbmltYXRpb25TdGFydCgkZXZlbnQpJyxcbiAgICAgICAgJyhAc2xpZGVNb2RhbC5kb25lKSc6ICdvbkFuaW1hdGlvbkRvbmUoJGV2ZW50KScsXG4gICAgICAgICdbY2xhc3Mub3dsLWRpYWxvZy1jb250YWluZXJdJzogJ293bERpYWxvZ0NvbnRhaW5lckNsYXNzJyxcbiAgICAgICAgJ1thdHRyLnRhYmluZGV4XSc6ICdvd2xEaWFsb2dDb250YWluZXJUYWJJbmRleCcsXG4gICAgICAgICdbYXR0ci5pZF0nOiAnb3dsRGlhbG9nQ29udGFpbmVySWQnLFxuICAgICAgICAnW2F0dHIucm9sZV0nOiAnb3dsRGlhbG9nQ29udGFpbmVyUm9sZScsXG4gICAgICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ293bERpYWxvZ0NvbnRhaW5lckFyaWFMYWJlbGxlZGJ5JyxcbiAgICAgICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ293bERpYWxvZ0NvbnRhaW5lckFyaWFEZXNjcmliZWRieScsXG4gICAgICAgICdbQHNsaWRlTW9kYWxdJzogJ293bERpYWxvZ0NvbnRhaW5lckFuaW1hdGlvbidcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIE93bERpYWxvZ0NvbnRhaW5lckNvbXBvbmVudCBleHRlbmRzIEJhc2VQb3J0YWxPdXRsZXRcbiAgICBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgQFZpZXdDaGlsZChDZGtQb3J0YWxPdXRsZXQsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgcG9ydGFsT3V0bGV0OiBDZGtQb3J0YWxPdXRsZXQgfCBudWxsID0gbnVsbDtcblxuICAgIC8qKiBUaGUgY2xhc3MgdGhhdCB0cmFwcyBhbmQgbWFuYWdlcyBmb2N1cyB3aXRoaW4gdGhlIGRpYWxvZy4gKi9cbiAgICBwcml2YXRlIGZvY3VzVHJhcDogRm9jdXNUcmFwO1xuXG4gICAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgdGhlIGRpYWxvZydzIGxhYmVsLiAqL1xuICAgIHB1YmxpYyBhcmlhTGFiZWxsZWRCeTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgICAvKiogRW1pdHMgd2hlbiBhbiBhbmltYXRpb24gc3RhdGUgY2hhbmdlcy4gKi9cbiAgICBwdWJsaWMgYW5pbWF0aW9uU3RhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxBbmltYXRpb25FdmVudD4oKTtcblxuICAgIHB1YmxpYyBpc0FuaW1hdGluZyA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlnOiBPd2xEaWFsb2dDb25maWdJbnRlcmZhY2U7XG4gICAgZ2V0IGNvbmZpZygpOiBPd2xEaWFsb2dDb25maWdJbnRlcmZhY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGU6ICd2b2lkJyB8ICdlbnRlcicgfCAnZXhpdCcgPSAnZW50ZXInO1xuXG4gICAgLy8gZm9yIGFuaW1hdGlvbiBwdXJwb3NlXG4gICAgcHJpdmF0ZSBwYXJhbXM6IGFueSA9IHtcbiAgICAgICAgeDogJzBweCcsXG4gICAgICAgIHk6ICcwcHgnLFxuICAgICAgICBveDogJzUwJScsXG4gICAgICAgIG95OiAnNTAlJyxcbiAgICAgICAgc2NhbGU6IDBcbiAgICB9O1xuXG4gICAgLy8gQSB2YXJpYWJsZSB0byBob2xkIHRoZSBmb2N1c2VkIGVsZW1lbnQgYmVmb3JlIHRoZSBkaWFsb2cgd2FzIG9wZW4uXG4gICAgLy8gVGhpcyB3b3VsZCBoZWxwIHVzIHRvIHJlZm9jdXMgYmFjayB0byBlbGVtZW50IHdoZW4gdGhlIGRpYWxvZyB3YXMgY2xvc2VkLlxuICAgIHByaXZhdGUgZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgICBnZXQgb3dsRGlhbG9nQ29udGFpbmVyQ2xhc3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldCBvd2xEaWFsb2dDb250YWluZXJUYWJJbmRleCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZ2V0IG93bERpYWxvZ0NvbnRhaW5lcklkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuaWQ7XG4gICAgfVxuXG4gICAgZ2V0IG93bERpYWxvZ0NvbnRhaW5lclJvbGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5yb2xlIHx8IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IG93bERpYWxvZ0NvbnRhaW5lckFyaWFMYWJlbGxlZGJ5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmFyaWFMYWJlbGxlZEJ5O1xuICAgIH1cblxuICAgIGdldCBvd2xEaWFsb2dDb250YWluZXJBcmlhRGVzY3JpYmVkYnkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5hcmlhRGVzY3JpYmVkQnkgfHwgbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgb3dsRGlhbG9nQ29udGFpbmVyQW5pbWF0aW9uKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7IHZhbHVlOiB0aGlzLnN0YXRlLCBwYXJhbXM6IHRoaXMucGFyYW1zIH07XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgIHByaXZhdGUgZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICAgICAgQE9wdGlvbmFsKClcbiAgICAgICAgQEluamVjdChET0NVTUVOVClcbiAgICAgICAgcHJpdmF0ZSBkb2N1bWVudDogYW55XG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCkge31cblxuICAgIC8qKlxuICAgICAqIEF0dGFjaCBhIENvbXBvbmVudFBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMgZGlhbG9nIGNvbnRhaW5lci5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KFxuICAgICAgICBwb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUPlxuICAgICk6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgICAgIGlmICh0aGlzLnBvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICAgICAnQXR0ZW1wdGluZyB0byBhdHRhY2ggZGlhbG9nIGNvbnRlbnQgYWZ0ZXIgY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5wb3J0YWxPdXRsZXQuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gICAgfVxuXG4gICAgcHVibGljIGF0dGFjaFRlbXBsYXRlUG9ydGFsPEM+KFxuICAgICAgICBwb3J0YWw6IFRlbXBsYXRlUG9ydGFsPEM+XG4gICAgKTogRW1iZWRkZWRWaWV3UmVmPEM+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBPd2xEaWFsb2dDb25maWdJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIGlmIChjb25maWcuZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlWm9vbU9yaWdpbihldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgb25BbmltYXRpb25TdGFydCggZXZlbnQ6IEFuaW1hdGlvbkV2ZW50ICk6IHZvaWQge1xuICAgICAgICB0aGlzLmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZUNoYW5nZWQuZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uQW5pbWF0aW9uRG9uZSggZXZlbnQ6IEFuaW1hdGlvbkV2ZW50ICk6IHZvaWQge1xuICAgICAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgICAgICAgdGhpcy50cmFwRm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC50b1N0YXRlID09PSAnZXhpdCcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KGV2ZW50KTtcbiAgICAgICAgdGhpcy5pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydEV4aXRBbmltYXRpb24oKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAnZXhpdCc7XG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlIG9yaWdpbiB1c2VkIGluIHRoZSBgem9vbUZhZGVJbkZyb20oKWBcbiAgICAgKiBmb3IgYW5pbWF0aW9uIHB1cnBvc2VcbiAgICAgKi9cbiAgICBwcml2YXRlIGNhbGN1bGF0ZVpvb21PcmlnaW4oZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjbGllbnRYID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgY29uc3QgY2xpZW50WSA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICAgICAgY29uc3Qgd2ggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG4gICAgICAgIGNvbnN0IGhoID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbiAgICAgICAgY29uc3QgeCA9IGNsaWVudFggLSB3aDtcbiAgICAgICAgY29uc3QgeSA9IGNsaWVudFkgLSBoaDtcbiAgICAgICAgY29uc3Qgb3ggPSBjbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGNvbnN0IG95ID0gY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICB0aGlzLnBhcmFtcy54ID0gYCR7eH1weGA7XG4gICAgICAgIHRoaXMucGFyYW1zLnkgPSBgJHt5fXB4YDtcbiAgICAgICAgdGhpcy5wYXJhbXMub3ggPSBgJHtveCAqIDEwMH0lYDtcbiAgICAgICAgdGhpcy5wYXJhbXMub3kgPSBgJHtveSAqIDEwMH0lYDtcbiAgICAgICAgdGhpcy5wYXJhbXMuc2NhbGUgPSAwO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYXZlIHRoZSBmb2N1c2VkIGVsZW1lbnQgYmVmb3JlIGRpYWxvZyB3YXMgb3BlblxuICAgICAqL1xuICAgIHByaXZhdGUgc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQgPSB0aGlzLmRvY3VtZW50XG4gICAgICAgICAgICAgICAgLmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYXBGb2N1cygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmZvY3VzVHJhcCkge1xuICAgICAgICAgICAgdGhpcy5mb2N1c1RyYXAgPSB0aGlzLmZvY3VzVHJhcEZhY3RvcnkuY3JlYXRlKFxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2NvbmZpZy5hdXRvRm9jdXMpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVzdG9yZUZvY3VzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCB0b0ZvY3VzID0gdGhpcy5lbGVtZW50Rm9jdXNlZEJlZm9yZURpYWxvZ1dhc09wZW5lZDtcblxuICAgICAgICAvLyBXZSBuZWVkIHRoZSBleHRyYSBjaGVjaywgYmVjYXVzZSBJRSBjYW4gc2V0IHRoZSBgYWN0aXZlRWxlbWVudGAgdG8gbnVsbCBpbiBzb21lIGNhc2VzLlxuICAgICAgICBpZiAodG9Gb2N1cyAmJiB0eXBlb2YgdG9Gb2N1cy5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdG9Gb2N1cy5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZm9jdXNUcmFwKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzVHJhcC5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCI8bmctdGVtcGxhdGUgW2Nka1BvcnRhbE91dGxldF0+PC9uZy10ZW1wbGF0ZT5cbiJdfQ==