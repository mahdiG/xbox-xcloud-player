import xCloudPlayer from '../Library';
export default class AudioComponent {
    _client: xCloudPlayer;
    _audioSource: any;
    _mediaSource: any;
    _audioRender: any;
    constructor(client: xCloudPlayer);
    create(srcObject: any): void;
    getElementId(): string;
    getSource(): any;
    createMediaSource(): string;
    destroy(): void;
    _isSafari(): boolean;
}
//# sourceMappingURL=Audio.d.ts.map