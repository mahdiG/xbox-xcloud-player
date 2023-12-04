import { InputFrame, PointerFrame, MouseFrame, KeyboardFrame } from '../Input';
declare enum ReportTypes {
    None = 0,
    Metadata = 1,
    Gamepad = 2,
    Pointer = 4,
    ClientMetadata = 8,
    ServerMetadata = 16,
    Mouse = 32,
    Keyboard = 64,
    Vibration = 128,
    Sensor = 256
}
export default class InputPacket {
    _reportType: ReportTypes;
    _totalSize: number;
    _sequence: number;
    _metadataFrames: Array<any>;
    _gamepadFrames: Array<InputFrame>;
    _pointerFrames: Array<PointerFrame>;
    _mouseFrames: Array<MouseFrame>;
    _keyboardFrames: Array<KeyboardFrame>;
    _maxTouchpoints: number;
    constructor(sequence: any);
    setMetadata(maxTouchpoints?: number): void;
    setData(metadataQueue: Array<any>, gamepadQueue: Array<InputFrame>, pointerQueue: Array<PointerFrame>, mouseQueue: Array<MouseFrame>, keyboardQueue: Array<KeyboardFrame>): void;
    _calculateMetadataSize(frames: any): number;
    _calculateGamepadSize(frames: Array<InputFrame>): number;
    _calculatePointerSize(frames: Array<PointerFrame>): number;
    _calculateMouseSize(frames: Array<MouseFrame>): number;
    _calculateKeyboardSize(frames: Array<KeyboardFrame>): number;
    _writeMetadataData(packet: DataView, offset: number, frames: Array<any>): number;
    _writeGamepadData(packet: DataView, offset: number, frames: Array<InputFrame>): number;
    _writePointerData(packet: DataView, offset: number, frames: Array<PointerFrame>): number;
    _writeMouseData(packet: DataView, offset: number, frames: Array<MouseFrame>): number;
    _writeKeyboardData(packet: DataView, offset: number, frames: Array<KeyboardFrame>): number;
    toBuffer(): DataView;
    _normalizeTriggerValue(e: any): number;
    _normalizeAxisValue(e: any): number;
    _convertToInt16(e: any): number;
    _convertToUInt16(e: any): number;
}
export {};
//# sourceMappingURL=Packet.d.ts.map