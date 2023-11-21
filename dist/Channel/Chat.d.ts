import BaseChannel from './Base';
export default class ChatChannel extends BaseChannel {
    isCapturing: boolean;
    isPaused: boolean;
    onOpen(event: any): void;
    start(): void;
    onMessage(event: any): void;
    onClose(event: any): void;
    startMic(): void;
    stopMic(): void;
}
//# sourceMappingURL=Chat.d.ts.map