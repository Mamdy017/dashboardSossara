export class CropperSettings {
    constructor() {
        // From options
        this.format = 'png';
        this.maintainAspectRatio = true;
        this.transform = {};
        this.aspectRatio = 1;
        this.resetCropOnAspectRatioChange = true;
        this.resizeToWidth = 0;
        this.resizeToHeight = 0;
        this.cropperMinWidth = 0;
        this.cropperMinHeight = 0;
        this.cropperMaxHeight = 0;
        this.cropperMaxWidth = 0;
        this.cropperStaticWidth = 0;
        this.cropperStaticHeight = 0;
        this.canvasRotation = 0;
        this.initialStepSize = 3;
        this.roundCropper = false;
        this.onlyScaleDown = false;
        this.imageQuality = 92;
        this.autoCrop = true;
        this.backgroundColor = null;
        this.containWithinAspectRatio = false;
        this.hideResizeSquares = false;
        this.alignImage = 'center';
        // Internal
        this.cropperScaledMinWidth = 20;
        this.cropperScaledMinHeight = 20;
        this.cropperScaledMaxWidth = 20;
        this.cropperScaledMaxHeight = 20;
        this.stepSize = this.initialStepSize;
    }
    setOptions(options) {
        Object.keys(options)
            .filter((k) => k in this)
            .forEach((k) => this[k] = options[k]);
        this.validateOptions();
    }
    setOptionsFromChanges(changes) {
        Object.keys(changes)
            .filter((k) => k in this)
            .forEach((k) => this[k] = changes[k].currentValue);
        this.validateOptions();
    }
    validateOptions() {
        if (this.maintainAspectRatio && !this.aspectRatio) {
            throw new Error('`aspectRatio` should > 0 when `maintainAspectRatio` is enabled');
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JvcHBlci5zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1pbWFnZS1jcm9wcGVyL3NyYy9saWIvaW50ZXJmYWNlcy9jcm9wcGVyLnNldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE1BQU0sT0FBTyxlQUFlO0lBQTVCO1FBRUUsZUFBZTtRQUNmLFdBQU0sR0FBaUIsS0FBSyxDQUFDO1FBQzdCLHdCQUFtQixHQUFHLElBQUksQ0FBQztRQUMzQixjQUFTLEdBQW1CLEVBQUUsQ0FBQztRQUMvQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixpQ0FBNEIsR0FBRyxJQUFJLENBQUM7UUFDcEMsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFDbEIsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFDbkIsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLHFCQUFnQixHQUFHLENBQUMsQ0FBQztRQUNyQixvQkFBZSxHQUFHLENBQUMsQ0FBQztRQUNwQix1QkFBa0IsR0FBRyxDQUFDLENBQUM7UUFDdkIsd0JBQW1CLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFDaEIsb0JBQWUsR0FBa0IsSUFBSSxDQUFDO1FBQ3RDLDZCQUF3QixHQUFHLEtBQUssQ0FBQztRQUNqQyxzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIsZUFBVSxHQUFzQixRQUFRLENBQUM7UUFFekMsV0FBVztRQUNYLDBCQUFxQixHQUFHLEVBQUUsQ0FBQztRQUMzQiwyQkFBc0IsR0FBRyxFQUFFLENBQUM7UUFDNUIsMEJBQXFCLEdBQUcsRUFBRSxDQUFDO1FBQzNCLDJCQUFzQixHQUFHLEVBQUUsQ0FBQztRQUM1QixhQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQXFCbEMsQ0FBQztJQW5CQyxVQUFVLENBQUMsT0FBZ0M7UUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDakIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO2FBQ3hCLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUUsSUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFJLE9BQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQscUJBQXFCLENBQUMsT0FBc0I7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDakIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO2FBQ3hCLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUUsSUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVPLGVBQWU7UUFDckIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2pELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztTQUNuRjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENyb3BwZXJPcHRpb25zLCBPdXRwdXRGb3JtYXQgfSBmcm9tICcuL2Nyb3BwZXItb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSW1hZ2VUcmFuc2Zvcm0gfSBmcm9tICcuL2ltYWdlLXRyYW5zZm9ybS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY2xhc3MgQ3JvcHBlclNldHRpbmdzIHtcblxuICAvLyBGcm9tIG9wdGlvbnNcbiAgZm9ybWF0OiBPdXRwdXRGb3JtYXQgPSAncG5nJztcbiAgbWFpbnRhaW5Bc3BlY3RSYXRpbyA9IHRydWU7XG4gIHRyYW5zZm9ybTogSW1hZ2VUcmFuc2Zvcm0gPSB7fTtcbiAgYXNwZWN0UmF0aW8gPSAxO1xuICByZXNldENyb3BPbkFzcGVjdFJhdGlvQ2hhbmdlID0gdHJ1ZTtcbiAgcmVzaXplVG9XaWR0aCA9IDA7XG4gIHJlc2l6ZVRvSGVpZ2h0ID0gMDtcbiAgY3JvcHBlck1pbldpZHRoID0gMDtcbiAgY3JvcHBlck1pbkhlaWdodCA9IDA7XG4gIGNyb3BwZXJNYXhIZWlnaHQgPSAwO1xuICBjcm9wcGVyTWF4V2lkdGggPSAwO1xuICBjcm9wcGVyU3RhdGljV2lkdGggPSAwO1xuICBjcm9wcGVyU3RhdGljSGVpZ2h0ID0gMDtcbiAgY2FudmFzUm90YXRpb24gPSAwO1xuICBpbml0aWFsU3RlcFNpemUgPSAzO1xuICByb3VuZENyb3BwZXIgPSBmYWxzZTtcbiAgb25seVNjYWxlRG93biA9IGZhbHNlO1xuICBpbWFnZVF1YWxpdHkgPSA5MjtcbiAgYXV0b0Nyb3AgPSB0cnVlO1xuICBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBjb250YWluV2l0aGluQXNwZWN0UmF0aW8gPSBmYWxzZTtcbiAgaGlkZVJlc2l6ZVNxdWFyZXMgPSBmYWxzZTtcbiAgYWxpZ25JbWFnZTogJ2xlZnQnIHwgJ2NlbnRlcicgPSAnY2VudGVyJztcblxuICAvLyBJbnRlcm5hbFxuICBjcm9wcGVyU2NhbGVkTWluV2lkdGggPSAyMDtcbiAgY3JvcHBlclNjYWxlZE1pbkhlaWdodCA9IDIwO1xuICBjcm9wcGVyU2NhbGVkTWF4V2lkdGggPSAyMDtcbiAgY3JvcHBlclNjYWxlZE1heEhlaWdodCA9IDIwO1xuICBzdGVwU2l6ZSA9IHRoaXMuaW5pdGlhbFN0ZXBTaXplO1xuXG4gIHNldE9wdGlvbnMob3B0aW9uczogUGFydGlhbDxDcm9wcGVyT3B0aW9ucz4pOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zKVxuICAgICAgLmZpbHRlcigoaykgPT4gayBpbiB0aGlzKVxuICAgICAgLmZvckVhY2goKGspID0+ICh0aGlzIGFzIGFueSlba10gPSAob3B0aW9ucyBhcyBhbnkpW2tdKTtcbiAgICB0aGlzLnZhbGlkYXRlT3B0aW9ucygpO1xuICB9XG5cbiAgc2V0T3B0aW9uc0Zyb21DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyhjaGFuZ2VzKVxuICAgICAgLmZpbHRlcigoaykgPT4gayBpbiB0aGlzKVxuICAgICAgLmZvckVhY2goKGspID0+ICh0aGlzIGFzIGFueSlba10gPSBjaGFuZ2VzW2tdLmN1cnJlbnRWYWx1ZSk7XG4gICAgdGhpcy52YWxpZGF0ZU9wdGlvbnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVPcHRpb25zKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1haW50YWluQXNwZWN0UmF0aW8gJiYgIXRoaXMuYXNwZWN0UmF0aW8pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYGFzcGVjdFJhdGlvYCBzaG91bGQgPiAwIHdoZW4gYG1haW50YWluQXNwZWN0UmF0aW9gIGlzIGVuYWJsZWQnKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==