import { JoyrideStep } from '../models/joyride-step.class';
import { Subject } from 'rxjs';
import { JoyrideOptionsService } from './joyride-options.service';
import { LoggerService } from './logger.service';
import * as i0 from "@angular/core";
export declare enum StepActionType {
    NEXT = "NEXT",
    PREV = "PREV"
}
export declare class JoyrideStepsContainerService {
    private readonly stepOptions;
    private readonly logger;
    private steps;
    private tempSteps;
    private currentStepIndex;
    stepHasBeenModified: Subject<JoyrideStep>;
    constructor(stepOptions: JoyrideOptionsService, logger: LoggerService);
    private getFirstStepIndex;
    init(): void;
    addStep(stepToAdd: JoyrideStep): void;
    get(action: StepActionType): JoyrideStep;
    getStepRoute(action: StepActionType): string;
    updatePosition(stepName: string, position: string): void;
    getStepNumber(stepName: string): number;
    getStepsCount(): number;
    private getStepIndex;
    private getStepName;
    static ɵfac: i0.ɵɵFactoryDeclaration<JoyrideStepsContainerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JoyrideStepsContainerService>;
}
