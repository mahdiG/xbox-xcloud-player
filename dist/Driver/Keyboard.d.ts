import { InputFrame } from '../Channel/Input';
export default class KeyboardDriver {
    _keyboardState: InputFrame;
    _downFunc: (e: KeyboardEvent) => void;
    _upFunc: (e: KeyboardEvent) => void;
    start(): void;
    stop(): void;
    onKeyDown(e: any): void;
    onKeyUp(e: any): void;
    onKeyChange(e: KeyboardEvent, down: boolean): void;
    requestState(): InputFrame;
    pressButton(button: string): void;
}
//# sourceMappingURL=Keyboard.d.ts.map