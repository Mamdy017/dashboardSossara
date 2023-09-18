import { JoyrideStepService } from './joyride-step.service';
import { JoyrideOptionsService } from './joyride-options.service';
import { JoyrideOptions } from '../models/joyride-options.class';
import { Observable } from 'rxjs';
import { JoyrideStepInfo } from '../models/joyride-step-info.class';
import * as i0 from "@angular/core";
export declare class JoyrideService {
    private platformId;
    private readonly stepService;
    private readonly optionsService;
    private tourInProgress;
    private tour$;
    constructor(platformId: Object, stepService: JoyrideStepService, optionsService: JoyrideOptionsService);
    startTour(options?: JoyrideOptions): Observable<JoyrideStepInfo>;
    closeTour(): void;
    isTourInProgress(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<JoyrideService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JoyrideService>;
}
