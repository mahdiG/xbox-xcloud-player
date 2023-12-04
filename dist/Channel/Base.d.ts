import xCloudPlayer from '../Library';
export default class BaseChannel {
    _client: xCloudPlayer;
    _channelName: string;
    _state: 'new' | 'connected' | 'closing' | 'closed';
    _events: {
        state: never[];
    };
    constructor(channelName: string, client: xCloudPlayer);
    onOpen(event: any): void;
    onClosing(event: any): void;
    onClose(event: any): void;
    destroy(): void;
    setState(state: any): void;
    send(data: any): void;
    getClient(): xCloudPlayer;
    addEventListener(name: any, callback: any): void;
    emitEvent(name: any, event: any): void;
}
//# sourceMappingURL=Base.d.ts.map