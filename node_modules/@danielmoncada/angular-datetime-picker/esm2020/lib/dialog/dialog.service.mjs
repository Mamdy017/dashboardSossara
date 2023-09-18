/**
 * dialog.service
 */
import { Inject, Injectable, InjectionToken, Injector, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { OwlDialogConfig } from './dialog-config.class';
import { OwlDialogRef } from './dialog-ref.class';
import { OwlDialogContainerComponent } from './dialog-container.component';
import { extendObject } from '../utils';
import { defer, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Overlay, OverlayConfig, OverlayContainer } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/common";
export const OWL_DIALOG_DATA = new InjectionToken('OwlDialogData');
/**
 * Injection token that determines the scroll handling while the dialog is open.
 * */
export const OWL_DIALOG_SCROLL_STRATEGY = new InjectionToken('owl-dialog-scroll-strategy');
export function OWL_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    const fn = () => overlay.scrollStrategies.block();
    return fn;
}
/** @docs-private */
export const OWL_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: OWL_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: OWL_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY
};
/**
 * Injection token that can be used to specify default dialog options.
 * */
export const OWL_DIALOG_DEFAULT_OPTIONS = new InjectionToken('owl-dialog-default-options');
export class OwlDialogService {
    constructor(overlay, injector, location, scrollStrategy, defaultOptions, parentDialog, overlayContainer) {
        this.overlay = overlay;
        this.injector = injector;
        this.location = location;
        this.defaultOptions = defaultOptions;
        this.parentDialog = parentDialog;
        this.overlayContainer = overlayContainer;
        this.ariaHiddenElements = new Map();
        this._openDialogsAtThisLevel = [];
        this._afterOpenAtThisLevel = new Subject();
        this._afterAllClosedAtThisLevel = new Subject();
        /**
         * Stream that emits when all open dialog have finished closing.
         * Will emit on subscribe if there are no open dialogs to begin with.
         */
        this.afterAllClosed = defer(() => this._openDialogsAtThisLevel.length
            ? this._afterAllClosed
            : this._afterAllClosed.pipe(startWith(undefined)));
        this.scrollStrategy = scrollStrategy;
        if (!parentDialog && location) {
            location.subscribe(() => this.closeAll());
        }
    }
    /** Keeps track of the currently-open dialogs. */
    get openDialogs() {
        return this.parentDialog
            ? this.parentDialog.openDialogs
            : this._openDialogsAtThisLevel;
    }
    /** Stream that emits when a dialog has been opened. */
    get afterOpen() {
        return this.parentDialog
            ? this.parentDialog.afterOpen
            : this._afterOpenAtThisLevel;
    }
    get _afterAllClosed() {
        const parent = this.parentDialog;
        return parent
            ? parent._afterAllClosed
            : this._afterAllClosedAtThisLevel;
    }
    open(componentOrTemplateRef, config) {
        config = applyConfigDefaults(config, this.defaultOptions);
        if (config.id && this.getDialogById(config.id)) {
            throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
        }
        const overlayRef = this.createOverlay(config);
        const dialogContainer = this.attachDialogContainer(overlayRef, config);
        const dialogRef = this.attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
        if (!this.openDialogs.length) {
            this.hideNonDialogContentFromAssistiveTechnology();
        }
        this.openDialogs.push(dialogRef);
        dialogRef
            .afterClosed()
            .subscribe(() => this.removeOpenDialog(dialogRef));
        this.afterOpen.next(dialogRef);
        return dialogRef;
    }
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll() {
        let i = this.openDialogs.length;
        while (i--) {
            this.openDialogs[i].close();
        }
    }
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id) {
        return this.openDialogs.find(dialog => dialog.id === id);
    }
    attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config) {
        const dialogRef = new OwlDialogRef(overlayRef, dialogContainer, config.id, this.location);
        if (config.hasBackdrop) {
            overlayRef.backdropClick().subscribe(() => {
                if (!dialogRef.disableClose) {
                    dialogRef.close();
                }
            });
        }
        if (componentOrTemplateRef instanceof TemplateRef) {
        }
        else {
            const injector = this.createInjector(config, dialogRef, dialogContainer);
            const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, undefined, injector));
            dialogRef.componentInstance = contentRef.instance;
        }
        dialogRef
            .updateSize(config.width, config.height)
            .updatePosition(config.position);
        return dialogRef;
    }
    createInjector(config, dialogRef, dialogContainer) {
        const userInjector = config &&
            config.viewContainerRef &&
            config.viewContainerRef.injector;
        const injectionTokens = new WeakMap();
        injectionTokens.set(OwlDialogRef, dialogRef);
        injectionTokens.set(OwlDialogContainerComponent, dialogContainer);
        injectionTokens.set(OWL_DIALOG_DATA, config.data);
        return new PortalInjector(userInjector || this.injector, injectionTokens);
    }
    createOverlay(config) {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    }
    attachDialogContainer(overlayRef, config) {
        const containerPortal = new ComponentPortal(OwlDialogContainerComponent, config.viewContainerRef);
        const containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.setConfig(config);
        return containerRef.instance;
    }
    getOverlayConfig(dialogConfig) {
        const state = new OverlayConfig({
            positionStrategy: this.overlay.position().global(),
            scrollStrategy: dialogConfig.scrollStrategy || this.scrollStrategy(),
            panelClass: dialogConfig.paneClass,
            hasBackdrop: dialogConfig.hasBackdrop,
            minWidth: dialogConfig.minWidth,
            minHeight: dialogConfig.minHeight,
            maxWidth: dialogConfig.maxWidth,
            maxHeight: dialogConfig.maxHeight
        });
        if (dialogConfig.backdropClass) {
            state.backdropClass = dialogConfig.backdropClass;
        }
        return state;
    }
    removeOpenDialog(dialogRef) {
        const index = this._openDialogsAtThisLevel.indexOf(dialogRef);
        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // If all the dialogs were closed, remove/restore the `aria-hidden`
            // to a the siblings and emit to the `afterAllClosed` stream.
            if (!this.openDialogs.length) {
                this.ariaHiddenElements.forEach((previousValue, element) => {
                    if (previousValue) {
                        element.setAttribute('aria-hidden', previousValue);
                    }
                    else {
                        element.removeAttribute('aria-hidden');
                    }
                });
                this.ariaHiddenElements.clear();
                this._afterAllClosed.next();
            }
        }
    }
    /**
     * Hides all of the content that isn't an overlay from assistive technology.
     */
    hideNonDialogContentFromAssistiveTechnology() {
        const overlayContainer = this.overlayContainer.getContainerElement();
        // Ensure that the overlay container is attached to the DOM.
        if (overlayContainer.parentElement) {
            const siblings = overlayContainer.parentElement.children;
            for (let i = siblings.length - 1; i > -1; i--) {
                const sibling = siblings[i];
                if (sibling !== overlayContainer &&
                    sibling.nodeName !== 'SCRIPT' &&
                    sibling.nodeName !== 'STYLE' &&
                    !sibling.hasAttribute('aria-live')) {
                    this.ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            }
        }
    }
}
OwlDialogService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogService, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: i2.Location, optional: true }, { token: OWL_DIALOG_SCROLL_STRATEGY }, { token: OWL_DIALOG_DEFAULT_OPTIONS, optional: true }, { token: OwlDialogService, optional: true, skipSelf: true }, { token: i1.OverlayContainer }], target: i0.ɵɵFactoryTarget.Injectable });
OwlDialogService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: i2.Location, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [OWL_DIALOG_SCROLL_STRATEGY]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [OWL_DIALOG_DEFAULT_OPTIONS]
                }] }, { type: OwlDialogService, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1.OverlayContainer }]; } });
/**
 * Applies default options to the dialog config.
 * @param config Config to be modified.
 * @param defaultOptions Default config setting
 * @returns The new configuration object.
 */
function applyConfigDefaults(config, defaultOptions) {
    return extendObject(new OwlDialogConfig(), config, defaultOptions);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9waWNrZXIvc3JjL2xpYi9kaWFsb2cvZGlhbG9nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSCxPQUFPLEVBRUgsTUFBTSxFQUNOLFVBQVUsRUFDVixjQUFjLEVBQ2QsUUFBUSxFQUNSLFFBQVEsRUFDUixRQUFRLEVBQ1IsV0FBVyxFQUNkLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUE0QixNQUFNLHVCQUF1QixDQUFDO0FBQ2xGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxLQUFLLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQ0gsT0FBTyxFQUNQLGFBQWEsRUFDYixnQkFBZ0IsRUFHbkIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQ0gsZUFBZSxFQUVmLGNBQWMsRUFDakIsTUFBTSxxQkFBcUIsQ0FBQzs7OztBQUU3QixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQU0sZUFBZSxDQUFDLENBQUM7QUFFeEU7O0tBRUs7QUFDTCxNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBRyxJQUFJLGNBQWMsQ0FFMUQsNEJBQTRCLENBQUMsQ0FBQztBQUVoQyxNQUFNLFVBQVUsMkNBQTJDLENBQ3ZELE9BQWdCO0lBRWhCLE1BQU0sRUFBRSxHQUFHLEdBQUcs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Z0JBQWdCLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztZQUV6RCxLQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDM0MsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1QixJQUNJLE9BQU8sS0FBSyxnQkFBZ0I7b0JBQzVCLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUTtvQkFDN0IsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPO29CQUM1QixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQ3BDO29CQUNFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQ3ZCLE9BQU8sRUFDUCxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUN0QyxDQUFDO29CQUNGLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUMvQzthQUNKO1NBQ0o7SUFDTCxDQUFDOzs2R0EzUVEsZ0JBQWdCLHlHQThDYiwwQkFBMEIsYUFFMUIsMEJBQTBCLDZCQUlaLGdCQUFnQjtpSEFwRGpDLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVOzswQkE4Q0YsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQywwQkFBMEI7OzBCQUNqQyxRQUFROzswQkFDUixNQUFNOzJCQUFDLDBCQUEwQjs4QkFJWixnQkFBZ0I7MEJBRnJDLFFBQVE7OzBCQUNSLFFBQVE7O0FBMk5qQjs7Ozs7R0FLRztBQUNILFNBQVMsbUJBQW1CLENBQ3hCLE1BQWlDLEVBQ2pDLGNBQXlDO0lBRXpDLE9BQU8sWUFBWSxDQUFDLElBQUksZUFBZSxFQUFFLEVBQUUsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGRpYWxvZy5zZXJ2aWNlXG4gKi9cblxuaW1wb3J0IHtcbiAgICBDb21wb25lbnRSZWYsXG4gICAgSW5qZWN0LFxuICAgIEluamVjdGFibGUsXG4gICAgSW5qZWN0aW9uVG9rZW4sXG4gICAgSW5qZWN0b3IsXG4gICAgT3B0aW9uYWwsXG4gICAgU2tpcFNlbGYsXG4gICAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBPd2xEaWFsb2dDb25maWcsIE93bERpYWxvZ0NvbmZpZ0ludGVyZmFjZSB9IGZyb20gJy4vZGlhbG9nLWNvbmZpZy5jbGFzcyc7XG5pbXBvcnQgeyBPd2xEaWFsb2dSZWYgfSBmcm9tICcuL2RpYWxvZy1yZWYuY2xhc3MnO1xuaW1wb3J0IHsgT3dsRGlhbG9nQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9kaWFsb2ctY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBleHRlbmRPYmplY3QgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBkZWZlciwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3RhcnRXaXRoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgICBPdmVybGF5LFxuICAgIE92ZXJsYXlDb25maWcsXG4gICAgT3ZlcmxheUNvbnRhaW5lcixcbiAgICBPdmVybGF5UmVmLFxuICAgIFNjcm9sbFN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7XG4gICAgQ29tcG9uZW50UG9ydGFsLFxuICAgIENvbXBvbmVudFR5cGUsXG4gICAgUG9ydGFsSW5qZWN0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5cbmV4cG9ydCBjb25zdCBPV0xfRElBTE9HX0RBVEEgPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignT3dsRGlhbG9nRGF0YScpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgZGlhbG9nIGlzIG9wZW4uXG4gKiAqL1xuZXhwb3J0IGNvbnN0IE9XTF9ESUFMT0dfU0NST0xMX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPFxuICAgICgpID0+IFNjcm9sbFN0cmF0ZWd5XG4+KCdvd2wtZGlhbG9nLXNjcm9sbC1zdHJhdGVneScpO1xuXG5leHBvcnQgZnVuY3Rpb24gT1dMX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWShcbiAgICBvdmVybGF5OiBPdmVybGF5XG4pOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gICAgY29uc3QgZm4gPSAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKTtcbiAgICByZXR1cm4gZm47XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgT1dMX0RJQUxPR19TQ1JPTExfU1RSQVRFR1lfUFJPVklERVIgPSB7XG4gICAgcHJvdmlkZTogT1dMX0RJQUxPR19TQ1JPTExfU1RSQVRFR1ksXG4gICAgZGVwczogW092ZXJsYXldLFxuICAgIHVzZUZhY3Rvcnk6IE9XTF9ESUFMT0dfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSX0ZBQ1RPUllcbn07XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IGRpYWxvZyBvcHRpb25zLlxuICogKi9cbmV4cG9ydCBjb25zdCBPV0xfRElBTE9HX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxPd2xEaWFsb2dDb25maWc+KFxuICAgICdvd2wtZGlhbG9nLWRlZmF1bHQtb3B0aW9ucydcbik7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBPd2xEaWFsb2dTZXJ2aWNlIHtcbiAgICBwcml2YXRlIGFyaWFIaWRkZW5FbGVtZW50cyA9IG5ldyBNYXA8RWxlbWVudCwgc3RyaW5nIHwgbnVsbD4oKTtcblxuICAgIHByaXZhdGUgX29wZW5EaWFsb2dzQXRUaGlzTGV2ZWw6IE93bERpYWxvZ1JlZjxhbnk+W10gPSBbXTtcbiAgICBwcml2YXRlIF9hZnRlck9wZW5BdFRoaXNMZXZlbCA9IG5ldyBTdWJqZWN0PE93bERpYWxvZ1JlZjxhbnk+PigpO1xuICAgIHByaXZhdGUgX2FmdGVyQWxsQ2xvc2VkQXRUaGlzTGV2ZWwgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gICAgLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50bHktb3BlbiBkaWFsb2dzLiAqL1xuICAgIGdldCBvcGVuRGlhbG9ncygpOiBPd2xEaWFsb2dSZWY8YW55PltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50RGlhbG9nXG4gICAgICAgICAgICA/IHRoaXMucGFyZW50RGlhbG9nLm9wZW5EaWFsb2dzXG4gICAgICAgICAgICA6IHRoaXMuX29wZW5EaWFsb2dzQXRUaGlzTGV2ZWw7XG4gICAgfVxuXG4gICAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYSBkaWFsb2cgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICAgIGdldCBhZnRlck9wZW4oKTogU3ViamVjdDxPd2xEaWFsb2dSZWY8YW55Pj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnREaWFsb2dcbiAgICAgICAgICAgID8gdGhpcy5wYXJlbnREaWFsb2cuYWZ0ZXJPcGVuXG4gICAgICAgICAgICA6IHRoaXMuX2FmdGVyT3BlbkF0VGhpc0xldmVsO1xuICAgIH1cblxuICAgIGdldCBfYWZ0ZXJBbGxDbG9zZWQoKTogYW55IHtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5wYXJlbnREaWFsb2c7XG4gICAgICAgIHJldHVybiBwYXJlbnRcbiAgICAgICAgICAgID8gcGFyZW50Ll9hZnRlckFsbENsb3NlZFxuICAgICAgICAgICAgOiB0aGlzLl9hZnRlckFsbENsb3NlZEF0VGhpc0xldmVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gYWxsIG9wZW4gZGlhbG9nIGhhdmUgZmluaXNoZWQgY2xvc2luZy5cbiAgICAgKiBXaWxsIGVtaXQgb24gc3Vic2NyaWJlIGlmIHRoZXJlIGFyZSBubyBvcGVuIGRpYWxvZ3MgdG8gYmVnaW4gd2l0aC5cbiAgICAgKi9cblxuICAgIGFmdGVyQWxsQ2xvc2VkOiBPYnNlcnZhYmxlPHt9PiA9IGRlZmVyKFxuICAgICAgICAoKSA9PlxuICAgICAgICAgICAgdGhpcy5fb3BlbkRpYWxvZ3NBdFRoaXNMZXZlbC5sZW5ndGhcbiAgICAgICAgICAgICAgICA/IHRoaXMuX2FmdGVyQWxsQ2xvc2VkXG4gICAgICAgICAgICAgICAgOiB0aGlzLl9hZnRlckFsbENsb3NlZC5waXBlKHN0YXJ0V2l0aCh1bmRlZmluZWQpKVxuICAgICk7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IHNjcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbixcbiAgICAgICAgQEluamVjdChPV0xfRElBTE9HX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICAgICAgQE9wdGlvbmFsKClcbiAgICAgICAgQEluamVjdChPV0xfRElBTE9HX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgcHJpdmF0ZSBkZWZhdWx0T3B0aW9uczogT3dsRGlhbG9nQ29uZmlnSW50ZXJmYWNlLFxuICAgICAgICBAT3B0aW9uYWwoKVxuICAgICAgICBAU2tpcFNlbGYoKVxuICAgICAgICBwcml2YXRlIHBhcmVudERpYWxvZzogT3dsRGlhbG9nU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBvdmVybGF5Q29udGFpbmVyOiBPdmVybGF5Q29udGFpbmVyXG4gICAgKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgICAgICAgaWYgKCFwYXJlbnREaWFsb2cgJiYgbG9jYXRpb24pIHtcbiAgICAgICAgICAgIGxvY2F0aW9uLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlQWxsKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9wZW48VD4oXG4gICAgICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICAgICAgY29uZmlnPzogT3dsRGlhbG9nQ29uZmlnSW50ZXJmYWNlXG4gICAgKTogT3dsRGlhbG9nUmVmPGFueT4ge1xuICAgICAgICBjb25maWcgPSBhcHBseUNvbmZpZ0RlZmF1bHRzKGNvbmZpZywgdGhpcy5kZWZhdWx0T3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5pZCAmJiB0aGlzLmdldERpYWxvZ0J5SWQoY29uZmlnLmlkKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAgICAgYERpYWxvZyB3aXRoIGlkIFwiJHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLmlkXG4gICAgICAgICAgICAgICAgfVwiIGV4aXN0cyBhbHJlYWR5LiBUaGUgZGlhbG9nIGlkIG11c3QgYmUgdW5pcXVlLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5jcmVhdGVPdmVybGF5KGNvbmZpZyk7XG4gICAgICAgIGNvbnN0IGRpYWxvZ0NvbnRhaW5lciA9IHRoaXMuYXR0YWNoRGlhbG9nQ29udGFpbmVyKG92ZXJsYXlSZWYsIGNvbmZpZyk7XG4gICAgICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuYXR0YWNoRGlhbG9nQ29udGVudDxUPihcbiAgICAgICAgICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsXG4gICAgICAgICAgICBkaWFsb2dDb250YWluZXIsXG4gICAgICAgICAgICBvdmVybGF5UmVmLFxuICAgICAgICAgICAgY29uZmlnXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCF0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5oaWRlTm9uRGlhbG9nQ29udGVudEZyb21Bc3Npc3RpdmVUZWNobm9sb2d5KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wZW5EaWFsb2dzLnB1c2goZGlhbG9nUmVmKTtcbiAgICAgICAgZGlhbG9nUmVmXG4gICAgICAgICAgICAuYWZ0ZXJDbG9zZWQoKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlbW92ZU9wZW5EaWFsb2coZGlhbG9nUmVmKSk7XG4gICAgICAgIHRoaXMuYWZ0ZXJPcGVuLm5leHQoZGlhbG9nUmVmKTtcbiAgICAgICAgcmV0dXJuIGRpYWxvZ1JlZjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgYWxsIG9mIHRoZSBjdXJyZW50bHktb3BlbiBkaWFsb2dzLlxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZUFsbCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGkgPSB0aGlzLm9wZW5EaWFsb2dzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5EaWFsb2dzW2ldLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyBhbiBvcGVuIGRpYWxvZyBieSBpdHMgaWQuXG4gICAgICogQHBhcmFtIGlkIElEIHRvIHVzZSB3aGVuIGxvb2tpbmcgdXAgdGhlIGRpYWxvZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RGlhbG9nQnlJZChpZDogc3RyaW5nKTogT3dsRGlhbG9nUmVmPGFueT4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuRGlhbG9ncy5maW5kKGRpYWxvZyA9PiBkaWFsb2cuaWQgPT09IGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF0dGFjaERpYWxvZ0NvbnRlbnQ8VD4oXG4gICAgICAgIGNvbXBvbmVudE9yVGVtcGxhdGVSZWY6IENvbXBvbmVudFR5cGU8VD4gfCBUZW1wbGF0ZVJlZjxUPixcbiAgICAgICAgZGlhbG9nQ29udGFpbmVyOiBPd2xEaWFsb2dDb250YWluZXJDb21wb25lbnQsXG4gICAgICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgICAgIGNvbmZpZzogT3dsRGlhbG9nQ29uZmlnSW50ZXJmYWNlXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZ1JlZiA9IG5ldyBPd2xEaWFsb2dSZWY8VD4oXG4gICAgICAgICAgICBvdmVybGF5UmVmLFxuICAgICAgICAgICAgZGlhbG9nQ29udGFpbmVyLFxuICAgICAgICAgICAgY29uZmlnLmlkLFxuICAgICAgICAgICAgdGhpcy5sb2NhdGlvblxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChjb25maWcuaGFzQmFja2Ryb3ApIHtcbiAgICAgICAgICAgIG92ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkaWFsb2dSZWYuZGlzYWJsZUNsb3NlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpYWxvZ1JlZi5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudE9yVGVtcGxhdGVSZWYgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLmNyZWF0ZUluamVjdG9yPFQ+KFxuICAgICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgICAgICBkaWFsb2dSZWYsXG4gICAgICAgICAgICAgICAgZGlhbG9nQ29udGFpbmVyXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgY29udGVudFJlZiA9IGRpYWxvZ0NvbnRhaW5lci5hdHRhY2hDb21wb25lbnRQb3J0YWwoXG4gICAgICAgICAgICAgICAgbmV3IENvbXBvbmVudFBvcnRhbChjb21wb25lbnRPclRlbXBsYXRlUmVmLCB1bmRlZmluZWQsIGluamVjdG9yKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZSA9IGNvbnRlbnRSZWYuaW5zdGFuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBkaWFsb2dSZWZcbiAgICAgICAgICAgIC51cGRhdGVTaXplKGNvbmZpZy53aWR0aCwgY29uZmlnLmhlaWdodClcbiAgICAgICAgICAgIC51cGRhdGVQb3NpdGlvbihjb25maWcucG9zaXRpb24pO1xuXG4gICAgICAgIHJldHVybiBkaWFsb2dSZWY7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVJbmplY3RvcjxUPihcbiAgICAgICAgY29uZmlnOiBPd2xEaWFsb2dDb25maWdJbnRlcmZhY2UsXG4gICAgICAgIGRpYWxvZ1JlZjogT3dsRGlhbG9nUmVmPFQ+LFxuICAgICAgICBkaWFsb2dDb250YWluZXI6IE93bERpYWxvZ0NvbnRhaW5lckNvbXBvbmVudFxuICAgICkge1xuICAgICAgICBjb25zdCB1c2VySW5qZWN0b3IgPVxuICAgICAgICAgICAgY29uZmlnICYmXG4gICAgICAgICAgICBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJlxuICAgICAgICAgICAgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgICAgIGNvbnN0IGluamVjdGlvblRva2VucyA9IG5ldyBXZWFrTWFwKCk7XG5cbiAgICAgICAgaW5qZWN0aW9uVG9rZW5zLnNldChPd2xEaWFsb2dSZWYsIGRpYWxvZ1JlZik7XG4gICAgICAgIGluamVjdGlvblRva2Vucy5zZXQoT3dsRGlhbG9nQ29udGFpbmVyQ29tcG9uZW50LCBkaWFsb2dDb250YWluZXIpO1xuICAgICAgICBpbmplY3Rpb25Ub2tlbnMuc2V0KE9XTF9ESUFMT0dfREFUQSwgY29uZmlnLmRhdGEpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUG9ydGFsSW5qZWN0b3IoXG4gICAgICAgICAgICB1c2VySW5qZWN0b3IgfHwgdGhpcy5pbmplY3RvcixcbiAgICAgICAgICAgIGluamVjdGlvblRva2Vuc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlT3ZlcmxheShjb25maWc6IE93bERpYWxvZ0NvbmZpZ0ludGVyZmFjZSk6IE92ZXJsYXlSZWYge1xuICAgICAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gdGhpcy5nZXRPdmVybGF5Q29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHJldHVybiB0aGlzLm92ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXR0YWNoRGlhbG9nQ29udGFpbmVyKFxuICAgICAgICBvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgICAgICBjb25maWc6IE93bERpYWxvZ0NvbmZpZ0ludGVyZmFjZVxuICAgICk6IE93bERpYWxvZ0NvbnRhaW5lckNvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lclBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoXG4gICAgICAgICAgICBPd2xEaWFsb2dDb250YWluZXJDb21wb25lbnQsXG4gICAgICAgICAgICBjb25maWcudmlld0NvbnRhaW5lclJlZlxuICAgICAgICApO1xuICAgICAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxcbiAgICAgICAgICAgIE93bERpYWxvZ0NvbnRhaW5lckNvbXBvbmVudFxuICAgICAgICA+ID0gb3ZlcmxheVJlZi5hdHRhY2goY29udGFpbmVyUG9ydGFsKTtcbiAgICAgICAgY29udGFpbmVyUmVmLmluc3RhbmNlLnNldENvbmZpZyhjb25maWcpO1xuXG4gICAgICAgIHJldHVybiBjb250YWluZXJSZWYuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRPdmVybGF5Q29uZmlnKGRpYWxvZ0NvbmZpZzogT3dsRGlhbG9nQ29uZmlnSW50ZXJmYWNlKTogT3ZlcmxheUNvbmZpZyB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCksXG4gICAgICAgICAgICBzY3JvbGxTdHJhdGVneTpcbiAgICAgICAgICAgICAgICBkaWFsb2dDb25maWcuc2Nyb2xsU3RyYXRlZ3kgfHwgdGhpcy5zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICAgICAgcGFuZWxDbGFzczogZGlhbG9nQ29uZmlnLnBhbmVDbGFzcyxcbiAgICAgICAgICAgIGhhc0JhY2tkcm9wOiBkaWFsb2dDb25maWcuaGFzQmFja2Ryb3AsXG4gICAgICAgICAgICBtaW5XaWR0aDogZGlhbG9nQ29uZmlnLm1pbldpZHRoLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiBkaWFsb2dDb25maWcubWluSGVpZ2h0LFxuICAgICAgICAgICAgbWF4V2lkdGg6IGRpYWxvZ0NvbmZpZy5tYXhXaWR0aCxcbiAgICAgICAgICAgIG1heEhlaWdodDogZGlhbG9nQ29uZmlnLm1heEhlaWdodFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZGlhbG9nQ29uZmlnLmJhY2tkcm9wQ2xhc3MpIHtcbiAgICAgICAgICAgIHN0YXRlLmJhY2tkcm9wQ2xhc3MgPSBkaWFsb2dDb25maWcuYmFja2Ryb3BDbGFzcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZU9wZW5EaWFsb2coZGlhbG9nUmVmOiBPd2xEaWFsb2dSZWY8YW55Pik6IHZvaWQge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX29wZW5EaWFsb2dzQXRUaGlzTGV2ZWwuaW5kZXhPZihkaWFsb2dSZWYpO1xuXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5EaWFsb2dzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAvLyBJZiBhbGwgdGhlIGRpYWxvZ3Mgd2VyZSBjbG9zZWQsIHJlbW92ZS9yZXN0b3JlIHRoZSBgYXJpYS1oaWRkZW5gXG4gICAgICAgICAgICAvLyB0byBhIHRoZSBzaWJsaW5ncyBhbmQgZW1pdCB0byB0aGUgYGFmdGVyQWxsQ2xvc2VkYCBzdHJlYW0uXG4gICAgICAgICAgICBpZiAoIXRoaXMub3BlbkRpYWxvZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcmlhSGlkZGVuRWxlbWVudHMuZm9yRWFjaCgocHJldmlvdXNWYWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgcHJldmlvdXNWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hcmlhSGlkZGVuRWxlbWVudHMuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hZnRlckFsbENsb3NlZC5uZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlcyBhbGwgb2YgdGhlIGNvbnRlbnQgdGhhdCBpc24ndCBhbiBvdmVybGF5IGZyb20gYXNzaXN0aXZlIHRlY2hub2xvZ3kuXG4gICAgICovXG4gICAgcHJpdmF0ZSBoaWRlTm9uRGlhbG9nQ29udGVudEZyb21Bc3Npc3RpdmVUZWNobm9sb2d5KCkge1xuICAgICAgICBjb25zdCBvdmVybGF5Q29udGFpbmVyID0gdGhpcy5vdmVybGF5Q29udGFpbmVyLmdldENvbnRhaW5lckVsZW1lbnQoKTtcblxuICAgICAgICAvLyBFbnN1cmUgdGhhdCB0aGUgb3ZlcmxheSBjb250YWluZXIgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS5cbiAgICAgICAgaWYgKG92ZXJsYXlDb250YWluZXIucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3Qgc2libGluZ3MgPSBvdmVybGF5Q29udGFpbmVyLnBhcmVudEVsZW1lbnQuY2hpbGRyZW47XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBzaWJsaW5ncy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpYmxpbmcgPSBzaWJsaW5nc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgc2libGluZyAhPT0gb3ZlcmxheUNvbnRhaW5lciAmJlxuICAgICAgICAgICAgICAgICAgICBzaWJsaW5nLm5vZGVOYW1lICE9PSAnU0NSSVBUJyAmJlxuICAgICAgICAgICAgICAgICAgICBzaWJsaW5nLm5vZGVOYW1lICE9PSAnU1RZTEUnICYmXG4gICAgICAgICAgICAgICAgICAgICFzaWJsaW5nLmhhc0F0dHJpYnV0ZSgnYXJpYS1saXZlJylcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcmlhSGlkZGVuRWxlbWVudHMuc2V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgc2libGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmcuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEFwcGxpZXMgZGVmYXVsdCBvcHRpb25zIHRvIHRoZSBkaWFsb2cgY29uZmlnLlxuICogQHBhcmFtIGNvbmZpZyBDb25maWcgdG8gYmUgbW9kaWZpZWQuXG4gKiBAcGFyYW0gZGVmYXVsdE9wdGlvbnMgRGVmYXVsdCBjb25maWcgc2V0dGluZ1xuICogQHJldHVybnMgVGhlIG5ldyBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYXBwbHlDb25maWdEZWZhdWx0cyhcbiAgICBjb25maWc/OiBPd2xEaWFsb2dDb25maWdJbnRlcmZhY2UsXG4gICAgZGVmYXVsdE9wdGlvbnM/OiBPd2xEaWFsb2dDb25maWdJbnRlcmZhY2Vcbik6IE93bERpYWxvZ0NvbmZpZyB7XG4gICAgcmV0dXJuIGV4dGVuZE9iamVjdChuZXcgT3dsRGlhbG9nQ29uZmlnKCksIGNvbmZpZywgZGVmYXVsdE9wdGlvbnMpO1xufVxuIl19