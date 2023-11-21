import FpsCounter from '../Helper/FpsCounter';
import BaseChannel from './Base';
export interface InputFrame {
    GamepadIndex: number;
    Nexus: number;
    Menu: number;
    View: number;
    A: number;
    B: number;
    X: number;
    Y: number;
    DPadUp: number;
    DPadDown: number;
    DPadLeft: number;
    DPadRight: number;
    LeftShoulder: number;
    RightShoulder: number;
    LeftThumb: number;
    RightThumb: number;
    LeftThumbXAxis: number;
    LeftThumbYAxis: number;
    RightThumbXAxis: number;
    RightThumbYAxis: number;
    LeftTrigger: number;
    RightTrigger: number;
}
export interface PointerFrame {
    events: Array<any>;
}
export interface MouseFrame {
    X: number;
    Y: number;
    WheelX: number;
    WheelY: number;
    Buttons: number;
    Relative: number;
}
export interface KeyboardFrame {
    pressed: boolean;
    keyCode: number;
    key: string;
}
export default class InputChannel extends BaseChannel {
    _inputSequenceNum: number;
    _reportTypes: {
        None: number;
        Metadata: number;
        Gamepad: number;
        Pointer: number;
        ClientMetadata: number;
        ServerMetadata: number;
        Mouse: number;
        Keyboard: number;
        Vibration: number;
        Sendor: number;
    };
    _frameMetadataQueue: Array<any>;
    _gamepadFrames: Array<InputFrame>;
    _pointerFrames: Array<PointerFrame>;
    _pointerCounter: number;
    _mouseFrames: Array<MouseFrame>;
    _keyboardFrames: Array<KeyboardFrame>;
    _inputInterval: any;
    _keyboardEvents: Array<any>;
    _metadataFps: FpsCounter;
    _inputFps: FpsCounter;
    _rumbleInterval: any;
    _rumbleEnabled: boolean;
    _adhocState: any;
    constructor(channelName: any, client: any);
    onOpen(event: any): void;
    start(): void;
    mergeState(gpState: InputFrame, kbState: InputFrame, adHoc: InputFrame): InputFrame;
    mergeAxix(axis1: number, axis2: number): number;
    onMessage(event: any): void;
    onClose(event: any): void;
    _createInputPacket(reportType: any, metadataQueue: Array<any>, gamepadQueue: Array<InputFrame>, pointerQueue: Array<PointerFrame>, mouseQueue: Array<MouseFrame>, keyboardQueue: Array<KeyboardFrame>): DataView;
    getGamepadQueue(size?: number): InputFrame[];
    getGamepadQueueLength(): number;
    queueGamepadState(input: InputFrame): number | undefined;
    getPointerQueue(size?: number): PointerFrame[];
    getPointerQueueLength(): number;
    getMouseQueue(size?: number): MouseFrame[];
    getMouseQueueLength(): number;
    getKeyboardQueue(size?: number): KeyboardFrame[];
    getKeyboardQueueLength(): number;
    onPointerMove(e: any): void;
    requestPointerLockWithUnadjustedMovement(element: any): any;
    _touchEvents: {};
    _touchLastPointerId: number;
    onPointerClick(e: any): void;
    onPointerScroll(e: any): void;
    _mouseActive: boolean;
    _mouseLocked: boolean;
    _touchActive: boolean;
    _mouseStateButtons: number;
    _mouseStateX: number;
    _mouseStateY: number;
    onKeyDown(event: any): void;
    onKeyUp(event: any): void;
    _keyboardButtonsState: {};
    convertAbsoluteMousePositionImpl(e: any, t: any, i: any, n: any): number[];
    _convertToInt16(e: any): number;
    _convertToUInt16(e: any): number;
    normalizeTriggerValue(e: any): number;
    normalizeAxisValue(e: any): number;
    pressButton(index: number, button: string): void;
    destroy(): void;
    addProcessedFrame(frame: any): void;
    getMetadataQueue(size?: number): any[];
    getMetadataQueueLength(): number;
}
//# sourceMappingURL=Input.d.ts.map