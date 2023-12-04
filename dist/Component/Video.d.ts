import xCloudPlayer from '../Library';
export default class VideoComponent {
    _client: xCloudPlayer;
    _videoSource: any;
    _mediaSource: any;
    _videoRender: any;
    _focusEvent: any;
    _framekeyInterval: any;
    _videoFps: any;
    constructor(client: xCloudPlayer);
    create(srcObject: any): void;
    getElementId(): string;
    getSource(): any;
    createMediaSource(): string;
    destroy(): void;
}
//# sourceMappingURL=Video.d.ts.map