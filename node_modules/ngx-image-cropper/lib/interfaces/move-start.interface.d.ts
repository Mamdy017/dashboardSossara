import { ImageTransform } from './image-transform.interface';
export interface MoveStart {
    active: boolean;
    type: MoveTypes | null;
    position: string | null;
    transform?: ImageTransform;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    clientX: number;
    clientY: number;
}
export declare enum MoveTypes {
    Drag = "drag",
    Move = "move",
    Resize = "resize",
    Pinch = "pinch"
}
