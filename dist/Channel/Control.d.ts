import BaseChannel from './Base';
export default class ControlChannel extends BaseChannel {
    onOpen(event: any): void;
    start(): void;
    onMessage(event: any): void;
    onClose(event: any): void;
    requestKeyframeRequest(): void;
}
//# sourceMappingURL=Control.d.ts.map