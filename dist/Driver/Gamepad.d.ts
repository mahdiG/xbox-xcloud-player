import xCloudPlayer from '../Library';
import { InputFrame } from '../Channel/Input';
export default class GamepadDriver {
    _application: xCloudPlayer | null;
    _gamepads: Array<any>;
    _activeGamepadIndex: number;
    _shadowGamepad: {
        0: {
            A: number;
            B: number;
            X: number;
            Y: number;
            LeftShoulder: number;
            RightShoulder: number;
            LeftTrigger: number;
            RightTrigger: number;
            View: number;
            Menu: number;
            LeftThumb: number;
            RightThumb: number;
            DPadUp: number;
            DPadDown: number;
            DPadLeft: number;
            DPadRight: number;
            Nexus: number;
            LeftThumbXAxis: number;
            LeftThumbYAxis: number;
            RightThumbXAxis: number;
            RightThumbYAxis: number;
        };
    };
    setApplication(application: xCloudPlayer): void;
    start(): void;
    stop(): void;
    pressButton(index: number, button: string): void;
    setInput(input: any): void;
    run(): void;
    requestState(): InputFrame | null;
    mapStateLabels(buttons: any, axes: any): InputFrame;
}
//# sourceMappingURL=Gamepad.d.ts.map