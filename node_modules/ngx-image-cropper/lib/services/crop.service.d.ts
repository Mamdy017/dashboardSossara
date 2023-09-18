import { ElementRef } from '@angular/core';
import { CropperPosition, ImageCroppedEvent, LoadedImage } from '../interfaces';
import { CropperSettings } from '../interfaces/cropper.settings';
import * as i0 from "@angular/core";
export declare class CropService {
    crop(sourceImage: ElementRef, loadedImage: LoadedImage, cropper: CropperPosition, settings: CropperSettings): ImageCroppedEvent | null;
    private getCanvasTranslate;
    private getRatio;
    private getImagePosition;
    private getOffsetImagePosition;
    getResizeRatio(width: number, height: number, settings: CropperSettings): number;
    getQuality(settings: CropperSettings): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<CropService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CropService>;
}
