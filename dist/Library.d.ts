import EventBus from './Helper/EventBus';
import KeyboardDriver from './Driver/Keyboard';
interface xCloudPlayerConfig {
    ui_systemui?: Array<number>;
    ui_version?: Array<number>;
    ui_touchenabled?: boolean;
    input_driver?: any;
    sound_force_mono?: boolean;
    input_touch?: boolean;
    input_mousekeyboard?: boolean;
    input_legacykeyboard?: boolean;
}
export declare class xCloudPlayerBackend {
    _config: {
        locale: string;
    };
    sessionId: string;
    setSessionId(sessionId: any): void;
    getConsoles(): any;
    startSession(type: 'home' | 'cloud', sessionId: any): Promise<unknown>;
    waitState(): Promise<unknown>;
    sendSDPOffer(sdpOffer: any): Promise<unknown>;
    sendSDPChatOffer(sdpOffer: any): Promise<unknown>;
    sendICECandidates(iceCandidates: any): Promise<unknown>;
    readBody(fetchparam: any): any;
}
export default class xCloudPlayer {
    _config: xCloudPlayerConfig;
    _webrtcClient: RTCPeerConnection;
    _eventBus: EventBus;
    _isResetting: boolean;
    _webrtcConfiguration: {
        iceServers: {
            urls: string;
        }[];
    };
    _webrtcDataChannelsConfig: {
        input: {
            ordered: boolean;
            protocol: string;
        };
        chat: {
            protocol: string;
        };
        control: {
            protocol: string;
        };
        message: {
            protocol: string;
        };
    };
    _webrtcStates: {
        iceGathering: string;
        iceConnection: string;
        iceCandidates: never[];
        streamConnection: string;
    };
    _webrtcDataChannels: {};
    _webrtcChannelProcessors: {};
    _iceCandidates: Array<RTCIceCandidate>;
    _elementHolder: string;
    _elementHolderRandom: number;
    _inputDriver: any;
    _keyboardDriver: KeyboardDriver;
    _videoComponent: any;
    _audioComponent: any;
    _codecPreference: string;
    _maxVideoBitrate: number;
    _maxAudioBitrate: number;
    constructor(elementId: string, config?: xCloudPlayerConfig);
    createOffer(): Promise<unknown>;
    _sdpHandler: any;
    sdpNegotiationChat(): void;
    setSdpHandler(listener: any): void;
    setAudioBitrate(bitrate_kbps: number): void;
    setVideoBitrate(bitrate_kbps: number): void;
    setControllerRumble(state: boolean): void;
    _setBitrate(sdp: any, media: any, bitrate: any): any;
    setCodecPreferences(mimeType: string): void;
    _setCodec(mimeType: string): void;
    setRemoteOffer(sdpdata: string): void;
    reset(): void;
    getIceCandidates(): RTCIceCandidate[];
    setIceCandidates(iceDetails: any): void;
    getChannel(name: string): any;
    _openDataChannels(): void;
    _openDataChannel(name: string, config: any): void;
    _gatherIce(): void;
    getDataChannel(name: string): any;
    getChannelProcessor(name: string): any;
    getEventBus(): EventBus;
    setGamepadInput(input: any): void;
}
export {};
//# sourceMappingURL=Library.d.ts.map