import { Component, Input, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
import { JoyrideStepService, ARROW_SIZE, DISTANCE_FROM_TARGET } from '../../services';
import * as i0 from "@angular/core";
import * as i1 from "../../services/joyride-steps-container.service";
import * as i2 from "../../services/event-listener.service";
import * as i3 from "../../services/document.service";
import * as i4 from "../../services/logger.service";
import * as i5 from "../../services/joyride-options.service";
import * as i6 from "../../services/templates.service";
import * as i7 from "../arrow/arrow.component";
import * as i8 from "../close-button/close-button.component";
import * as i9 from "../button/button.component";
import * as i10 from "@angular/common";
const STEP_MIN_WIDTH = 200;
const STEP_MAX_WIDTH = 400;
const CUSTOM_STEP_MAX_WIDTH_VW = 90;
const STEP_HEIGHT = 200;
const ASPECT_RATIO = 1.212;
export const DEFAULT_DISTANCE_FROM_MARGIN_TOP = 2;
export const DEFAULT_DISTANCE_FROM_MARGIN_LEFT = 2;
const DEFAULT_DISTANCE_FROM_MARGIN_BOTTOM = 5;
const DEFAULT_DISTANCE_FROM_MARGIN_RIGHT = 5;
export var KEY_CODE;
(function (KEY_CODE) {
    KEY_CODE[KEY_CODE["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
    KEY_CODE[KEY_CODE["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    KEY_CODE[KEY_CODE["ESCAPE_KEY"] = 27] = "ESCAPE_KEY";
})(KEY_CODE || (KEY_CODE = {}));
export class JoyrideStepComponent {
    constructor(injector, stepsContainerService, eventListenerService, documentService, renderer, logger, optionsService, templateService) {
        this.injector = injector;
        this.stepsContainerService = stepsContainerService;
        this.eventListenerService = eventListenerService;
        this.documentService = documentService;
        this.renderer = renderer;
        this.logger = logger;
        this.optionsService = optionsService;
        this.templateService = templateService;
        this.stepWidth = STEP_MIN_WIDTH;
        this.stepHeight = STEP_HEIGHT;
        this.showArrow = true;
        this.arrowSize = ARROW_SIZE;
        this.subscriptions = [];
    }
    ngOnInit() {
        // Need to Inject here otherwise you will obtain a circular dependency
        this.joyrideStepService = this.injector.get(JoyrideStepService);
        this.documentHeight = this.documentService.getDocumentHeight();
        this.subscriptions.push(this.subscribeToResizeEvents());
        this.title = this.step.title.asObservable();
        this.text = this.step.text.asObservable();
        this.setCustomTemplates();
        this.setCustomTexts();
        this.counter = this.getCounter();
        this.isCounterVisible = this.optionsService.isCounterVisible();
        this.isPrevButtonVisible = this.optionsService.isPrevButtonVisible();
        this.themeColor = this.optionsService.getThemeColor();
        if (this.text)
            this.text.subscribe(val => this.checkRedraw(val));
        if (this.title)
            this.title.subscribe(val => this.checkRedraw(val));
    }
    ngAfterViewInit() {
        if (this.isCustomized()) {
            this.renderer.setStyle(this.stepContainer.nativeElement, 'max-width', CUSTOM_STEP_MAX_WIDTH_VW + 'vw');
            this.updateStepDimensions();
        }
        else {
            this.renderer.setStyle(this.stepContainer.nativeElement, 'max-width', STEP_MAX_WIDTH + 'px');
            let dimensions = this.getDimensionsByAspectRatio(this.stepContainer.nativeElement.clientWidth, this.stepContainer.nativeElement.clientHeight, ASPECT_RATIO);
            dimensions = this.adjustDimensions(dimensions.width, dimensions.height);
            this.stepWidth = dimensions.width;
            this.stepHeight = dimensions.height;
            this.renderer.setStyle(this.stepContainer.nativeElement, 'width', this.stepWidth + 'px');
            this.renderer.setStyle(this.stepContainer.nativeElement, 'height', this.stepHeight + 'px');
        }
        this.drawStep();
    }
    checkRedraw(val) {
        if (val != null) {
            // Need to wait that the change is rendered before redrawing
            setTimeout(() => {
                this.redrawStep();
            }, 2);
        }
    }
    isCustomized() {
        return (this.step.stepContent ||
            this.templateService.getCounter() ||
            this.templateService.getPrevButton() ||
            this.templateService.getNextButton() ||
            this.templateService.getDoneButton());
    }
    setCustomTexts() {
        const customeTexts = this.optionsService.getCustomTexts();
        this.prevText = customeTexts.prev;
        this.nextText = customeTexts.next;
        this.doneText = customeTexts.done;
    }
    drawStep() {
        let position = this.step.isElementOrAncestorFixed
            ? 'fixed'
            : 'absolute';
        this.renderer.setStyle(this.stepHolder.nativeElement, 'position', position);
        this.renderer.setStyle(this.stepHolder.nativeElement, 'transform', this.step.transformCssStyle);
        this.targetWidth = this.step.targetViewContainer.element.nativeElement.getBoundingClientRect().width;
        this.targetHeight = this.step.targetViewContainer.element.nativeElement.getBoundingClientRect().height;
        this.targetAbsoluteLeft =
            position === 'fixed'
                ? this.documentService.getElementFixedLeft(this.step.targetViewContainer.element)
                : this.documentService.getElementAbsoluteLeft(this.step.targetViewContainer.element);
        this.targetAbsoluteTop =
            position === 'fixed'
                ? this.documentService.getElementFixedTop(this.step.targetViewContainer.element)
                : this.documentService.getElementAbsoluteTop(this.step.targetViewContainer.element);
        this.setStepStyle();
    }
    getCounter() {
        let stepPosition = this.stepsContainerService.getStepNumber(this.step.name);
        let numberOfSteps = this.stepsContainerService.getStepsCount();
        this.counterData = { step: stepPosition, total: numberOfSteps };
        return stepPosition + '/' + numberOfSteps;
    }
    setCustomTemplates() {
        this.customContent = this.step.stepContent;
        this.ctx = this.step.stepContentParams;
        this.customPrevButton = this.templateService.getPrevButton();
        this.customNextButton = this.templateService.getNextButton();
        this.customDoneButton = this.templateService.getDoneButton();
        this.customCounter = this.templateService.getCounter();
    }
    keyEvent(event) {
        console.log(event);
        if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
            if (this.isLastStep()) {
                this.close();
            }
            else {
                this.next();
            }
        }
        else if (event.keyCode === KEY_CODE.LEFT_ARROW) {
            this.prev();
        }
        else if (event.keyCode === KEY_CODE.ESCAPE_KEY) {
            this.close();
        }
    }
    prev() {
        this.joyrideStepService.prev();
    }
    next() {
        this.joyrideStepService.next();
    }
    close() {
        this.joyrideStepService.close();
    }
    isFirstStep() {
        return this.stepsContainerService.getStepNumber(this.step.name) === 1;
    }
    isLastStep() {
        return (this.stepsContainerService.getStepNumber(this.step.name) ===
            this.stepsContainerService.getStepsCount());
    }
    setStepStyle() {
        switch (this.step.position) {
            case 'top': {
                this.setStyleTop();
                break;
            }
            case 'bottom': {
                this.setStyleBottom();
                break;
            }
            case 'right': {
                this.setStyleRight();
                break;
            }
            case 'left': {
                this.setStyleLeft();
                break;
            }
            case 'center': {
                this.setStyleCenter();
                break;
            }
            default: {
                this.setStyleBottom();
            }
        }
    }
    setStyleTop() {
        this.stepsContainerService.updatePosition(this.step.name, 'top');
        this.topPosition =
            this.targetAbsoluteTop - DISTANCE_FROM_TARGET - this.stepHeight;
        this.stepAbsoluteTop =
            this.targetAbsoluteTop - DISTANCE_FROM_TARGET - this.stepHeight;
        this.arrowTopPosition = this.stepHeight;
        this.leftPosition =
            this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.stepAbsoluteLeft =
            this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.arrowLeftPosition = this.stepWidth / 2 - this.arrowSize;
        this.adjustLeftPosition();
        this.adjustRightPosition();
        this.arrowPosition = 'bottom';
        this.autofixTopPosition();
    }
    setStyleRight() {
        this.stepsContainerService.updatePosition(this.step.name, 'right');
        this.topPosition =
            this.targetAbsoluteTop +
                this.targetHeight / 2 -
                this.stepHeight / 2;
        this.stepAbsoluteTop =
            this.targetAbsoluteTop +
                this.targetHeight / 2 -
                this.stepHeight / 2;
        this.arrowTopPosition = this.stepHeight / 2 - this.arrowSize;
        this.leftPosition =
            this.targetAbsoluteLeft + this.targetWidth + DISTANCE_FROM_TARGET;
        this.stepAbsoluteLeft =
            this.targetAbsoluteLeft + this.targetWidth + DISTANCE_FROM_TARGET;
        this.arrowLeftPosition = -this.arrowSize;
        this.adjustTopPosition();
        this.adjustBottomPosition();
        this.arrowPosition = 'left';
        this.autofixRightPosition();
    }
    setStyleBottom() {
        this.stepsContainerService.updatePosition(this.step.name, 'bottom');
        this.topPosition =
            this.targetAbsoluteTop + this.targetHeight + DISTANCE_FROM_TARGET;
        this.stepAbsoluteTop =
            this.targetAbsoluteTop + this.targetHeight + DISTANCE_FROM_TARGET;
        this.arrowTopPosition = -this.arrowSize;
        this.arrowLeftPosition = this.stepWidth / 2 - this.arrowSize;
        this.leftPosition =
            this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.stepAbsoluteLeft =
            this.targetWidth / 2 - this.stepWidth / 2 + this.targetAbsoluteLeft;
        this.adjustLeftPosition();
        this.adjustRightPosition();
        this.arrowPosition = 'top';
        this.autofixBottomPosition();
    }
    setStyleLeft() {
        this.stepsContainerService.updatePosition(this.step.name, 'left');
        this.topPosition =
            this.targetAbsoluteTop +
                this.targetHeight / 2 -
                this.stepHeight / 2;
        this.stepAbsoluteTop =
            this.targetAbsoluteTop +
                this.targetHeight / 2 -
                this.stepHeight / 2;
        this.arrowTopPosition = this.stepHeight / 2 - this.arrowSize;
        this.leftPosition =
            this.targetAbsoluteLeft - this.stepWidth - DISTANCE_FROM_TARGET;
        this.stepAbsoluteLeft =
            this.targetAbsoluteLeft - this.stepWidth - DISTANCE_FROM_TARGET;
        this.arrowLeftPosition = this.stepWidth;
        this.adjustTopPosition();
        this.adjustBottomPosition();
        this.arrowPosition = 'right';
        this.autofixLeftPosition();
    }
    setStyleCenter() {
        this.renderer.setStyle(this.stepHolder.nativeElement, 'position', 'fixed');
        this.renderer.setStyle(this.stepHolder.nativeElement, 'top', '50%');
        this.renderer.setStyle(this.stepHolder.nativeElement, 'left', '50%');
        this.updateStepDimensions();
        this.renderer.setStyle(this.stepHolder.nativeElement, 'transform', `translate(-${this.stepWidth / 2}px, -${this.stepHeight / 2}px)`);
        this.showArrow = false;
    }
    adjustLeftPosition() {
        if (this.leftPosition < 0) {
            this.arrowLeftPosition =
                this.arrowLeftPosition +
                    this.leftPosition -
                    DEFAULT_DISTANCE_FROM_MARGIN_LEFT;
            this.leftPosition = DEFAULT_DISTANCE_FROM_MARGIN_LEFT;
        }
    }
    adjustRightPosition() {
        let currentWindowWidth = document.body.clientWidth;
        if (this.stepAbsoluteLeft + this.stepWidth > currentWindowWidth) {
            let newLeftPos = this.leftPosition -
                (this.stepAbsoluteLeft +
                    this.stepWidth +
                    DEFAULT_DISTANCE_FROM_MARGIN_RIGHT -
                    currentWindowWidth);
            let deltaLeftPosition = newLeftPos - this.leftPosition;
            this.leftPosition = newLeftPos;
            this.arrowLeftPosition = this.arrowLeftPosition - deltaLeftPosition;
        }
    }
    adjustTopPosition() {
        if (this.stepAbsoluteTop < 0) {
            this.arrowTopPosition =
                this.arrowTopPosition +
                    this.topPosition -
                    DEFAULT_DISTANCE_FROM_MARGIN_TOP;
            this.topPosition = DEFAULT_DISTANCE_FROM_MARGIN_TOP;
        }
    }
    adjustBottomPosition() {
        if (this.stepAbsoluteTop + this.stepHeight > this.documentHeight) {
            let newTopPos = this.topPosition -
                (this.stepAbsoluteTop +
                    this.stepHeight +
                    DEFAULT_DISTANCE_FROM_MARGIN_BOTTOM -
                    this.documentHeight);
            let deltaTopPosition = newTopPos - this.topPosition;
            this.topPosition = newTopPos;
            this.arrowTopPosition = this.arrowTopPosition - deltaTopPosition;
        }
    }
    autofixTopPosition() {
        if (this.positionAlreadyFixed) {
            this.logger.warn('No step positions found for this step. The step will be centered.');
        }
        else if (this.targetAbsoluteTop - this.stepHeight - this.arrowSize <
            0) {
            this.positionAlreadyFixed = true;
            this.setStyleRight();
        }
    }
    autofixRightPosition() {
        if (this.targetAbsoluteLeft +
            this.targetWidth +
            this.stepWidth +
            this.arrowSize >
            document.body.clientWidth) {
            this.setStyleBottom();
        }
    }
    autofixBottomPosition() {
        if (this.targetAbsoluteTop +
            this.stepHeight +
            this.arrowSize +
            this.targetHeight >
            this.documentHeight) {
            this.setStyleLeft();
        }
    }
    autofixLeftPosition() {
        if (this.targetAbsoluteLeft - this.stepWidth - this.arrowSize < 0) {
            this.setStyleTop();
        }
    }
    subscribeToResizeEvents() {
        return this.eventListenerService.resizeEvent.subscribe(() => {
            this.redrawStep();
        });
    }
    redrawStep() {
        this.updateStepDimensions();
        this.drawStep();
    }
    getDimensionsByAspectRatio(width, height, aspectRatio) {
        let calcHeight = (width + height) / (1 + aspectRatio);
        let calcWidth = calcHeight * aspectRatio;
        return {
            width: calcWidth,
            height: calcHeight
        };
    }
    adjustDimensions(width, height) {
        let area = width * height;
        let newWidth = width;
        let newHeight = height;
        if (width > STEP_MAX_WIDTH) {
            newWidth = STEP_MAX_WIDTH;
            newHeight = area / newWidth;
        }
        else if (width < STEP_MIN_WIDTH) {
            newWidth = STEP_MIN_WIDTH;
            newHeight = STEP_MIN_WIDTH / ASPECT_RATIO;
        }
        return {
            width: newWidth,
            height: newHeight
        };
    }
    updateStepDimensions() {
        this.stepWidth = this.stepContainer.nativeElement.clientWidth;
        this.stepHeight = this.stepContainer.nativeElement.clientHeight;
    }
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
JoyrideStepComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideStepComponent, deps: [{ token: i0.Injector }, { token: i1.JoyrideStepsContainerService }, { token: i2.EventListenerService }, { token: i3.DocumentService }, { token: i0.Renderer2 }, { token: i4.LoggerService }, { token: i5.JoyrideOptionsService }, { token: i6.TemplatesService }], target: i0.ɵɵFactoryTarget.Component });
JoyrideStepComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.1", type: JoyrideStepComponent, selector: "joyride-step", inputs: { step: "step" }, host: { listeners: { "window:keyup": "keyEvent($event)" } }, viewQueries: [{ propertyName: "stepHolder", first: true, predicate: ["stepHolder"], descendants: true, static: true }, { propertyName: "stepContainer", first: true, predicate: ["stepContainer"], descendants: true, static: true }], ngImport: i0, template: "<div #stepHolder class=\"joyride-step__holder\" [id]=\"'joyride-step-' + step.name\" [style.top.px]=\"topPosition\" [style.left.px]=\"leftPosition\">\n    <joyride-arrow *ngIf=\"showArrow\" class=\"joyride-step__arrow\" [position]=\"arrowPosition\" [style.top.px]=\"arrowTopPosition\"\n        [style.left.px]=\"arrowLeftPosition\"></joyride-arrow>\n    <div #stepContainer class=\"joyride-step__container\">\n        <joy-close-button class=\"joyride-step__close\" (click)=\"close()\"></joy-close-button>\n        <div class=\"joyride-step__header\">\n            <div class=\"joyride-step__title\" [style.color]=\"themeColor\">{{ title | async }}</div>\n        </div>\n        <div class=\"joyride-step__body\">\n            <ng-container *ngTemplateOutlet=\"customContent ? customContent : defaultContent; context: ctx\"></ng-container>\n            <ng-template #defaultContent>\n                {{ text | async }}\n            </ng-template>\n        </div>\n        <div class=\"joyride-step__footer\">\n            <div *ngIf=\"isCounterVisible\" class=\"joyride-step__counter-container\">\n                <ng-container *ngTemplateOutlet=\"customCounter ? customCounter : defaultCounter; context: counterData\"></ng-container>\n                <ng-template #defaultCounter>\n                    <div class=\"joyride-step__counter\">{{ counter }}</div>\n                </ng-template>\n            </div>\n            <div class=\"joyride-step__buttons-container\">\n                <div class=\"joyride-step__prev-container joyride-step__button\" *ngIf=\"isPrevButtonVisible && !isFirstStep()\" (click)=\"prev()\">\n                    <ng-container *ngTemplateOutlet=\"customPrevButton ? customPrevButton : defaultPrevButton\"></ng-container>\n                    <ng-template #defaultPrevButton>\n                        <joyride-button class=\"joyride-step__prev-button\" [color]=\"themeColor\">{{ prevText | async }}</joyride-button>\n                    </ng-template>\n                </div>\n                <div class=\"joyride-step__next-container joyride-step__button\" *ngIf=\"!isLastStep(); else doneButton\" (click)=\"next()\">\n                    <ng-container *ngTemplateOutlet=\"customNextButton ? customNextButton : defaulNextButton\"></ng-container>\n                    <ng-template #defaulNextButton>\n                        <joyride-button [color]=\"themeColor\">{{ nextText | async }}</joyride-button>\n                    </ng-template>\n                </div>\n                <ng-template #doneButton>\n                    <div class=\"joyride-step__done-container joyride-step__button\" (click)=\"close()\">\n                        <ng-container *ngTemplateOutlet=\"customDoneButton ? customDoneButton : defaultDoneButton\"></ng-container>\n                        <ng-template #defaultDoneButton>\n                            <joyride-button class=\"joyride-step__done-button\" [color]=\"themeColor\">{{ doneText | async }}</joyride-button>\n                        </ng-template>\n                    </div>\n                </ng-template>\n            </div>\n        </div>\n    </div>\n</div>", styles: [".joyride-step__holder{position:absolute;font-family:Arial,Helvetica,sans-serif;font-size:16px;z-index:1001}.joyride-step__arrow{position:absolute;left:40px;z-index:1002}.joyride-step__container{box-sizing:border-box;position:relative;color:#000;background-color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:10px;box-shadow:0 0 30px 1px #000}.joyride-step__header{display:flex;align-items:center;padding:8px}.joyride-step__title{font-weight:700;font-size:20px}.joyride-step__close{position:absolute;right:10px;top:10px;width:14px;height:14px;cursor:pointer}.joyride-step__body{text-align:left;padding:10px 8px}.joyride-step__footer{display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding-left:8px}.joyride-step__buttons-container{display:flex;flex-direction:row}.joyride-step__button:first-child{margin-right:2.5px}.joyride-step__button:last-child{margin-left:2.5px}.joyride-step__counter{font-weight:700;font-size:14px}.joyride-step__counter-container{margin-right:10px}\n"], components: [{ type: i7.JoyrideArrowComponent, selector: "joyride-arrow", inputs: ["position"] }, { type: i8.JoyrideCloseButtonComponent, selector: "joy-close-button" }, { type: i9.JoyrideButtonComponent, selector: "joyride-button", inputs: ["color"], outputs: ["clicked"] }], directives: [{ type: i10.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i10.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], pipes: { "async": i10.AsyncPipe }, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideStepComponent, decorators: [{
            type: Component,
            args: [{ selector: 'joyride-step', encapsulation: ViewEncapsulation.None, template: "<div #stepHolder class=\"joyride-step__holder\" [id]=\"'joyride-step-' + step.name\" [style.top.px]=\"topPosition\" [style.left.px]=\"leftPosition\">\n    <joyride-arrow *ngIf=\"showArrow\" class=\"joyride-step__arrow\" [position]=\"arrowPosition\" [style.top.px]=\"arrowTopPosition\"\n        [style.left.px]=\"arrowLeftPosition\"></joyride-arrow>\n    <div #stepContainer class=\"joyride-step__container\">\n        <joy-close-button class=\"joyride-step__close\" (click)=\"close()\"></joy-close-button>\n        <div class=\"joyride-step__header\">\n            <div class=\"joyride-step__title\" [style.color]=\"themeColor\">{{ title | async }}</div>\n        </div>\n        <div class=\"joyride-step__body\">\n            <ng-container *ngTemplateOutlet=\"customContent ? customContent : defaultContent; context: ctx\"></ng-container>\n            <ng-template #defaultContent>\n                {{ text | async }}\n            </ng-template>\n        </div>\n        <div class=\"joyride-step__footer\">\n            <div *ngIf=\"isCounterVisible\" class=\"joyride-step__counter-container\">\n                <ng-container *ngTemplateOutlet=\"customCounter ? customCounter : defaultCounter; context: counterData\"></ng-container>\n                <ng-template #defaultCounter>\n                    <div class=\"joyride-step__counter\">{{ counter }}</div>\n                </ng-template>\n            </div>\n            <div class=\"joyride-step__buttons-container\">\n                <div class=\"joyride-step__prev-container joyride-step__button\" *ngIf=\"isPrevButtonVisible && !isFirstStep()\" (click)=\"prev()\">\n                    <ng-container *ngTemplateOutlet=\"customPrevButton ? customPrevButton : defaultPrevButton\"></ng-container>\n                    <ng-template #defaultPrevButton>\n                        <joyride-button class=\"joyride-step__prev-button\" [color]=\"themeColor\">{{ prevText | async }}</joyride-button>\n                    </ng-template>\n                </div>\n                <div class=\"joyride-step__next-container joyride-step__button\" *ngIf=\"!isLastStep(); else doneButton\" (click)=\"next()\">\n                    <ng-container *ngTemplateOutlet=\"customNextButton ? customNextButton : defaulNextButton\"></ng-container>\n                    <ng-template #defaulNextButton>\n                        <joyride-button [color]=\"themeColor\">{{ nextText | async }}</joyride-button>\n                    </ng-template>\n                </div>\n                <ng-template #doneButton>\n                    <div class=\"joyride-step__done-container joyride-step__button\" (click)=\"close()\">\n                        <ng-container *ngTemplateOutlet=\"customDoneButton ? customDoneButton : defaultDoneButton\"></ng-container>\n                        <ng-template #defaultDoneButton>\n                            <joyride-button class=\"joyride-step__done-button\" [color]=\"themeColor\">{{ doneText | async }}</joyride-button>\n                        </ng-template>\n                    </div>\n                </ng-template>\n            </div>\n        </div>\n    </div>\n</div>", styles: [".joyride-step__holder{position:absolute;font-family:Arial,Helvetica,sans-serif;font-size:16px;z-index:1001}.joyride-step__arrow{position:absolute;left:40px;z-index:1002}.joyride-step__container{box-sizing:border-box;position:relative;color:#000;background-color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:10px;box-shadow:0 0 30px 1px #000}.joyride-step__header{display:flex;align-items:center;padding:8px}.joyride-step__title{font-weight:700;font-size:20px}.joyride-step__close{position:absolute;right:10px;top:10px;width:14px;height:14px;cursor:pointer}.joyride-step__body{text-align:left;padding:10px 8px}.joyride-step__footer{display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding-left:8px}.joyride-step__buttons-container{display:flex;flex-direction:row}.joyride-step__button:first-child{margin-right:2.5px}.joyride-step__button:last-child{margin-left:2.5px}.joyride-step__counter{font-weight:700;font-size:14px}.joyride-step__counter-container{margin-right:10px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i1.JoyrideStepsContainerService }, { type: i2.EventListenerService }, { type: i3.DocumentService }, { type: i0.Renderer2 }, { type: i4.LoggerService }, { type: i5.JoyrideOptionsService }, { type: i6.TemplatesService }]; }, propDecorators: { step: [{
                type: Input
            }], stepHolder: [{
                type: ViewChild,
                args: ['stepHolder', { static: true }]
            }], stepContainer: [{
                type: ViewChild,
                args: ['stepContainer', { static: true }]
            }], keyEvent: [{
                type: HostListener,
                args: ['window:keyup', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam95cmlkZS1zdGVwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1qb3lyaWRlL3NyYy9saWIvY29tcG9uZW50cy9zdGVwL2pveXJpZGUtc3RlcC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtam95cmlkZS9zcmMvbGliL2NvbXBvbmVudHMvc3RlcC9qb3lyaWRlLXN0ZXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFDVCxLQUFLLEVBRUwsaUJBQWlCLEVBSWpCLFNBQVMsRUFJVCxZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNILGtCQUFrQixFQUNsQixVQUFVLEVBQ1Ysb0JBQW9CLEVBRXZCLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7Ozs7OztBQVN4QixNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDM0IsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBQzNCLE1BQU0sd0JBQXdCLEdBQUcsRUFBRSxDQUFDO0FBQ3BDLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQztBQUN4QixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDM0IsTUFBTSxDQUFDLE1BQU0sZ0NBQWdDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sQ0FBQyxNQUFNLGlDQUFpQyxHQUFHLENBQUMsQ0FBQztBQUNuRCxNQUFNLG1DQUFtQyxHQUFHLENBQUMsQ0FBQztBQUM5QyxNQUFNLGtDQUFrQyxHQUFHLENBQUMsQ0FBQztBQUM3QyxNQUFNLENBQU4sSUFBWSxRQUlYO0FBSkQsV0FBWSxRQUFRO0lBQ2xCLHNEQUFnQixDQUFBO0lBQ2hCLG9EQUFlLENBQUE7SUFDZixvREFBYyxDQUFBO0FBQ2hCLENBQUMsRUFKVyxRQUFRLEtBQVIsUUFBUSxRQUluQjtBQVFELE1BQU0sT0FBTyxvQkFBb0I7SUE2QzdCLFlBQ1ksUUFBa0IsRUFDVCxxQkFBbUQsRUFDbkQsb0JBQTBDLEVBQzFDLGVBQWdDLEVBQ2hDLFFBQW1CLEVBQ25CLE1BQXFCLEVBQ3JCLGNBQXFDLEVBQ3JDLGVBQWlDO1FBUDFDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDVCwwQkFBcUIsR0FBckIscUJBQXFCLENBQThCO1FBQ25ELHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUNyQixtQkFBYyxHQUFkLGNBQWMsQ0FBdUI7UUFDckMsb0JBQWUsR0FBZixlQUFlLENBQWtCO1FBcER0RCxjQUFTLEdBQVcsY0FBYyxDQUFDO1FBQ25DLGVBQVUsR0FBVyxXQUFXLENBQUM7UUFHakMsY0FBUyxHQUFHLElBQUksQ0FBQztRQWtCVCxjQUFTLEdBQVcsVUFBVSxDQUFDO1FBUS9CLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztJQXVCeEMsQ0FBQztJQUVKLFFBQVE7UUFDSixzRUFBc0U7UUFDdEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFMUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXRCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNyRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFdEQsSUFBSSxJQUFJLENBQUMsSUFBSTtZQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksSUFBSSxDQUFDLEtBQUs7WUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUNsQixJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFDaEMsV0FBVyxFQUNYLHdCQUF3QixHQUFHLElBQUksQ0FDbEMsQ0FBQztZQUNGLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQy9CO2FBQU07WUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQ2hDLFdBQVcsRUFDWCxjQUFjLEdBQUcsSUFBSSxDQUN4QixDQUFDO1lBQ0YsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFlBQVksRUFDN0MsWUFBWSxDQUNmLENBQUM7WUFDRixVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUM5QixVQUFVLENBQUMsS0FBSyxFQUNoQixVQUFVLENBQUMsTUFBTSxDQUNwQixDQUFDO1lBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztZQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQ2hDLE9BQU8sRUFDUCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FDeEIsQ0FBQztZQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUNsQixJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFDaEMsUUFBUSxFQUNSLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUN6QixDQUFDO1NBQ0w7UUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVPLFdBQVcsQ0FBQyxHQUFHO1FBQ25CLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtZQUNiLDREQUE0RDtZQUM1RCxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNaLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN0QixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDVDtJQUNMLENBQUM7SUFFTyxZQUFZO1FBQ2hCLE9BQU8sQ0FDSCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUU7WUFDakMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUU7WUFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUU7WUFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FDdkMsQ0FBQztJQUNOLENBQUM7SUFFTyxjQUFjO1FBQ2xCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUM7SUFDdEMsQ0FBQztJQUVPLFFBQVE7UUFDWixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QjtZQUM3QyxDQUFDLENBQUMsT0FBTztZQUNULENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUM3QixVQUFVLEVBQ1YsUUFBUSxDQUNYLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQzdCLFdBQVcsRUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUM5QixDQUFDO1FBQ0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDckcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDdkcsSUFBSSxDQUFDLGtCQUFrQjtZQUNuQixRQUFRLEtBQUssT0FBTztnQkFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUN4QztnQkFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsQ0FDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQ3hDLENBQUM7UUFDWixJQUFJLENBQUMsaUJBQWlCO1lBQ2xCLFFBQVEsS0FBSyxPQUFPO2dCQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQ3hDO2dCQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FDeEMsQ0FBQztRQUNaLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU8sVUFBVTtRQUNkLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNqQixDQUFDO1FBQ0YsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQy9ELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQztRQUNoRSxPQUFPLFlBQVksR0FBRyxHQUFHLEdBQUcsYUFBYSxDQUFDO0lBQzlDLENBQUM7SUFFTyxrQkFBa0I7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMzQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDdkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDN0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDN0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFJRCxRQUFRLENBQUMsS0FBb0I7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuQixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLFdBQVcsRUFBRTtZQUMxQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDckIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2Q7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2I7U0FDRjthQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ2hELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO2FBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDaEQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2Q7SUFDSCxDQUFDO0lBRUMsSUFBSTtRQUNBLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsV0FBVztRQUNQLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsVUFBVTtRQUNOLE9BQU8sQ0FDSCxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3hELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsQ0FDN0MsQ0FBQztJQUNOLENBQUM7SUFFTyxZQUFZO1FBQ2hCLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDeEIsS0FBSyxLQUFLLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ25CLE1BQU07YUFDVDtZQUNELEtBQUssUUFBUSxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixNQUFNO2FBQ1Q7WUFDRCxLQUFLLE9BQU8sQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsTUFBTTthQUNUO1lBQ0QsS0FBSyxNQUFNLENBQUMsQ0FBQztnQkFDVCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3BCLE1BQU07YUFDVDtZQUNELEtBQUssUUFBUSxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixNQUFNO2FBQ1Q7WUFDRCxPQUFPLENBQUMsQ0FBQztnQkFDTCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDekI7U0FDSjtJQUNMLENBQUM7SUFFTyxXQUFXO1FBQ2YsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsV0FBVztZQUNaLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3BFLElBQUksQ0FBQyxlQUFlO1lBQ2hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3BFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBRXhDLElBQUksQ0FBQyxZQUFZO1lBQ2IsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ3hFLElBQUksQ0FBQyxnQkFBZ0I7WUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ3hFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO1FBQzlCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFTyxhQUFhO1FBQ2pCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFdBQVc7WUFDWixJQUFJLENBQUMsaUJBQWlCO2dCQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxlQUFlO1lBQ2hCLElBQUksQ0FBQyxpQkFBaUI7Z0JBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFN0QsSUFBSSxDQUFDLFlBQVk7WUFDYixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztRQUN0RSxJQUFJLENBQUMsZ0JBQWdCO1lBQ2pCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLG9CQUFvQixDQUFDO1FBQ3RFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDekMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVPLGNBQWM7UUFDbEIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsV0FBVztZQUNaLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLG9CQUFvQixDQUFDO1FBQ3RFLElBQUksQ0FBQyxlQUFlO1lBQ2hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLG9CQUFvQixDQUFDO1FBQ3RFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFeEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0QsSUFBSSxDQUFDLFlBQVk7WUFDYixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFDeEUsSUFBSSxDQUFDLGdCQUFnQjtZQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFDeEUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVPLFlBQVk7UUFDaEIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsV0FBVztZQUNaLElBQUksQ0FBQyxpQkFBaUI7Z0JBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLGVBQWU7WUFDaEIsSUFBSSxDQUFDLGlCQUFpQjtnQkFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDO2dCQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUU3RCxJQUFJLENBQUMsWUFBWTtZQUNiLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDO1FBQ3BFLElBQUksQ0FBQyxnQkFBZ0I7WUFDakIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7UUFDcEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVPLGNBQWM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUM3QixVQUFVLEVBQ1YsT0FBTyxDQUNWLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXJFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBRTVCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFDN0IsV0FBVyxFQUNYLGNBQWMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEtBQUssQ0FDbkUsQ0FBQztRQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFTyxrQkFBa0I7UUFDdEIsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsRUFBRTtZQUN2QixJQUFJLENBQUMsaUJBQWlCO2dCQUNsQixJQUFJLENBQUMsaUJBQWlCO29CQUN0QixJQUFJLENBQUMsWUFBWTtvQkFDakIsaUNBQWlDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxpQ0FBaUMsQ0FBQztTQUN6RDtJQUNMLENBQUM7SUFFTyxtQkFBbUI7UUFDdkIsSUFBSSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNuRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLGtCQUFrQixFQUFFO1lBQzdELElBQUksVUFBVSxHQUNWLElBQUksQ0FBQyxZQUFZO2dCQUNqQixDQUFDLElBQUksQ0FBQyxnQkFBZ0I7b0JBQ2xCLElBQUksQ0FBQyxTQUFTO29CQUNkLGtDQUFrQztvQkFDbEMsa0JBQWtCLENBQUMsQ0FBQztZQUM1QixJQUFJLGlCQUFpQixHQUFHLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBRXZELElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDO1lBQy9CLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7U0FDdkU7SUFDTCxDQUFDO0lBRU8saUJBQWlCO1FBQ3JCLElBQUksSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGdCQUFnQjtnQkFDakIsSUFBSSxDQUFDLGdCQUFnQjtvQkFDckIsSUFBSSxDQUFDLFdBQVc7b0JBQ2hCLGdDQUFnQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsZ0NBQWdDLENBQUM7U0FDdkQ7SUFDTCxDQUFDO0lBRU8sb0JBQW9CO1FBQ3hCLElBQUksSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDOUQsSUFBSSxTQUFTLEdBQ1QsSUFBSSxDQUFDLFdBQVc7Z0JBQ2hCLENBQUMsSUFBSSxDQUFDLGVBQWU7b0JBQ2pCLElBQUksQ0FBQyxVQUFVO29CQUNmLG1DQUFtQztvQkFDbkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzdCLElBQUksZ0JBQWdCLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFFcEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7WUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztTQUNwRTtJQUNMLENBQUM7SUFFTyxrQkFBa0I7UUFDdEIsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ1osbUVBQW1FLENBQ3RFLENBQUM7U0FDTDthQUFNLElBQ0gsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVM7WUFDekQsQ0FBQyxFQUNIO1lBQ0UsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7SUFDTCxDQUFDO0lBRU8sb0JBQW9CO1FBQ3hCLElBQ0ksSUFBSSxDQUFDLGtCQUFrQjtZQUNuQixJQUFJLENBQUMsV0FBVztZQUNoQixJQUFJLENBQUMsU0FBUztZQUNkLElBQUksQ0FBQyxTQUFTO1lBQ2xCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUMzQjtZQUNFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN6QjtJQUNMLENBQUM7SUFFTyxxQkFBcUI7UUFDekIsSUFDSSxJQUFJLENBQUMsaUJBQWlCO1lBQ2xCLElBQUksQ0FBQyxVQUFVO1lBQ2YsSUFBSSxDQUFDLFNBQVM7WUFDZCxJQUFJLENBQUMsWUFBWTtZQUNyQixJQUFJLENBQUMsY0FBYyxFQUNyQjtZQUNFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN2QjtJQUNMLENBQUM7SUFFTyxtQkFBbUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRTtZQUMvRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDdEI7SUFDTCxDQUFDO0lBRU8sdUJBQXVCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3hELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxVQUFVO1FBQ2QsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTywwQkFBMEIsQ0FDOUIsS0FBYSxFQUNiLE1BQWMsRUFDZCxXQUFtQjtRQUVuQixJQUFJLFVBQVUsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQztRQUN0RCxJQUFJLFNBQVMsR0FBRyxVQUFVLEdBQUcsV0FBVyxDQUFDO1FBQ3pDLE9BQU87WUFDSCxLQUFLLEVBQUUsU0FBUztZQUNoQixNQUFNLEVBQUUsVUFBVTtTQUNyQixDQUFDO0lBQ04sQ0FBQztJQUNPLGdCQUFnQixDQUFDLEtBQWEsRUFBRSxNQUFjO1FBQ2xELElBQUksSUFBSSxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDMUIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUN2QixJQUFJLEtBQUssR0FBRyxjQUFjLEVBQUU7WUFDeEIsUUFBUSxHQUFHLGNBQWMsQ0FBQztZQUMxQixTQUFTLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQztTQUMvQjthQUFNLElBQUksS0FBSyxHQUFHLGNBQWMsRUFBRTtZQUMvQixRQUFRLEdBQUcsY0FBYyxDQUFDO1lBQzFCLFNBQVMsR0FBRyxjQUFjLEdBQUcsWUFBWSxDQUFDO1NBQzdDO1FBQ0QsT0FBTztZQUNILEtBQUssRUFBRSxRQUFRO1lBQ2YsTUFBTSxFQUFFLFNBQVM7U0FDcEIsQ0FBQztJQUNOLENBQUM7SUFFTyxvQkFBb0I7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7UUFDOUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7SUFDcEUsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN0QyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztpSEEvZlEsb0JBQW9CO3FHQUFwQixvQkFBb0Isa1hDbERqQyxpa0dBNkNNOzJGREtPLG9CQUFvQjtrQkFOaEMsU0FBUzsrQkFDSSxjQUFjLGlCQUdULGlCQUFpQixDQUFDLElBQUk7a1VBMkM1QixJQUFJO3NCQUFaLEtBQUs7Z0JBQ3FDLFVBQVU7c0JBQXBELFNBQVM7dUJBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFDSyxhQUFhO3NCQUExRCxTQUFTO3VCQUFDLGVBQWUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBMEo1QyxRQUFRO3NCQURQLFlBQVk7dUJBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgSW5wdXQsXG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgICBPbkluaXQsXG4gICAgT25EZXN0cm95LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIFJlbmRlcmVyMixcbiAgICBJbmplY3RvcixcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBIb3N0TGlzdGVuZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKb3lyaWRlU3RlcCB9IGZyb20gJy4uLy4uL21vZGVscy9qb3lyaWRlLXN0ZXAuY2xhc3MnO1xuaW1wb3J0IHtcbiAgICBKb3lyaWRlU3RlcFNlcnZpY2UsXG4gICAgQVJST1dfU0laRSxcbiAgICBESVNUQU5DRV9GUk9NX1RBUkdFVCxcbiAgICBJSm95cmlkZVN0ZXBTZXJ2aWNlXG59IGZyb20gJy4uLy4uL3NlcnZpY2VzJztcbmltcG9ydCB7IEpveXJpZGVTdGVwc0NvbnRhaW5lclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9qb3lyaWRlLXN0ZXBzLWNvbnRhaW5lci5zZXJ2aWNlJztcbmltcG9ydCB7IEV2ZW50TGlzdGVuZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZXZlbnQtbGlzdGVuZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IERvY3VtZW50U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RvY3VtZW50LnNlcnZpY2UnO1xuaW1wb3J0IHsgSm95cmlkZU9wdGlvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvam95cmlkZS1vcHRpb25zLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFRlbXBsYXRlc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy90ZW1wbGF0ZXMuc2VydmljZSc7XG5cbmNvbnN0IFNURVBfTUlOX1dJRFRIID0gMjAwO1xuY29uc3QgU1RFUF9NQVhfV0lEVEggPSA0MDA7XG5jb25zdCBDVVNUT01fU1RFUF9NQVhfV0lEVEhfVlcgPSA5MDtcbmNvbnN0IFNURVBfSEVJR0hUID0gMjAwO1xuY29uc3QgQVNQRUNUX1JBVElPID0gMS4yMTI7XG5leHBvcnQgY29uc3QgREVGQVVMVF9ESVNUQU5DRV9GUk9NX01BUkdJTl9UT1AgPSAyO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfRElTVEFOQ0VfRlJPTV9NQVJHSU5fTEVGVCA9IDI7XG5jb25zdCBERUZBVUxUX0RJU1RBTkNFX0ZST01fTUFSR0lOX0JPVFRPTSA9IDU7XG5jb25zdCBERUZBVUxUX0RJU1RBTkNFX0ZST01fTUFSR0lOX1JJR0hUID0gNTtcbmV4cG9ydCBlbnVtIEtFWV9DT0RFIHtcbiAgUklHSFRfQVJST1cgPSAzOSxcbiAgTEVGVF9BUlJPVyA9IDM3LFxuICBFU0NBUEVfS0VZPSAyN1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2pveXJpZGUtc3RlcCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2pveXJpZGUtc3RlcC5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vam95cmlkZS1zdGVwLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBKb3lyaWRlU3RlcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgICBzdGVwV2lkdGg6IG51bWJlciA9IFNURVBfTUlOX1dJRFRIO1xuICAgIHN0ZXBIZWlnaHQ6IG51bWJlciA9IFNURVBfSEVJR0hUO1xuICAgIGxlZnRQb3NpdGlvbjogbnVtYmVyO1xuICAgIHRvcFBvc2l0aW9uOiBudW1iZXI7XG4gICAgc2hvd0Fycm93ID0gdHJ1ZTtcbiAgICBhcnJvd1Bvc2l0aW9uOiBzdHJpbmc7XG4gICAgYXJyb3dMZWZ0UG9zaXRpb246IG51bWJlcjtcbiAgICBhcnJvd1RvcFBvc2l0aW9uOiBudW1iZXI7XG4gICAgdGl0bGU6IE9ic2VydmFibGU8c3RyaW5nPjtcbiAgICB0ZXh0OiBPYnNlcnZhYmxlPHN0cmluZz47XG4gICAgY291bnRlcjogc3RyaW5nO1xuICAgIGlzQ291bnRlclZpc2libGU6IGJvb2xlYW47XG4gICAgaXNQcmV2QnV0dG9uVmlzaWJsZTogYm9vbGVhbjtcbiAgICB0aGVtZUNvbG9yOiBzdHJpbmc7XG4gICAgY3VzdG9tQ29udGVudDogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBjdXN0b21QcmV2QnV0dG9uOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIGN1c3RvbU5leHRCdXR0b246IFRlbXBsYXRlUmVmPGFueT47XG4gICAgY3VzdG9tRG9uZUJ1dHRvbjogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBjdXN0b21Db3VudGVyOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIGNvdW50ZXJEYXRhOiBhbnk7XG4gICAgY3R4OiBPYmplY3Q7XG5cbiAgICBwcml2YXRlIGFycm93U2l6ZTogbnVtYmVyID0gQVJST1dfU0laRTtcbiAgICBwcml2YXRlIHN0ZXBBYnNvbHV0ZUxlZnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHN0ZXBBYnNvbHV0ZVRvcDogbnVtYmVyO1xuICAgIHByaXZhdGUgdGFyZ2V0V2lkdGg6IG51bWJlcjtcbiAgICB0YXJnZXRIZWlnaHQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHRhcmdldEFic29sdXRlTGVmdDogbnVtYmVyO1xuICAgIHByaXZhdGUgdGFyZ2V0QWJzb2x1dGVUb3A6IG51bWJlcjtcblxuICAgIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgICBqb3lyaWRlU3RlcFNlcnZpY2U6IElKb3lyaWRlU3RlcFNlcnZpY2U7XG5cbiAgICBwcml2YXRlIHBvc2l0aW9uQWxyZWFkeUZpeGVkOiBib29sZWFuO1xuICAgIHByaXZhdGUgZG9jdW1lbnRIZWlnaHQ6IG51bWJlcjtcblxuICAgIHByZXZUZXh0OiBPYnNlcnZhYmxlPHN0cmluZz47XG4gICAgbmV4dFRleHQ6IE9ic2VydmFibGU8c3RyaW5nPjtcbiAgICBkb25lVGV4dDogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuXG4gICAgQElucHV0KCkgc3RlcD86IEpveXJpZGVTdGVwO1xuICAgIEBWaWV3Q2hpbGQoJ3N0ZXBIb2xkZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBzdGVwSG9sZGVyOiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ3N0ZXBDb250YWluZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBzdGVwQ29udGFpbmVyOiBFbGVtZW50UmVmO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHN0ZXBzQ29udGFpbmVyU2VydmljZTogSm95cmlkZVN0ZXBzQ29udGFpbmVyU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBldmVudExpc3RlbmVyU2VydmljZTogRXZlbnRMaXN0ZW5lclNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgZG9jdW1lbnRTZXJ2aWNlOiBEb2N1bWVudFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBsb2dnZXI6IExvZ2dlclNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uc1NlcnZpY2U6IEpveXJpZGVPcHRpb25zU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSB0ZW1wbGF0ZVNlcnZpY2U6IFRlbXBsYXRlc1NlcnZpY2VcbiAgICApIHt9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gTmVlZCB0byBJbmplY3QgaGVyZSBvdGhlcndpc2UgeW91IHdpbGwgb2J0YWluIGEgY2lyY3VsYXIgZGVwZW5kZW5jeVxuICAgICAgICB0aGlzLmpveXJpZGVTdGVwU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KEpveXJpZGVTdGVwU2VydmljZSk7XG5cbiAgICAgICAgdGhpcy5kb2N1bWVudEhlaWdodCA9IHRoaXMuZG9jdW1lbnRTZXJ2aWNlLmdldERvY3VtZW50SGVpZ2h0KCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMuc3Vic2NyaWJlVG9SZXNpemVFdmVudHMoKSk7XG4gICAgICAgIHRoaXMudGl0bGUgPSB0aGlzLnN0ZXAudGl0bGUuYXNPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMudGV4dCA9IHRoaXMuc3RlcC50ZXh0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0Q3VzdG9tVGVtcGxhdGVzKCk7XG4gICAgICAgIHRoaXMuc2V0Q3VzdG9tVGV4dHMoKTtcblxuICAgICAgICB0aGlzLmNvdW50ZXIgPSB0aGlzLmdldENvdW50ZXIoKTtcbiAgICAgICAgdGhpcy5pc0NvdW50ZXJWaXNpYmxlID0gdGhpcy5vcHRpb25zU2VydmljZS5pc0NvdW50ZXJWaXNpYmxlKCk7XG4gICAgICAgIHRoaXMuaXNQcmV2QnV0dG9uVmlzaWJsZSA9IHRoaXMub3B0aW9uc1NlcnZpY2UuaXNQcmV2QnV0dG9uVmlzaWJsZSgpO1xuICAgICAgICB0aGlzLnRoZW1lQ29sb3IgPSB0aGlzLm9wdGlvbnNTZXJ2aWNlLmdldFRoZW1lQ29sb3IoKTtcblxuICAgICAgICBpZiAodGhpcy50ZXh0KSB0aGlzLnRleHQuc3Vic2NyaWJlKHZhbCA9PiB0aGlzLmNoZWNrUmVkcmF3KHZhbCkpO1xuICAgICAgICBpZiAodGhpcy50aXRsZSkgdGhpcy50aXRsZS5zdWJzY3JpYmUodmFsID0+IHRoaXMuY2hlY2tSZWRyYXcodmFsKSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAodGhpcy5pc0N1c3RvbWl6ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXBDb250YWluZXIubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAnbWF4LXdpZHRoJyxcbiAgICAgICAgICAgICAgICBDVVNUT01fU1RFUF9NQVhfV0lEVEhfVlcgKyAndncnXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGVwRGltZW5zaW9ucygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXBDb250YWluZXIubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAnbWF4LXdpZHRoJyxcbiAgICAgICAgICAgICAgICBTVEVQX01BWF9XSURUSCArICdweCdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsZXQgZGltZW5zaW9ucyA9IHRoaXMuZ2V0RGltZW5zaW9uc0J5QXNwZWN0UmF0aW8oXG4gICAgICAgICAgICAgICAgdGhpcy5zdGVwQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy5zdGVwQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgIEFTUEVDVF9SQVRJT1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRpbWVuc2lvbnMgPSB0aGlzLmFkanVzdERpbWVuc2lvbnMoXG4gICAgICAgICAgICAgICAgZGltZW5zaW9ucy53aWR0aCxcbiAgICAgICAgICAgICAgICBkaW1lbnNpb25zLmhlaWdodFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc3RlcFdpZHRoID0gZGltZW5zaW9ucy53aWR0aDtcbiAgICAgICAgICAgIHRoaXMuc3RlcEhlaWdodCA9IGRpbWVuc2lvbnMuaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXBDb250YWluZXIubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAnd2lkdGgnLFxuICAgICAgICAgICAgICAgIHRoaXMuc3RlcFdpZHRoICsgJ3B4J1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICAgICAgdGhpcy5zdGVwQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICAgICAgICAgdGhpcy5zdGVwSGVpZ2h0ICsgJ3B4J1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXdTdGVwKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja1JlZHJhdyh2YWwpIHtcbiAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIHdhaXQgdGhhdCB0aGUgY2hhbmdlIGlzIHJlbmRlcmVkIGJlZm9yZSByZWRyYXdpbmdcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVkcmF3U3RlcCgpO1xuICAgICAgICAgICAgfSwgMik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQ3VzdG9taXplZCgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuc3RlcC5zdGVwQ29udGVudCB8fFxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZVNlcnZpY2UuZ2V0Q291bnRlcigpIHx8XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlU2VydmljZS5nZXRQcmV2QnV0dG9uKCkgfHxcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVTZXJ2aWNlLmdldE5leHRCdXR0b24oKSB8fFxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZVNlcnZpY2UuZ2V0RG9uZUJ1dHRvbigpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDdXN0b21UZXh0cygpIHtcbiAgICAgICAgY29uc3QgY3VzdG9tZVRleHRzID0gdGhpcy5vcHRpb25zU2VydmljZS5nZXRDdXN0b21UZXh0cygpO1xuICAgICAgICB0aGlzLnByZXZUZXh0ID0gY3VzdG9tZVRleHRzLnByZXY7XG4gICAgICAgIHRoaXMubmV4dFRleHQgPSBjdXN0b21lVGV4dHMubmV4dDtcbiAgICAgICAgdGhpcy5kb25lVGV4dCA9IGN1c3RvbWVUZXh0cy5kb25lO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHJhd1N0ZXAoKSB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuc3RlcC5pc0VsZW1lbnRPckFuY2VzdG9yRml4ZWRcbiAgICAgICAgICAgID8gJ2ZpeGVkJ1xuICAgICAgICAgICAgOiAnYWJzb2x1dGUnO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgdGhpcy5zdGVwSG9sZGVyLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAncG9zaXRpb24nLFxuICAgICAgICAgICAgcG9zaXRpb25cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIHRoaXMuc3RlcEhvbGRlci5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICAgICAgICB0aGlzLnN0ZXAudHJhbnNmb3JtQ3NzU3R5bGVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy50YXJnZXRXaWR0aCA9IHRoaXMuc3RlcC50YXJnZXRWaWV3Q29udGFpbmVyLmVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgdGhpcy50YXJnZXRIZWlnaHQgPSB0aGlzLnN0ZXAudGFyZ2V0Vmlld0NvbnRhaW5lci5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICB0aGlzLnRhcmdldEFic29sdXRlTGVmdCA9XG4gICAgICAgICAgICBwb3NpdGlvbiA9PT0gJ2ZpeGVkJ1xuICAgICAgICAgICAgICAgID8gdGhpcy5kb2N1bWVudFNlcnZpY2UuZ2V0RWxlbWVudEZpeGVkTGVmdChcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZXAudGFyZ2V0Vmlld0NvbnRhaW5lci5lbGVtZW50XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgOiB0aGlzLmRvY3VtZW50U2VydmljZS5nZXRFbGVtZW50QWJzb2x1dGVMZWZ0KFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RlcC50YXJnZXRWaWV3Q29udGFpbmVyLmVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgIHRoaXMudGFyZ2V0QWJzb2x1dGVUb3AgPVxuICAgICAgICAgICAgcG9zaXRpb24gPT09ICdmaXhlZCdcbiAgICAgICAgICAgICAgICA/IHRoaXMuZG9jdW1lbnRTZXJ2aWNlLmdldEVsZW1lbnRGaXhlZFRvcChcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZXAudGFyZ2V0Vmlld0NvbnRhaW5lci5lbGVtZW50XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgOiB0aGlzLmRvY3VtZW50U2VydmljZS5nZXRFbGVtZW50QWJzb2x1dGVUb3AoXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGVwLnRhcmdldFZpZXdDb250YWluZXIuZWxlbWVudFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRTdGVwU3R5bGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvdW50ZXIoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHN0ZXBQb3NpdGlvbiA9IHRoaXMuc3RlcHNDb250YWluZXJTZXJ2aWNlLmdldFN0ZXBOdW1iZXIoXG4gICAgICAgICAgICB0aGlzLnN0ZXAubmFtZVxuICAgICAgICApO1xuICAgICAgICBsZXQgbnVtYmVyT2ZTdGVwcyA9IHRoaXMuc3RlcHNDb250YWluZXJTZXJ2aWNlLmdldFN0ZXBzQ291bnQoKTtcbiAgICAgICAgdGhpcy5jb3VudGVyRGF0YSA9IHsgc3RlcDogc3RlcFBvc2l0aW9uLCB0b3RhbDogbnVtYmVyT2ZTdGVwcyB9O1xuICAgICAgICByZXR1cm4gc3RlcFBvc2l0aW9uICsgJy8nICsgbnVtYmVyT2ZTdGVwcztcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEN1c3RvbVRlbXBsYXRlcygpIHtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50ID0gdGhpcy5zdGVwLnN0ZXBDb250ZW50O1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuc3RlcC5zdGVwQ29udGVudFBhcmFtcztcbiAgICAgICAgdGhpcy5jdXN0b21QcmV2QnV0dG9uID0gdGhpcy50ZW1wbGF0ZVNlcnZpY2UuZ2V0UHJldkJ1dHRvbigpO1xuICAgICAgICB0aGlzLmN1c3RvbU5leHRCdXR0b24gPSB0aGlzLnRlbXBsYXRlU2VydmljZS5nZXROZXh0QnV0dG9uKCk7XG4gICAgICAgIHRoaXMuY3VzdG9tRG9uZUJ1dHRvbiA9IHRoaXMudGVtcGxhdGVTZXJ2aWNlLmdldERvbmVCdXR0b24oKTtcbiAgICAgICAgdGhpcy5jdXN0b21Db3VudGVyID0gdGhpcy50ZW1wbGF0ZVNlcnZpY2UuZ2V0Q291bnRlcigpO1xuICAgIH1cblxuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OmtleXVwJywgWyckZXZlbnQnXSlcbiAgICBrZXlFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfQ09ERS5SSUdIVF9BUlJPVykge1xuICAgICAgaWYgKHRoaXMuaXNMYXN0U3RlcCgpKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX0NPREUuTEVGVF9BUlJPVykge1xuICAgICAgdGhpcy5wcmV2KCk7XG4gICAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlfQ09ERS5FU0NBUEVfS0VZKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgICBwcmV2KCkge1xuICAgICAgICB0aGlzLmpveXJpZGVTdGVwU2VydmljZS5wcmV2KCk7XG4gICAgfVxuXG4gICAgbmV4dCgpIHtcbiAgICAgICAgdGhpcy5qb3lyaWRlU3RlcFNlcnZpY2UubmV4dCgpO1xuICAgIH1cblxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLmpveXJpZGVTdGVwU2VydmljZS5jbG9zZSgpO1xuICAgIH1cblxuICAgIGlzRmlyc3RTdGVwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGVwc0NvbnRhaW5lclNlcnZpY2UuZ2V0U3RlcE51bWJlcih0aGlzLnN0ZXAubmFtZSkgPT09IDE7XG4gICAgfVxuXG4gICAgaXNMYXN0U3RlcCgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuc3RlcHNDb250YWluZXJTZXJ2aWNlLmdldFN0ZXBOdW1iZXIodGhpcy5zdGVwLm5hbWUpID09PVxuICAgICAgICAgICAgdGhpcy5zdGVwc0NvbnRhaW5lclNlcnZpY2UuZ2V0U3RlcHNDb3VudCgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTdGVwU3R5bGUoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGVwLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICBjYXNlICd0b3AnOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdHlsZVRvcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnYm90dG9tJzoge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3R5bGVCb3R0b20oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0Jzoge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3R5bGVSaWdodCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnbGVmdCc6IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0eWxlTGVmdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnY2VudGVyJzoge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3R5bGVDZW50ZXIoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0eWxlQm90dG9tKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFN0eWxlVG9wKCkge1xuICAgICAgICB0aGlzLnN0ZXBzQ29udGFpbmVyU2VydmljZS51cGRhdGVQb3NpdGlvbih0aGlzLnN0ZXAubmFtZSwgJ3RvcCcpO1xuICAgICAgICB0aGlzLnRvcFBvc2l0aW9uID1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0QWJzb2x1dGVUb3AgLSBESVNUQU5DRV9GUk9NX1RBUkdFVCAtIHRoaXMuc3RlcEhlaWdodDtcbiAgICAgICAgdGhpcy5zdGVwQWJzb2x1dGVUb3AgPVxuICAgICAgICAgICAgdGhpcy50YXJnZXRBYnNvbHV0ZVRvcCAtIERJU1RBTkNFX0ZST01fVEFSR0VUIC0gdGhpcy5zdGVwSGVpZ2h0O1xuICAgICAgICB0aGlzLmFycm93VG9wUG9zaXRpb24gPSB0aGlzLnN0ZXBIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5sZWZ0UG9zaXRpb24gPVxuICAgICAgICAgICAgdGhpcy50YXJnZXRXaWR0aCAvIDIgLSB0aGlzLnN0ZXBXaWR0aCAvIDIgKyB0aGlzLnRhcmdldEFic29sdXRlTGVmdDtcbiAgICAgICAgdGhpcy5zdGVwQWJzb2x1dGVMZWZ0ID1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0V2lkdGggLyAyIC0gdGhpcy5zdGVwV2lkdGggLyAyICsgdGhpcy50YXJnZXRBYnNvbHV0ZUxlZnQ7XG4gICAgICAgIHRoaXMuYXJyb3dMZWZ0UG9zaXRpb24gPSB0aGlzLnN0ZXBXaWR0aCAvIDIgLSB0aGlzLmFycm93U2l6ZTtcbiAgICAgICAgdGhpcy5hZGp1c3RMZWZ0UG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5hZGp1c3RSaWdodFBvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMuYXJyb3dQb3NpdGlvbiA9ICdib3R0b20nO1xuICAgICAgICB0aGlzLmF1dG9maXhUb3BQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U3R5bGVSaWdodCgpIHtcbiAgICAgICAgdGhpcy5zdGVwc0NvbnRhaW5lclNlcnZpY2UudXBkYXRlUG9zaXRpb24odGhpcy5zdGVwLm5hbWUsICdyaWdodCcpO1xuICAgICAgICB0aGlzLnRvcFBvc2l0aW9uID1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0QWJzb2x1dGVUb3AgK1xuICAgICAgICAgICAgdGhpcy50YXJnZXRIZWlnaHQgLyAyIC1cbiAgICAgICAgICAgIHRoaXMuc3RlcEhlaWdodCAvIDI7XG4gICAgICAgIHRoaXMuc3RlcEFic29sdXRlVG9wID1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0QWJzb2x1dGVUb3AgK1xuICAgICAgICAgICAgdGhpcy50YXJnZXRIZWlnaHQgLyAyIC1cbiAgICAgICAgICAgIHRoaXMuc3RlcEhlaWdodCAvIDI7XG4gICAgICAgIHRoaXMuYXJyb3dUb3BQb3NpdGlvbiA9IHRoaXMuc3RlcEhlaWdodCAvIDIgLSB0aGlzLmFycm93U2l6ZTtcblxuICAgICAgICB0aGlzLmxlZnRQb3NpdGlvbiA9XG4gICAgICAgICAgICB0aGlzLnRhcmdldEFic29sdXRlTGVmdCArIHRoaXMudGFyZ2V0V2lkdGggKyBESVNUQU5DRV9GUk9NX1RBUkdFVDtcbiAgICAgICAgdGhpcy5zdGVwQWJzb2x1dGVMZWZ0ID1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0QWJzb2x1dGVMZWZ0ICsgdGhpcy50YXJnZXRXaWR0aCArIERJU1RBTkNFX0ZST01fVEFSR0VUO1xuICAgICAgICB0aGlzLmFycm93TGVmdFBvc2l0aW9uID0gLXRoaXMuYXJyb3dTaXplO1xuICAgICAgICB0aGlzLmFkanVzdFRvcFBvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMuYWRqdXN0Qm90dG9tUG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5hcnJvd1Bvc2l0aW9uID0gJ2xlZnQnO1xuICAgICAgICB0aGlzLmF1dG9maXhSaWdodFBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTdHlsZUJvdHRvbSgpIHtcbiAgICAgICAgdGhpcy5zdGVwc0NvbnRhaW5lclNlcnZpY2UudXBkYXRlUG9zaXRpb24odGhpcy5zdGVwLm5hbWUsICdib3R0b20nKTtcbiAgICAgICAgdGhpcy50b3BQb3NpdGlvbiA9XG4gICAgICAgICAgICB0aGlzLnRhcmdldEFic29sdXRlVG9wICsgdGhpcy50YXJnZXRIZWlnaHQgKyBESVNUQU5DRV9GUk9NX1RBUkdFVDtcbiAgICAgICAgdGhpcy5zdGVwQWJzb2x1dGVUb3AgPVxuICAgICAgICAgICAgdGhpcy50YXJnZXRBYnNvbHV0ZVRvcCArIHRoaXMudGFyZ2V0SGVpZ2h0ICsgRElTVEFOQ0VfRlJPTV9UQVJHRVQ7XG4gICAgICAgIHRoaXMuYXJyb3dUb3BQb3NpdGlvbiA9IC10aGlzLmFycm93U2l6ZTtcblxuICAgICAgICB0aGlzLmFycm93TGVmdFBvc2l0aW9uID0gdGhpcy5zdGVwV2lkdGggLyAyIC0gdGhpcy5hcnJvd1NpemU7XG4gICAgICAgIHRoaXMubGVmdFBvc2l0aW9uID1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0V2lkdGggLyAyIC0gdGhpcy5zdGVwV2lkdGggLyAyICsgdGhpcy50YXJnZXRBYnNvbHV0ZUxlZnQ7XG4gICAgICAgIHRoaXMuc3RlcEFic29sdXRlTGVmdCA9XG4gICAgICAgICAgICB0aGlzLnRhcmdldFdpZHRoIC8gMiAtIHRoaXMuc3RlcFdpZHRoIC8gMiArIHRoaXMudGFyZ2V0QWJzb2x1dGVMZWZ0O1xuICAgICAgICB0aGlzLmFkanVzdExlZnRQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLmFkanVzdFJpZ2h0UG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5hcnJvd1Bvc2l0aW9uID0gJ3RvcCc7XG4gICAgICAgIHRoaXMuYXV0b2ZpeEJvdHRvbVBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTdHlsZUxlZnQoKSB7XG4gICAgICAgIHRoaXMuc3RlcHNDb250YWluZXJTZXJ2aWNlLnVwZGF0ZVBvc2l0aW9uKHRoaXMuc3RlcC5uYW1lLCAnbGVmdCcpO1xuICAgICAgICB0aGlzLnRvcFBvc2l0aW9uID1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0QWJzb2x1dGVUb3AgK1xuICAgICAgICAgICAgdGhpcy50YXJnZXRIZWlnaHQgLyAyIC1cbiAgICAgICAgICAgIHRoaXMuc3RlcEhlaWdodCAvIDI7XG4gICAgICAgIHRoaXMuc3RlcEFic29sdXRlVG9wID1cbiAgICAgICAgICAgIHRoaXMudGFyZ2V0QWJzb2x1dGVUb3AgK1xuICAgICAgICAgICAgdGhpcy50YXJnZXRIZWlnaHQgLyAyIC1cbiAgICAgICAgICAgIHRoaXMuc3RlcEhlaWdodCAvIDI7XG4gICAgICAgIHRoaXMuYXJyb3dUb3BQb3NpdGlvbiA9IHRoaXMuc3RlcEhlaWdodCAvIDIgLSB0aGlzLmFycm93U2l6ZTtcblxuICAgICAgICB0aGlzLmxlZnRQb3NpdGlvbiA9XG4gICAgICAgICAgICB0aGlzLnRhcmdldEFic29sdXRlTGVmdCAtIHRoaXMuc3RlcFdpZHRoIC0gRElTVEFOQ0VfRlJPTV9UQVJHRVQ7XG4gICAgICAgIHRoaXMuc3RlcEFic29sdXRlTGVmdCA9XG4gICAgICAgICAgICB0aGlzLnRhcmdldEFic29sdXRlTGVmdCAtIHRoaXMuc3RlcFdpZHRoIC0gRElTVEFOQ0VfRlJPTV9UQVJHRVQ7XG4gICAgICAgIHRoaXMuYXJyb3dMZWZ0UG9zaXRpb24gPSB0aGlzLnN0ZXBXaWR0aDtcbiAgICAgICAgdGhpcy5hZGp1c3RUb3BQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLmFkanVzdEJvdHRvbVBvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMuYXJyb3dQb3NpdGlvbiA9ICdyaWdodCc7XG4gICAgICAgIHRoaXMuYXV0b2ZpeExlZnRQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U3R5bGVDZW50ZXIoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICB0aGlzLnN0ZXBIb2xkZXIubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICdwb3NpdGlvbicsXG4gICAgICAgICAgICAnZml4ZWQnXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5zdGVwSG9sZGVyLm5hdGl2ZUVsZW1lbnQsICd0b3AnLCAnNTAlJyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5zdGVwSG9sZGVyLm5hdGl2ZUVsZW1lbnQsICdsZWZ0JywgJzUwJScpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU3RlcERpbWVuc2lvbnMoKTtcblxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgdGhpcy5zdGVwSG9sZGVyLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAndHJhbnNmb3JtJyxcbiAgICAgICAgICAgIGB0cmFuc2xhdGUoLSR7dGhpcy5zdGVwV2lkdGggLyAyfXB4LCAtJHt0aGlzLnN0ZXBIZWlnaHQgLyAyfXB4KWBcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zaG93QXJyb3cgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkanVzdExlZnRQb3NpdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMubGVmdFBvc2l0aW9uIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5hcnJvd0xlZnRQb3NpdGlvbiA9XG4gICAgICAgICAgICAgICAgdGhpcy5hcnJvd0xlZnRQb3NpdGlvbiArXG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0UG9zaXRpb24gLVxuICAgICAgICAgICAgICAgIERFRkFVTFRfRElTVEFOQ0VfRlJPTV9NQVJHSU5fTEVGVDtcbiAgICAgICAgICAgIHRoaXMubGVmdFBvc2l0aW9uID0gREVGQVVMVF9ESVNUQU5DRV9GUk9NX01BUkdJTl9MRUZUO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGp1c3RSaWdodFBvc2l0aW9uKCkge1xuICAgICAgICBsZXQgY3VycmVudFdpbmRvd1dpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcbiAgICAgICAgaWYgKHRoaXMuc3RlcEFic29sdXRlTGVmdCArIHRoaXMuc3RlcFdpZHRoID4gY3VycmVudFdpbmRvd1dpZHRoKSB7XG4gICAgICAgICAgICBsZXQgbmV3TGVmdFBvcyA9XG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0UG9zaXRpb24gLVxuICAgICAgICAgICAgICAgICh0aGlzLnN0ZXBBYnNvbHV0ZUxlZnQgK1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZXBXaWR0aCArXG4gICAgICAgICAgICAgICAgICAgIERFRkFVTFRfRElTVEFOQ0VfRlJPTV9NQVJHSU5fUklHSFQgLVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50V2luZG93V2lkdGgpO1xuICAgICAgICAgICAgbGV0IGRlbHRhTGVmdFBvc2l0aW9uID0gbmV3TGVmdFBvcyAtIHRoaXMubGVmdFBvc2l0aW9uO1xuXG4gICAgICAgICAgICB0aGlzLmxlZnRQb3NpdGlvbiA9IG5ld0xlZnRQb3M7XG4gICAgICAgICAgICB0aGlzLmFycm93TGVmdFBvc2l0aW9uID0gdGhpcy5hcnJvd0xlZnRQb3NpdGlvbiAtIGRlbHRhTGVmdFBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGp1c3RUb3BQb3NpdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RlcEFic29sdXRlVG9wIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5hcnJvd1RvcFBvc2l0aW9uID1cbiAgICAgICAgICAgICAgICB0aGlzLmFycm93VG9wUG9zaXRpb24gK1xuICAgICAgICAgICAgICAgIHRoaXMudG9wUG9zaXRpb24gLVxuICAgICAgICAgICAgICAgIERFRkFVTFRfRElTVEFOQ0VfRlJPTV9NQVJHSU5fVE9QO1xuICAgICAgICAgICAgdGhpcy50b3BQb3NpdGlvbiA9IERFRkFVTFRfRElTVEFOQ0VfRlJPTV9NQVJHSU5fVE9QO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGp1c3RCb3R0b21Qb3NpdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RlcEFic29sdXRlVG9wICsgdGhpcy5zdGVwSGVpZ2h0ID4gdGhpcy5kb2N1bWVudEhlaWdodCkge1xuICAgICAgICAgICAgbGV0IG5ld1RvcFBvcyA9XG4gICAgICAgICAgICAgICAgdGhpcy50b3BQb3NpdGlvbiAtXG4gICAgICAgICAgICAgICAgKHRoaXMuc3RlcEFic29sdXRlVG9wICtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGVwSGVpZ2h0ICtcbiAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9ESVNUQU5DRV9GUk9NX01BUkdJTl9CT1RUT00gLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50SGVpZ2h0KTtcbiAgICAgICAgICAgIGxldCBkZWx0YVRvcFBvc2l0aW9uID0gbmV3VG9wUG9zIC0gdGhpcy50b3BQb3NpdGlvbjtcblxuICAgICAgICAgICAgdGhpcy50b3BQb3NpdGlvbiA9IG5ld1RvcFBvcztcbiAgICAgICAgICAgIHRoaXMuYXJyb3dUb3BQb3NpdGlvbiA9IHRoaXMuYXJyb3dUb3BQb3NpdGlvbiAtIGRlbHRhVG9wUG9zaXRpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGF1dG9maXhUb3BQb3NpdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb25BbHJlYWR5Rml4ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oXG4gICAgICAgICAgICAgICAgJ05vIHN0ZXAgcG9zaXRpb25zIGZvdW5kIGZvciB0aGlzIHN0ZXAuIFRoZSBzdGVwIHdpbGwgYmUgY2VudGVyZWQuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0QWJzb2x1dGVUb3AgLSB0aGlzLnN0ZXBIZWlnaHQgLSB0aGlzLmFycm93U2l6ZSA8XG4gICAgICAgICAgICAwXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbkFscmVhZHlGaXhlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNldFN0eWxlUmlnaHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXV0b2ZpeFJpZ2h0UG9zaXRpb24oKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0QWJzb2x1dGVMZWZ0ICtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldFdpZHRoICtcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXBXaWR0aCArXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJvd1NpemUgPlxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3R5bGVCb3R0b20oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXV0b2ZpeEJvdHRvbVBvc2l0aW9uKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnRhcmdldEFic29sdXRlVG9wICtcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXBIZWlnaHQgK1xuICAgICAgICAgICAgICAgIHRoaXMuYXJyb3dTaXplICtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldEhlaWdodCA+XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50SGVpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdHlsZUxlZnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXV0b2ZpeExlZnRQb3NpdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0QWJzb2x1dGVMZWZ0IC0gdGhpcy5zdGVwV2lkdGggLSB0aGlzLmFycm93U2l6ZSA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3R5bGVUb3AoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlVG9SZXNpemVFdmVudHMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRMaXN0ZW5lclNlcnZpY2UucmVzaXplRXZlbnQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVkcmF3U3RlcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZHJhd1N0ZXAoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RlcERpbWVuc2lvbnMoKTtcbiAgICAgICAgdGhpcy5kcmF3U3RlcCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RGltZW5zaW9uc0J5QXNwZWN0UmF0aW8oXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxuICAgICAgICBhc3BlY3RSYXRpbzogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIGxldCBjYWxjSGVpZ2h0ID0gKHdpZHRoICsgaGVpZ2h0KSAvICgxICsgYXNwZWN0UmF0aW8pO1xuICAgICAgICBsZXQgY2FsY1dpZHRoID0gY2FsY0hlaWdodCAqIGFzcGVjdFJhdGlvO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IGNhbGNXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogY2FsY0hlaWdodFxuICAgICAgICB9O1xuICAgIH1cbiAgICBwcml2YXRlIGFkanVzdERpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGFyZWEgPSB3aWR0aCAqIGhlaWdodDtcbiAgICAgICAgbGV0IG5ld1dpZHRoID0gd2lkdGg7XG4gICAgICAgIGxldCBuZXdIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGlmICh3aWR0aCA+IFNURVBfTUFYX1dJRFRIKSB7XG4gICAgICAgICAgICBuZXdXaWR0aCA9IFNURVBfTUFYX1dJRFRIO1xuICAgICAgICAgICAgbmV3SGVpZ2h0ID0gYXJlYSAvIG5ld1dpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKHdpZHRoIDwgU1RFUF9NSU5fV0lEVEgpIHtcbiAgICAgICAgICAgIG5ld1dpZHRoID0gU1RFUF9NSU5fV0lEVEg7XG4gICAgICAgICAgICBuZXdIZWlnaHQgPSBTVEVQX01JTl9XSURUSCAvIEFTUEVDVF9SQVRJTztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IG5ld1dpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBuZXdIZWlnaHRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVN0ZXBEaW1lbnNpb25zKCkge1xuICAgICAgICB0aGlzLnN0ZXBXaWR0aCA9IHRoaXMuc3RlcENvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICB0aGlzLnN0ZXBIZWlnaHQgPSB0aGlzLnN0ZXBDb250YWluZXIubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YnNjcmlwdGlvbiA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiPGRpdiAjc3RlcEhvbGRlciBjbGFzcz1cImpveXJpZGUtc3RlcF9faG9sZGVyXCIgW2lkXT1cIidqb3lyaWRlLXN0ZXAtJyArIHN0ZXAubmFtZVwiIFtzdHlsZS50b3AucHhdPVwidG9wUG9zaXRpb25cIiBbc3R5bGUubGVmdC5weF09XCJsZWZ0UG9zaXRpb25cIj5cbiAgICA8am95cmlkZS1hcnJvdyAqbmdJZj1cInNob3dBcnJvd1wiIGNsYXNzPVwiam95cmlkZS1zdGVwX19hcnJvd1wiIFtwb3NpdGlvbl09XCJhcnJvd1Bvc2l0aW9uXCIgW3N0eWxlLnRvcC5weF09XCJhcnJvd1RvcFBvc2l0aW9uXCJcbiAgICAgICAgW3N0eWxlLmxlZnQucHhdPVwiYXJyb3dMZWZ0UG9zaXRpb25cIj48L2pveXJpZGUtYXJyb3c+XG4gICAgPGRpdiAjc3RlcENvbnRhaW5lciBjbGFzcz1cImpveXJpZGUtc3RlcF9fY29udGFpbmVyXCI+XG4gICAgICAgIDxqb3ktY2xvc2UtYnV0dG9uIGNsYXNzPVwiam95cmlkZS1zdGVwX19jbG9zZVwiIChjbGljayk9XCJjbG9zZSgpXCI+PC9qb3ktY2xvc2UtYnV0dG9uPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiam95cmlkZS1zdGVwX19oZWFkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqb3lyaWRlLXN0ZXBfX3RpdGxlXCIgW3N0eWxlLmNvbG9yXT1cInRoZW1lQ29sb3JcIj57eyB0aXRsZSB8IGFzeW5jIH19PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiam95cmlkZS1zdGVwX19ib2R5XCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY3VzdG9tQ29udGVudCA/IGN1c3RvbUNvbnRlbnQgOiBkZWZhdWx0Q29udGVudDsgY29udGV4dDogY3R4XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRDb250ZW50PlxuICAgICAgICAgICAgICAgIHt7IHRleHQgfCBhc3luYyB9fVxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJqb3lyaWRlLXN0ZXBfX2Zvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiAqbmdJZj1cImlzQ291bnRlclZpc2libGVcIiBjbGFzcz1cImpveXJpZGUtc3RlcF9fY291bnRlci1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY3VzdG9tQ291bnRlciA/IGN1c3RvbUNvdW50ZXIgOiBkZWZhdWx0Q291bnRlcjsgY29udGV4dDogY291bnRlckRhdGFcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRDb3VudGVyPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiam95cmlkZS1zdGVwX19jb3VudGVyXCI+e3sgY291bnRlciB9fTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqb3lyaWRlLXN0ZXBfX2J1dHRvbnMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpveXJpZGUtc3RlcF9fcHJldi1jb250YWluZXIgam95cmlkZS1zdGVwX19idXR0b25cIiAqbmdJZj1cImlzUHJldkJ1dHRvblZpc2libGUgJiYgIWlzRmlyc3RTdGVwKClcIiAoY2xpY2spPVwicHJldigpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjdXN0b21QcmV2QnV0dG9uID8gY3VzdG9tUHJldkJ1dHRvbiA6IGRlZmF1bHRQcmV2QnV0dG9uXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFByZXZCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8am95cmlkZS1idXR0b24gY2xhc3M9XCJqb3lyaWRlLXN0ZXBfX3ByZXYtYnV0dG9uXCIgW2NvbG9yXT1cInRoZW1lQ29sb3JcIj57eyBwcmV2VGV4dCB8IGFzeW5jIH19PC9qb3lyaWRlLWJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiam95cmlkZS1zdGVwX19uZXh0LWNvbnRhaW5lciBqb3lyaWRlLXN0ZXBfX2J1dHRvblwiICpuZ0lmPVwiIWlzTGFzdFN0ZXAoKTsgZWxzZSBkb25lQnV0dG9uXCIgKGNsaWNrKT1cIm5leHQoKVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY3VzdG9tTmV4dEJ1dHRvbiA/IGN1c3RvbU5leHRCdXR0b24gOiBkZWZhdWxOZXh0QnV0dG9uXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsTmV4dEJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxqb3lyaWRlLWJ1dHRvbiBbY29sb3JdPVwidGhlbWVDb2xvclwiPnt7IG5leHRUZXh0IHwgYXN5bmMgfX08L2pveXJpZGUtYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZG9uZUJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpveXJpZGUtc3RlcF9fZG9uZS1jb250YWluZXIgam95cmlkZS1zdGVwX19idXR0b25cIiAoY2xpY2spPVwiY2xvc2UoKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImN1c3RvbURvbmVCdXR0b24gPyBjdXN0b21Eb25lQnV0dG9uIDogZGVmYXVsdERvbmVCdXR0b25cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdERvbmVCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGpveXJpZGUtYnV0dG9uIGNsYXNzPVwiam95cmlkZS1zdGVwX19kb25lLWJ1dHRvblwiIFtjb2xvcl09XCJ0aGVtZUNvbG9yXCI+e3sgZG9uZVRleHQgfCBhc3luYyB9fTwvam95cmlkZS1idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+Il19