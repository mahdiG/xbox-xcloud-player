"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
class ChatChannel extends Base_1.default {
    constructor() {
        super(...arguments);
        this.isCapturing = false;
        this.isPaused = true;
    }
    onOpen(event) {
        super.onOpen(event);
        // console.log('xCloudPlayer Channel/Control.ts - ['+this._channelName+'] onOpen:', event)
    }
    start() {
        // Do nothing
    }
    onMessage(event) {
        console.log('xCloudPlayer Channel/Chat.ts - [' + this._channelName + '] onMessage:', event);
        const jsonMessage = JSON.parse(event.data);
        console.log('xCloudPlayer Channel/Chat.ts - Received json:', jsonMessage);
    }
    onClose(event) {
        super.onClose(event);
        // console.log('xCloudPlayer Channel/Control.ts - ['+this._channelName+'] onClose:', event)
    }
    startMic() {
        console.log('xCloudPlayer Channel/Chat.ts - Enabling Microphone');
        if (this.isCapturing === false) {
            console.log('Start chat...');
            navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 24e3,
                },
            }).then((stream) => {
                this.isCapturing = true;
                const audioTracks = stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    console.log(`Using Audio device: ${audioTracks[0].label}`);
                }
                else {
                    console.log('No Audio device:', audioTracks);
                }
                stream.getTracks().forEach(track => {
                    this._client._webrtcClient.addTrack(track, stream);
                });
                this._client.sdpNegotiationChat();
            }).catch(e => {
                alert(`getUserMedia() error: ${e.name}`);
                this.isCapturing = false;
            });
        }
        this.isPaused = false;
    }
    stopMic() {
        var _a;
        console.log('xCloudPlayer Channel/Chat.ts - Disabling Microphone');
        const senders = this._client._webrtcClient.getSenders();
        for (const sender in senders) {
            if (senders[sender].track !== null) {
                if (((_a = senders[sender].track) === null || _a === void 0 ? void 0 : _a.kind) === 'audio') {
                    this._client._webrtcClient.removeTrack(senders[sender]);
                }
            }
        }
        this.isCapturing = false;
        this.isPaused = true;
    }
}
exports.default = ChatChannel;
//# sourceMappingURL=Chat.js.map