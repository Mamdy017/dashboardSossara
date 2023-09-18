import { Injectable } from '@angular/core';
import { getTransformationsFromExifData, supportsAutomaticRotation } from '../utils/exif.utils';
import * as i0 from "@angular/core";
export class LoadImageService {
    constructor() {
        this.autoRotateSupported = supportsAutomaticRotation();
    }
    loadImageFile(file, cropperSettings) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (event) => {
                this.loadImage(event.target.result, file.type, cropperSettings)
                    .then(resolve)
                    .catch(reject);
            };
            fileReader.readAsDataURL(file);
        });
    }
    loadImage(imageBase64, imageType, cropperSettings) {
        if (!this.isValidImageType(imageType)) {
            return Promise.reject(new Error('Invalid image type'));
        }
        return this.loadBase64Image(imageBase64, cropperSettings);
    }
    isValidImageType(type) {
        return /image\/(png|jpg|jpeg|bmp|gif|tiff|webp|x-icon|vnd.microsoft.icon)/.test(type);
    }
    loadImageFromURL(url, cropperSettings) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onerror = () => reject;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context?.drawImage(img, 0, 0);
                this.loadBase64Image(canvas.toDataURL(), cropperSettings).then(resolve);
            };
            img.crossOrigin = 'anonymous';
            img.src = url;
        });
    }
    loadBase64Image(imageBase64, cropperSettings) {
        return new Promise((resolve, reject) => {
            const originalImage = new Image();
            originalImage.onload = () => resolve({
                originalImage,
                originalBase64: imageBase64
            });
            originalImage.onerror = reject;
            originalImage.src = imageBase64;
        }).then((res) => this.transformImageBase64(res, cropperSettings));
    }
    async transformImageBase64(res, cropperSettings) {
        const autoRotate = await this.autoRotateSupported;
        const exifTransform = await getTransformationsFromExifData(autoRotate ? -1 : res.originalBase64);
        if (!res.originalImage || !res.originalImage.complete) {
            return Promise.reject(new Error('No image loaded'));
        }
        const loadedImage = {
            original: {
                base64: res.originalBase64,
                image: res.originalImage,
                size: {
                    width: res.originalImage.naturalWidth,
                    height: res.originalImage.naturalHeight
                }
            },
            exifTransform
        };
        return this.transformLoadedImage(loadedImage, cropperSettings);
    }
    async transformLoadedImage(loadedImage, cropperSettings) {
        const canvasRotation = cropperSettings.canvasRotation + loadedImage.exifTransform.rotate;
        const originalSize = {
            width: loadedImage.original.image.naturalWidth,
            height: loadedImage.original.image.naturalHeight
        };
        if (canvasRotation === 0 && !loadedImage.exifTransform.flip && !cropperSettings.containWithinAspectRatio) {
            return {
                original: {
                    base64: loadedImage.original.base64,
                    image: loadedImage.original.image,
                    size: { ...originalSize }
                },
                transformed: {
                    base64: loadedImage.original.base64,
                    image: loadedImage.original.image,
                    size: { ...originalSize }
                },
                exifTransform: loadedImage.exifTransform
            };
        }
        const transformedSize = this.getTransformedSize(originalSize, loadedImage.exifTransform, cropperSettings);
        const canvas = document.createElement('canvas');
        canvas.width = transformedSize.width;
        canvas.height = transformedSize.height;
        const ctx = canvas.getContext('2d');
        ctx?.setTransform(loadedImage.exifTransform.flip ? -1 : 1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
        ctx?.rotate(Math.PI * (canvasRotation / 2));
        ctx?.drawImage(loadedImage.original.image, -originalSize.width / 2, -originalSize.height / 2);
        const transformedBase64 = canvas.toDataURL();
        const transformedImage = await this.loadImageFromBase64(transformedBase64);
        return {
            original: {
                base64: loadedImage.original.base64,
                image: loadedImage.original.image,
                size: { ...originalSize }
            },
            transformed: {
                base64: transformedBase64,
                image: transformedImage,
                size: {
                    width: transformedImage.width,
                    height: transformedImage.height
                }
            },
            exifTransform: loadedImage.exifTransform
        };
    }
    loadImageFromBase64(imageBase64) {
        return new Promise(((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = imageBase64;
        }));
    }
    getTransformedSize(originalSize, exifTransform, cropperSettings) {
        const canvasRotation = cropperSettings.canvasRotation + exifTransform.rotate;
        if (cropperSettings.containWithinAspectRatio) {
            if (canvasRotation % 2) {
                const minWidthToContain = originalSize.width * cropperSettings.aspectRatio;
                const minHeightToContain = originalSize.height / cropperSettings.aspectRatio;
                return {
                    width: Math.max(originalSize.height, minWidthToContain),
                    height: Math.max(originalSize.width, minHeightToContain)
                };
            }
            else {
                const minWidthToContain = originalSize.height * cropperSettings.aspectRatio;
                const minHeightToContain = originalSize.width / cropperSettings.aspectRatio;
                return {
                    width: Math.max(originalSize.width, minWidthToContain),
                    height: Math.max(originalSize.height, minHeightToContain)
                };
            }
        }
        if (canvasRotation % 2) {
            return {
                height: originalSize.width,
                width: originalSize.height
            };
        }
        return {
            width: originalSize.width,
            height: originalSize.height
        };
    }
}
LoadImageService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LoadImageService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LoadImageService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LoadImageService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LoadImageService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1pbWFnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWltYWdlLWNyb3BwZXIvc3JjL2xpYi9zZXJ2aWNlcy9sb2FkLWltYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzQyxPQUFPLEVBQUUsOEJBQThCLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7QUFRaEcsTUFBTSxPQUFPLGdCQUFnQjtJQUQ3QjtRQUdVLHdCQUFtQixHQUFxQix5QkFBeUIsRUFBRSxDQUFDO0tBbUw3RTtJQWpMQyxhQUFhLENBQUMsSUFBVSxFQUFFLGVBQWdDO1FBQ3hELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUNwQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUM7cUJBQzVELElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25CLENBQUMsQ0FBQztZQUNGLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sU0FBUyxDQUFDLFdBQW1CLEVBQUUsU0FBaUIsRUFBRSxlQUFnQztRQUN4RixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFB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Q0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsQ0FBQztpQkFDekQsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLE1BQU0saUJBQWlCLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDO2dCQUM1RSxNQUFNLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQztnQkFDNUUsT0FBTztvQkFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDO29CQUN0RCxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDO2lCQUMxRCxDQUFDO2FBQ0g7U0FDRjtRQUVELElBQUksY0FBYyxHQUFHLENBQUMsRUFBRTtZQUN0QixPQUFPO2dCQUNMLE1BQU0sRUFBRSxZQUFZLENBQUMsS0FBSztnQkFDMUIsS0FBSyxFQUFFLFlBQVksQ0FBQyxNQUFNO2FBQzNCLENBQUM7U0FDSDtRQUNELE9BQU87WUFDTCxLQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUs7WUFDekIsTUFBTSxFQUFFLFlBQVksQ0FBQyxNQUFNO1NBQzVCLENBQUM7SUFDSixDQUFDOzs4R0FwTFUsZ0JBQWdCO2tIQUFoQixnQkFBZ0IsY0FESixNQUFNOzRGQUNsQixnQkFBZ0I7a0JBRDVCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGltZW5zaW9ucywgTG9hZGVkSW1hZ2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IENyb3BwZXJTZXR0aW5ncyB9IGZyb20gJy4uL2ludGVyZmFjZXMvY3JvcHBlci5zZXR0aW5ncyc7XG5pbXBvcnQgeyBFeGlmVHJhbnNmb3JtIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9leGlmLXRyYW5zZm9ybS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZ2V0VHJhbnNmb3JtYXRpb25zRnJvbUV4aWZEYXRhLCBzdXBwb3J0c0F1dG9tYXRpY1JvdGF0aW9uIH0gZnJvbSAnLi4vdXRpbHMvZXhpZi51dGlscyc7XG5cbmludGVyZmFjZSBMb2FkSW1hZ2VCYXNlNjQge1xuICBvcmlnaW5hbEltYWdlOiBIVE1MSW1hZ2VFbGVtZW50O1xuICBvcmlnaW5hbEJhc2U2NDogc3RyaW5nO1xufVxuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBMb2FkSW1hZ2VTZXJ2aWNlIHtcblxuICBwcml2YXRlIGF1dG9Sb3RhdGVTdXBwb3J0ZWQ6IFByb21pc2U8Ym9vbGVhbj4gPSBzdXBwb3J0c0F1dG9tYXRpY1JvdGF0aW9uKCk7XG5cbiAgbG9hZEltYWdlRmlsZShmaWxlOiBGaWxlLCBjcm9wcGVyU2V0dGluZ3M6IENyb3BwZXJTZXR0aW5ncyk6IFByb21pc2U8TG9hZGVkSW1hZ2U+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IChldmVudDogYW55KSA9PiB7XG4gICAgICAgIHRoaXMubG9hZEltYWdlKGV2ZW50LnRhcmdldC5yZXN1bHQsIGZpbGUudHlwZSwgY3JvcHBlclNldHRpbmdzKVxuICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICB9O1xuICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2FkSW1hZ2UoaW1hZ2VCYXNlNjQ6IHN0cmluZywgaW1hZ2VUeXBlOiBzdHJpbmcsIGNyb3BwZXJTZXR0aW5nczogQ3JvcHBlclNldHRpbmdzKTogUHJvbWlzZTxMb2FkZWRJbWFnZT4ge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkSW1hZ2VUeXBlKGltYWdlVHlwZSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0ludmFsaWQgaW1hZ2UgdHlwZScpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubG9hZEJhc2U2NEltYWdlKGltYWdlQmFzZTY0LCBjcm9wcGVyU2V0dGluZ3MpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1ZhbGlkSW1hZ2VUeXBlKHR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAvaW1hZ2VcXC8ocG5nfGpwZ3xqcGVnfGJtcHxnaWZ8dGlmZnx3ZWJwfHgtaWNvbnx2bmQubWljcm9zb2Z0Lmljb24pLy50ZXN0KHR5cGUpO1xuICB9XG5cbiAgbG9hZEltYWdlRnJvbVVSTCh1cmw6IHN0cmluZywgY3JvcHBlclNldHRpbmdzOiBDcm9wcGVyU2V0dGluZ3MpOiBQcm9taXNlPExvYWRlZEltYWdlPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiByZWplY3Q7XG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBjYW52YXMud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuICAgICAgICBjb250ZXh0Py5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcbiAgICAgICAgdGhpcy5sb2FkQmFzZTY0SW1hZ2UoY2FudmFzLnRvRGF0YVVSTCgpLCBjcm9wcGVyU2V0dGluZ3MpLnRoZW4ocmVzb2x2ZSk7XG4gICAgICB9O1xuICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgICBpbWcuc3JjID0gdXJsO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEJhc2U2NEltYWdlKGltYWdlQmFzZTY0OiBzdHJpbmcsIGNyb3BwZXJTZXR0aW5nczogQ3JvcHBlclNldHRpbmdzKTogUHJvbWlzZTxMb2FkZWRJbWFnZT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxMb2FkSW1hZ2VCYXNlNjQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIG9yaWdpbmFsSW1hZ2Uub25sb2FkID0gKCkgPT4gcmVzb2x2ZSh7XG4gICAgICAgIG9yaWdpbmFsSW1hZ2UsXG4gICAgICAgIG9yaWdpbmFsQmFzZTY0OiBpbWFnZUJhc2U2NFxuICAgICAgfSk7XG4gICAgICBvcmlnaW5hbEltYWdlLm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICBvcmlnaW5hbEltYWdlLnNyYyA9IGltYWdlQmFzZTY0O1xuICAgIH0pLnRoZW4oKHJlczogTG9hZEltYWdlQmFzZTY0KSA9PiB0aGlzLnRyYW5zZm9ybUltYWdlQmFzZTY0KHJlcywgY3JvcHBlclNldHRpbmdzKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHRyYW5zZm9ybUltYWdlQmFzZTY0KHJlczogTG9hZEltYWdlQmFzZTY0LCBjcm9wcGVyU2V0dGluZ3M6IENyb3BwZXJTZXR0aW5ncyk6IFByb21pc2U8TG9hZGVkSW1hZ2U+IHtcbiAgICBjb25zdCBhdXRvUm90YXRlID0gYXdhaXQgdGhpcy5hdXRvUm90YXRlU3VwcG9ydGVkO1xuICAgIGNvbnN0IGV4aWZUcmFuc2Zvcm0gPSBhd2FpdCBnZXRUcmFuc2Zvcm1hdGlvbnNGcm9tRXhpZkRhdGEoYXV0b1JvdGF0ZSA/IC0xIDogcmVzLm9yaWdpbmFsQmFzZTY0KTtcbiAgICBpZiAoIXJlcy5vcmlnaW5hbEltYWdlIHx8ICFyZXMub3JpZ2luYWxJbWFnZS5jb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm8gaW1hZ2UgbG9hZGVkJykpO1xuICAgIH1cbiAgICBjb25zdCBsb2FkZWRJbWFnZSA9IHtcbiAgICAgIG9yaWdpbmFsOiB7XG4gICAgICAgIGJhc2U2NDogcmVzLm9yaWdpbmFsQmFzZTY0LFxuICAgICAgICBpbWFnZTogcmVzLm9yaWdpbmFsSW1hZ2UsXG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICB3aWR0aDogcmVzLm9yaWdpbmFsSW1hZ2UubmF0dXJhbFdpZHRoLFxuICAgICAgICAgIGhlaWdodDogcmVzLm9yaWdpbmFsSW1hZ2UubmF0dXJhbEhlaWdodFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXhpZlRyYW5zZm9ybVxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtTG9hZGVkSW1hZ2UobG9hZGVkSW1hZ2UsIGNyb3BwZXJTZXR0aW5ncyk7XG4gIH1cblxuICBhc3luYyB0cmFuc2Zvcm1Mb2FkZWRJbWFnZShsb2FkZWRJbWFnZTogUGFydGlhbDxMb2FkZWRJbWFnZT4sIGNyb3BwZXJTZXR0aW5nczogQ3JvcHBlclNldHRpbmdzKTogUHJvbWlzZTxMb2FkZWRJbWFnZT4ge1xuICAgIGNvbnN0IGNhbnZhc1JvdGF0aW9uID0gY3JvcHBlclNldHRpbmdzLmNhbnZhc1JvdGF0aW9uICsgbG9hZGVkSW1hZ2UuZXhpZlRyYW5zZm9ybSEucm90YXRlO1xuICAgIGNvbnN0IG9yaWdpbmFsU2l6ZSA9IHtcbiAgICAgIHdpZHRoOiBsb2FkZWRJbWFnZS5vcmlnaW5hbCEuaW1hZ2UubmF0dXJhbFdpZHRoLFxuICAgICAgaGVpZ2h0OiBsb2FkZWRJbWFnZS5vcmlnaW5hbCEuaW1hZ2UubmF0dXJhbEhlaWdodFxuICAgIH07XG4gICAgaWYgKGNhbnZhc1JvdGF0aW9uID09PSAwICYmICFsb2FkZWRJbWFnZS5leGlmVHJhbnNmb3JtIS5mbGlwICYmICFjcm9wcGVyU2V0dGluZ3MuY29udGFpbldpdGhpbkFzcGVjdFJhdGlvKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvcmlnaW5hbDoge1xuICAgICAgICAgIGJhc2U2NDogbG9hZGVkSW1hZ2Uub3JpZ2luYWwhLmJhc2U2NCxcbiAgICAgICAgICBpbWFnZTogbG9hZGVkSW1hZ2Uub3JpZ2luYWwhLmltYWdlLFxuICAgICAgICAgIHNpemU6IHsuLi5vcmlnaW5hbFNpemV9XG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zZm9ybWVkOiB7XG4gICAgICAgICAgYmFzZTY0OiBsb2FkZWRJbWFnZS5vcmlnaW5hbCEuYmFzZTY0LFxuICAgICAgICAgIGltYWdlOiBsb2FkZWRJbWFnZS5vcmlnaW5hbCEuaW1hZ2UsXG4gICAgICAgICAgc2l6ZTogey4uLm9yaWdpbmFsU2l6ZX1cbiAgICAgICAgfSxcbiAgICAgICAgZXhpZlRyYW5zZm9ybTogbG9hZGVkSW1hZ2UuZXhpZlRyYW5zZm9ybSFcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgdHJhbnNmb3JtZWRTaXplID0gdGhpcy5nZXRUcmFuc2Zvcm1lZFNpemUob3JpZ2luYWxTaXplLCBsb2FkZWRJbWFnZS5leGlmVHJhbnNmb3JtISwgY3JvcHBlclNldHRpbmdzKTtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSB0cmFuc2Zvcm1lZFNpemUud2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IHRyYW5zZm9ybWVkU2l6ZS5oZWlnaHQ7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY3R4Py5zZXRUcmFuc2Zvcm0oXG4gICAgICBsb2FkZWRJbWFnZS5leGlmVHJhbnNmb3JtIS5mbGlwID8gLTEgOiAxLFxuICAgICAgMCxcbiAgICAgIDAsXG4gICAgICAxLFxuICAgICAgY2FudmFzLndpZHRoIC8gMixcbiAgICAgIGNhbnZhcy5oZWlnaHQgLyAyXG4gICAgKTtcbiAgICBjdHg/LnJvdGF0ZShNYXRoLlBJICogKGNhbnZhc1JvdGF0aW9uIC8gMikpO1xuICAgIGN0eD8uZHJhd0ltYWdlKFxuICAgICAgbG9hZGVkSW1hZ2Uub3JpZ2luYWwhLmltYWdlLFxuICAgICAgLW9yaWdpbmFsU2l6ZS53aWR0aCAvIDIsXG4gICAgICAtb3JpZ2luYWxTaXplLmhlaWdodCAvIDJcbiAgICApO1xuICAgIGNvbnN0IHRyYW5zZm9ybWVkQmFzZTY0ID0gY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgIGNvbnN0IHRyYW5zZm9ybWVkSW1hZ2UgPSBhd2FpdCB0aGlzLmxvYWRJbWFnZUZyb21CYXNlNjQodHJhbnNmb3JtZWRCYXNlNjQpO1xuICAgIHJldHVybiB7XG4gICAgICBvcmlnaW5hbDoge1xuICAgICAgICBiYXNlNjQ6IGxvYWRlZEltYWdlLm9yaWdpbmFsIS5iYXNlNjQsXG4gICAgICAgIGltYWdlOiBsb2FkZWRJbWFnZS5vcmlnaW5hbCEuaW1hZ2UsXG4gICAgICAgIHNpemU6IHsuLi5vcmlnaW5hbFNpemV9XG4gICAgICB9LFxuICAgICAgdHJhbnNmb3JtZWQ6IHtcbiAgICAgICAgYmFzZTY0OiB0cmFuc2Zvcm1lZEJhc2U2NCxcbiAgICAgICAgaW1hZ2U6IHRyYW5zZm9ybWVkSW1hZ2UsXG4gICAgICAgIHNpemU6IHtcbiAgICAgICAgICB3aWR0aDogdHJhbnNmb3JtZWRJbWFnZS53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRyYW5zZm9ybWVkSW1hZ2UuaGVpZ2h0XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBleGlmVHJhbnNmb3JtOiBsb2FkZWRJbWFnZS5leGlmVHJhbnNmb3JtIVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGxvYWRJbWFnZUZyb21CYXNlNjQoaW1hZ2VCYXNlNjQ6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PigoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHJlc29sdmUoaW1hZ2UpO1xuICAgICAgaW1hZ2Uub25lcnJvciA9IHJlamVjdDtcbiAgICAgIGltYWdlLnNyYyA9IGltYWdlQmFzZTY0O1xuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VHJhbnNmb3JtZWRTaXplKFxuICAgIG9yaWdpbmFsU2l6ZTogeyB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciB9LFxuICAgIGV4aWZUcmFuc2Zvcm06IEV4aWZUcmFuc2Zvcm0sXG4gICAgY3JvcHBlclNldHRpbmdzOiBDcm9wcGVyU2V0dGluZ3NcbiAgKTogRGltZW5zaW9ucyB7XG4gICAgY29uc3QgY2FudmFzUm90YXRpb24gPSBjcm9wcGVyU2V0dGluZ3MuY2FudmFzUm90YXRpb24gKyBleGlmVHJhbnNmb3JtLnJvdGF0ZTtcbiAgICBpZiAoY3JvcHBlclNldHRpbmdzLmNvbnRhaW5XaXRoaW5Bc3BlY3RSYXRpbykge1xuICAgICAgaWYgKGNhbnZhc1JvdGF0aW9uICUgMikge1xuICAgICAgICBjb25zdCBtaW5XaWR0aFRvQ29udGFpbiA9IG9yaWdpbmFsU2l6ZS53aWR0aCAqIGNyb3BwZXJTZXR0aW5ncy5hc3BlY3RSYXRpbztcbiAgICAgICAgY29uc3QgbWluSGVpZ2h0VG9Db250YWluID0gb3JpZ2luYWxTaXplLmhlaWdodCAvIGNyb3BwZXJTZXR0aW5ncy5hc3BlY3RSYXRpbztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB3aWR0aDogTWF0aC5tYXgob3JpZ2luYWxTaXplLmhlaWdodCwgbWluV2lkdGhUb0NvbnRhaW4pLFxuICAgICAgICAgIGhlaWdodDogTWF0aC5tYXgob3JpZ2luYWxTaXplLndpZHRoLCBtaW5IZWlnaHRUb0NvbnRhaW4pXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBtaW5XaWR0aFRvQ29udGFpbiA9IG9yaWdpbmFsU2l6ZS5oZWlnaHQgKiBjcm9wcGVyU2V0dGluZ3MuYXNwZWN0UmF0aW87XG4gICAgICAgIGNvbnN0IG1pbkhlaWdodFRvQ29udGFpbiA9IG9yaWdpbmFsU2l6ZS53aWR0aCAvIGNyb3BwZXJTZXR0aW5ncy5hc3BlY3RSYXRpbztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB3aWR0aDogTWF0aC5tYXgob3JpZ2luYWxTaXplLndpZHRoLCBtaW5XaWR0aFRvQ29udGFpbiksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLm1heChvcmlnaW5hbFNpemUuaGVpZ2h0LCBtaW5IZWlnaHRUb0NvbnRhaW4pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNhbnZhc1JvdGF0aW9uICUgMikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGVpZ2h0OiBvcmlnaW5hbFNpemUud2lkdGgsXG4gICAgICAgIHdpZHRoOiBvcmlnaW5hbFNpemUuaGVpZ2h0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IG9yaWdpbmFsU2l6ZS53aWR0aCxcbiAgICAgIGhlaWdodDogb3JpZ2luYWxTaXplLmhlaWdodFxuICAgIH07XG4gIH1cbn1cbiJdfQ==